"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClient as createServerClient,
  createServiceClient,
} from "@/lib/supabase/server";
import { sendNewRequestAdminEmail } from "@/lib/email";

/**
 * Retourne une URL signée (valide 2 min) pour le PDF programme d'une formation
 * stocké dans le bucket Supabase "formation-programs" sous le nom <id>.pdf.
 */
export async function getFormationProgramUrlAction(path: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };

  const admin = createServiceClient();
  const { data: signed, error } = await admin.storage
    .from("formation-programs")
    .createSignedUrl(path, 120);
  if (error || !signed)
    return { ok: false as const, error: error?.message ?? "Introuvable" };
  return { ok: true as const, url: signed.signedUrl };
}

export async function submitFormationRequestAction(formData: FormData) {
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

  const formationId = String(formData.get("formationId") || "").trim();
  const formationTitle = String(formData.get("formationTitle") || "").trim();
  const formationCategory = String(formData.get("formationCategory") || "").trim();
  const kind = String(formData.get("kind") || "initiale"); // initiale | recyclage
  const objectives = String(formData.get("objectives") || "").trim() || null;
  const participants = formData.get("participants")
    ? Number(formData.get("participants"))
    : null;
  const audienceLevel = String(formData.get("audienceLevel") || "").trim() || null;
  const startDate = String(formData.get("startDate") || "") || null;
  const format = String(formData.get("format") || "presentiel");
  const location = String(formData.get("location") || "").trim() || null;
  const pshPresent = String(formData.get("pshPresent") || "false") === "true";
  const accommodations = JSON.parse(String(formData.get("accommodations") || "[]"));
  const accommodationsDetails =
    String(formData.get("accommodationsDetails") || "").trim() || null;
  const financingModes = JSON.parse(String(formData.get("financingModes") || "[]"));
  const opcoName = String(formData.get("opcoName") || "").trim() || null;
  const financingOther = String(formData.get("financingOther") || "").trim() || null;
  const contactName = String(formData.get("contactName") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const attachment = formData.get("attachment") as File | null;

  // Consolidation des infos de financement pour la description de la demande.
  const financingSummary = [
    ...financingModes.filter((m: string) => m !== "OPCO" && m !== "Autre (à préciser)"),
    opcoName ? `OPCO : ${opcoName}` : financingModes.includes("OPCO") ? "OPCO (à préciser)" : null,
    financingOther
      ? `Autre : ${financingOther}`
      : financingModes.includes("Autre (à préciser)")
        ? "Autre (à préciser)"
        : null,
  ]
    .filter(Boolean)
    .join(" · ") || null;

  if (!formationId || !contactName || !contactEmail || !contactPhone) {
    return { ok: false, error: "Tous les champs obligatoires doivent être remplis." };
  }

  const admin = createServiceClient();

  // Upload pièce jointe (réutilise le bucket job-specs).
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

  // Insert. On utilise job_label comme titre principal pour la lisibilité
  // dans les listes/back-office, et formation_id/title pour la traçabilité catalogue.
  const { error: insertError, data: insertedRow } = await admin
    .from("requests")
    .insert({
      client_id: clientRow.id,
      created_by: user.id,
      request_type: "formation",
      job_label: formationTitle,
      formation_id: formationId,
      formation_title: `${formationTitle}${kind === "recyclage" ? " — Recyclage" : ""}`,
      formation_category: formationCategory,
      headcount: participants ?? 1,
      training_participants: participants,
      training_audience_level: audienceLevel,
      training_objectives: objectives,
      training_format: format,
      start_date: startDate,
      location,
      psh_present: pshPresent,
      accommodations,
      accommodations_details: accommodationsDetails,
      budget_hint: financingSummary,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      job_spec_path: attachmentPath,
      description: objectives,
    })
    .select("id, reference")
    .single();

  if (insertError) {
    if (attachmentPath) {
      await admin.storage.from("job-specs").remove([attachmentPath]);
    }
    return { ok: false, error: insertError.message };
  }

  // Email admin
  try {
    await sendNewRequestAdminEmail({
      requestId: insertedRow.id,
      reference: insertedRow.reference,
      clientCompanyName: fullClient?.company_name ?? "Client",
      jobLabel: `[FORMATION] ${formationTitle}`,
      headcount: participants ?? 1,
      startDate: startDate ?? "à définir",
      location: location ?? "—",
    });
  } catch (e) {
    console.error("[submitFormation] admin notification failed:", e);
  }

  revalidatePath("/client");
  redirect("/client?status=pending");
}
