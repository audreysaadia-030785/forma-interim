"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";

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

export async function createCandidateAction(formData: FormData) {
  try {
    await requireAdmin();
  } catch (e) {
    console.error("[createCandidate] auth failed:", e);
    return { ok: false, error: (e as Error).message };
  }

  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const headline = String(formData.get("headline") || "").trim() || null;
  const cv = formData.get("cv") as File | null;

  console.log("[createCandidate] fields:", {
    firstName,
    lastName,
    headline,
    hasFile: !!cv,
    fileName: cv?.name,
    fileSize: cv?.size,
    fileType: cv?.type,
  });

  if (!firstName || !lastName) {
    return { ok: false, error: "Prénom et nom obligatoires." };
  }
  if (!cv || cv.size === 0) {
    return { ok: false, error: "CV obligatoire (fichier vide ou absent)." };
  }

  const admin = createServiceClient();

  // 1) Upload du CV dans le bucket "candidate-cvs".
  const timestamp = Date.now();
  const safeName = cv.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${timestamp}-${safeName}`;

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await cv.arrayBuffer();
  } catch (e) {
    console.error("[createCandidate] arrayBuffer failed:", e);
    return { ok: false, error: `Lecture du fichier : ${(e as Error).message}` };
  }

  const { error: uploadError } = await admin.storage
    .from("candidate-cvs")
    .upload(path, arrayBuffer, {
      contentType: cv.type || "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("[createCandidate] upload failed:", uploadError);
    return { ok: false, error: `Upload CV : ${uploadError.message}` };
  }

  // 2) Insertion du candidat.
  const { error: insertError, data: inserted } = await admin
    .from("candidates")
    .insert({
      first_name: firstName,
      last_name: lastName,
      headline,
      cv_path: path,
      cv_file_name: cv.name,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[createCandidate] insert failed:", insertError);
    // Rollback upload.
    await admin.storage.from("candidate-cvs").remove([path]);
    return { ok: false, error: `Enregistrement : ${insertError.message}` };
  }

  console.log("[createCandidate] success, id:", inserted?.id);
  revalidatePath("/admin/candidats");
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

  // 1) Supprimer le fichier du storage (RGPD).
  if (candidate?.cv_path) {
    await admin.storage.from("candidate-cvs").remove([candidate.cv_path]);
  }

  // 2) Supprimer l'enregistrement.
  const { error } = await admin.from("candidates").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/candidats");
  return { ok: true };
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
    .createSignedUrl(candidate.cv_path, 120); // 2 min

  if (error) return { ok: false, error: error.message };
  return { ok: true, url: signed.signedUrl };
}
