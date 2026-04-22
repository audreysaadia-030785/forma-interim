"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";
import { parseCvFromPdf, type ParsedCandidate } from "@/lib/cv-parser";

async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Accès refusé");
  return { supabase, user };
}

/**
 * Upload + parsing IA du CV. Retourne les données extraites sans encore
 * les sauvegarder en base. L'admin valide ensuite via saveCandidateAction.
 */
export async function parseCvAction(
  formData: FormData,
): Promise<{ ok: true; parsed: ParsedCandidate; cvPath: string; fileName: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const cv = formData.get("cv") as File | null;
  if (!cv || cv.size === 0) {
    return { ok: false, error: "Fichier CV absent ou vide." };
  }
  if (cv.size > 10 * 1024 * 1024) {
    return { ok: false, error: "Fichier trop volumineux (max 10 Mo)." };
  }

  // 1. Lire le buffer.
  const arrayBuffer = await cv.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Upload dans le bucket en tant que fichier "temporaire" (path unique).
  const admin = createServiceClient();
  const timestamp = Date.now();
  const safeName = cv.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cvPath = `${timestamp}-${safeName}`;
  const { error: uploadError } = await admin.storage
    .from("candidate-cvs")
    .upload(cvPath, buffer, {
      contentType: cv.type || "application/pdf",
    });
  if (uploadError) {
    return { ok: false, error: `Upload CV : ${uploadError.message}` };
  }

  // 3. Parser le PDF avec Claude.
  let parsed: ParsedCandidate;
  try {
    parsed = await parseCvFromPdf(buffer);
  } catch (e) {
    console.error("[parseCv] Claude failed:", e);
    // Si le parsing échoue, on conserve quand même le CV uploadé,
    // l'admin pourra créer le candidat à la main.
    return {
      ok: false,
      error: `Parsing IA : ${(e as Error).message}. Vous pouvez créer le candidat manuellement.`,
    };
  }

  return { ok: true, parsed, cvPath, fileName: cv.name };
}

/** Enregistre le candidat une fois que l'admin a relu/ajusté les infos. */
export async function saveCandidateAction(data: {
  cvPath: string;
  cvFileName: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  headline?: string | null;
  primaryRomeCode?: string | null;
  primaryRomeLabel?: string | null;
  secondaryRomeCodes?: string[];
  experienceYears?: number | null;
  experiences?: ParsedCandidate["experiences"];
  education?: ParsedCandidate["education"];
  languages?: ParsedCandidate["languages"];
  habilitations?: string[];
  permis?: string[];
  skills?: string[];
  mobilityRadiusKm?: number | null;
  availableFrom?: string | null;
  preferredContractTypes?: string[];
  expectedHourlyRateMinEur?: number | null;
  expectedHourlyRateMaxEur?: number | null;
  internalNotes?: string | null;
  tags?: string[];
  rating?: number | null;
}) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }

  if (!data.firstName.trim() || !data.lastName.trim()) {
    return { ok: false as const, error: "Prénom et nom obligatoires." };
  }

  const admin = createServiceClient();
  const { error: insertError, data: inserted } = await admin
    .from("candidates")
    .insert({
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      location: data.location?.trim() || null,
      headline: data.headline?.trim() || null,
      primary_rome_code: data.primaryRomeCode || null,
      primary_rome_label: data.primaryRomeLabel || null,
      secondary_rome_codes: data.secondaryRomeCodes ?? [],
      experience_years: data.experienceYears ?? null,
      experiences: data.experiences ?? [],
      education: data.education ?? [],
      languages: data.languages ?? [],
      habilitations: data.habilitations ?? [],
      permis: data.permis ?? [],
      skills: data.skills ?? [],
      mobility_radius_km: data.mobilityRadiusKm ?? null,
      available_from: data.availableFrom || null,
      preferred_contract_types: data.preferredContractTypes ?? [],
      expected_hourly_rate_min_eur: data.expectedHourlyRateMinEur ?? null,
      expected_hourly_rate_max_eur: data.expectedHourlyRateMaxEur ?? null,
      internal_notes: data.internalNotes?.trim() || null,
      tags: data.tags ?? [],
      rating: data.rating ?? null,
      cv_path: data.cvPath,
      cv_file_name: data.cvFileName,
    })
    .select("id")
    .single();

  if (insertError) {
    // Rollback upload si insert échoue.
    await admin.storage.from("candidate-cvs").remove([data.cvPath]);
    return { ok: false as const, error: insertError.message };
  }

  revalidatePath("/admin/candidats");
  return { ok: true as const, id: inserted?.id };
}

/** Annule un parsing en cours : supprime le CV uploadé temporairement. */
export async function discardParsedCvAction(cvPath: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createServiceClient();
  await admin.storage.from("candidate-cvs").remove([cvPath]);
  return { ok: true };
}

export async function deleteCandidateAction(id: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createServiceClient();
  const { data: candidate } = await admin
    .from("candidates")
    .select("cv_path")
    .eq("id", id)
    .single();

  if (candidate?.cv_path) {
    await admin.storage.from("candidate-cvs").remove([candidate.cv_path]);
  }

  const { error } = await admin.from("candidates").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/candidats");
  return { ok: true };
}

export async function updateCandidateAction(
  id: string,
  updates: Parameters<typeof saveCandidateAction>[0] extends infer T
    ? Partial<Omit<T, "cvPath" | "cvFileName">>
    : never,
) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const payload: Record<string, unknown> = {};
  if (updates.firstName !== undefined) payload.first_name = updates.firstName;
  if (updates.lastName !== undefined) payload.last_name = updates.lastName;
  if (updates.email !== undefined) payload.email = updates.email || null;
  if (updates.phone !== undefined) payload.phone = updates.phone || null;
  if (updates.location !== undefined) payload.location = updates.location || null;
  if (updates.headline !== undefined) payload.headline = updates.headline || null;
  if (updates.primaryRomeCode !== undefined) payload.primary_rome_code = updates.primaryRomeCode || null;
  if (updates.primaryRomeLabel !== undefined) payload.primary_rome_label = updates.primaryRomeLabel || null;
  if (updates.secondaryRomeCodes !== undefined) payload.secondary_rome_codes = updates.secondaryRomeCodes;
  if (updates.experienceYears !== undefined) payload.experience_years = updates.experienceYears;
  if (updates.experiences !== undefined) payload.experiences = updates.experiences;
  if (updates.education !== undefined) payload.education = updates.education;
  if (updates.languages !== undefined) payload.languages = updates.languages;
  if (updates.habilitations !== undefined) payload.habilitations = updates.habilitations;
  if (updates.permis !== undefined) payload.permis = updates.permis;
  if (updates.skills !== undefined) payload.skills = updates.skills;
  if (updates.mobilityRadiusKm !== undefined) payload.mobility_radius_km = updates.mobilityRadiusKm;
  if (updates.availableFrom !== undefined) payload.available_from = updates.availableFrom;
  if (updates.preferredContractTypes !== undefined) payload.preferred_contract_types = updates.preferredContractTypes;
  if (updates.expectedHourlyRateMinEur !== undefined) payload.expected_hourly_rate_min_eur = updates.expectedHourlyRateMinEur;
  if (updates.expectedHourlyRateMaxEur !== undefined) payload.expected_hourly_rate_max_eur = updates.expectedHourlyRateMaxEur;
  if (updates.internalNotes !== undefined) payload.internal_notes = updates.internalNotes || null;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.rating !== undefined) payload.rating = updates.rating;

  const { error } = await admin.from("candidates").update(payload).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/candidats");
  revalidatePath(`/admin/candidats/${id}`);
  return { ok: true as const };
}

export async function getCandidateCvUrlAction(id: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createServiceClient();
  const { data: candidate } = await admin
    .from("candidates")
    .select("cv_path, cv_file_name")
    .eq("id", id)
    .single();

  if (!candidate?.cv_path) return { ok: false, error: "CV introuvable" };

  const { data: signed, error } = await admin.storage
    .from("candidate-cvs")
    .createSignedUrl(candidate.cv_path, 120);

  if (error) return { ok: false, error: error.message };
  return { ok: true, url: signed.signedUrl };
}
