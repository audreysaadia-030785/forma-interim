"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClient as createServerClient,
  createServiceClient,
} from "@/lib/supabase/server";
import { sendNewRequestAdminEmail } from "@/lib/email";

export async function submitAccompagnementRhAction(formData: FormData) {
  try {
    return await doSubmit(formData);
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest: unknown }).digest);
      if (
        digest.startsWith("NEXT_REDIRECT") ||
        digest.startsWith("NEXT_NOT_FOUND")
      ) {
        throw e;
      }
    }
    console.error("[submitAccompagnementRhAction] unhandled error:", e);
    return {
      ok: false as const,
      error: `Erreur serveur : ${(e as Error).message}`,
    };
  }
}

async function doSubmit(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, active")
    .eq("primary_user_id", user.id)
    .maybeSingle();

  if (!clientRow)
    return { ok: false, error: "Aucun compte client lié à cet utilisateur." };
  if (!clientRow.active)
    return {
      ok: false,
      error: "Votre compte est désactivé. Contactez ASCV CONSEILS.",
    };

  // Lecture des champs
  const missionTypes: string[] = JSON.parse(
    String(formData.get("missionTypes") ?? "[]"),
  );
  const missionOther = String(formData.get("missionOther") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const urgency = String(formData.get("urgency") ?? "normal");
  const startDate = String(formData.get("startDate") ?? "") || null;
  const durationWeeks = formData.get("durationWeeks")
    ? Number(formData.get("durationWeeks"))
    : null;
  const companySize = String(formData.get("companySize") ?? "") || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const remote = String(formData.get("remote") ?? "false") === "true";
  const budget = String(formData.get("budget") ?? "").trim() || null;
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const attachment = formData.get("attachment") as File | null;

  if (!description || !contactName || !contactEmail || !contactPhone) {
    return { ok: false, error: "Champs obligatoires manquants." };
  }

  if (missionTypes.length === 0) {
    return { ok: false, error: "Sélectionnez au moins un type de mission." };
  }

  const admin = createServiceClient();

  // Upload éventuel de la pièce jointe
  let attachmentPath: string | null = null;
  if (attachment && attachment.size > 0) {
    const timestamp = Date.now();
    const safeName = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${clientRow.id}/${timestamp}-${safeName}`;
    const buffer = await attachment.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("job-specs")
      .upload(path, buffer, {
        contentType: attachment.type || "application/octet-stream",
      });
    if (uploadError)
      return { ok: false, error: `Upload pièce jointe : ${uploadError.message}` };
    attachmentPath = path;
  }

  const { data: fullClient } = await admin
    .from("clients")
    .select("company_name")
    .eq("id", clientRow.id)
    .single();

  // Titre lisible pour le dashboard / email
  const missionLabel =
    missionTypes.length === 1
      ? missionLabelFor(missionTypes[0], missionOther)
      : `Accompagnement RH — ${missionTypes.length} missions combinées`;

  // Description enrichie qui rassemble les choix du client
  const enrichedDescription = [
    `Missions sélectionnées : ${missionTypes.map((t) => missionLabelFor(t, missionOther)).join(", ")}`,
    companySize ? `Taille entreprise : ${companySize.toUpperCase()}` : null,
    `Urgence : ${urgency}`,
    durationWeeks ? `Durée estimée : ${durationWeeks} semaines` : null,
    remote ? "Mission réalisable à distance." : null,
    budget ? `Budget envisagé : ${budget}` : null,
    "",
    description,
  ]
    .filter(Boolean)
    .join("\n");

  const { error: insertError, data: insertedRow } = await admin
    .from("requests")
    .insert({
      client_id: clientRow.id,
      created_by: user.id,
      request_type: "accompagnement_rh",
      job_label: missionLabel,
      headcount: 1,
      start_date: startDate,
      location: location ?? "À définir",
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      description: enrichedDescription,
      budget_hint: budget,
      job_spec_path: attachmentPath,
    })
    .select("id, reference")
    .single();

  if (insertError) {
    if (attachmentPath) {
      await admin.storage.from("job-specs").remove([attachmentPath]);
    }
    return { ok: false, error: insertError.message };
  }

  try {
    await sendNewRequestAdminEmail({
      requestId: insertedRow.id,
      reference: insertedRow.reference,
      clientCompanyName: fullClient?.company_name ?? "Client",
      jobLabel: `[RH] ${missionLabel}`,
      headcount: 1,
      startDate: startDate ?? "à définir",
      location: location ?? "—",
    });
  } catch (e) {
    console.error("[submitAccompagnementRh] admin notification failed:", e);
  }

  revalidatePath("/client");
  redirect("/client?status=pending");
}

function missionLabelFor(key: string, otherText: string | null): string {
  const map: Record<string, string> = {
    audit: "Audit / Diagnostic RH",
    structuration: "Structuration RH",
    plan_competences: "Plan de développement des compétences",
    conduite_changement: "Conduite du changement",
    gestion_conflit: "Gestion de conflit",
    rupture_contrat: "Rupture de contrat",
    entretiens: "Accompagnement entretiens",
    conseil_strategique: "Conseil stratégique RH",
    autre: otherText ? `Autre : ${otherText}` : "Autre",
  };
  return map[key] ?? key;
}
