"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";

export async function submitRequestAction(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  // Retrouver le client rattaché à ce user.
  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, active")
    .eq("primary_user_id", user.id)
    .maybeSingle();

  if (!clientRow) return { ok: false, error: "Aucun compte client lié à cet utilisateur." };
  if (!clientRow.active) return { ok: false, error: "Votre compte est désactivé. Contactez Forma Interim." };

  // Lire tous les champs du formulaire.
  const jobLabel = String(formData.get("jobLabel") || "").trim();
  const jobCode = String(formData.get("jobCode") || "").trim() || null;
  const headcount = Number(formData.get("headcount") || 1);
  const habilitations = JSON.parse(String(formData.get("habilitations") || "[]"));
  const customHabilitations = JSON.parse(String(formData.get("customHabilitations") || "[]"));
  const description = String(formData.get("description") || "").trim() || null;

  const startDate = String(formData.get("startDate") || "");
  const durationValue = Number(formData.get("durationValue") || 0);
  const durationUnit = String(formData.get("durationUnit") || "mois");
  const location = String(formData.get("location") || "").trim();

  const hourlyRate = Number(formData.get("hourlyRate") || 0);
  const meals = formData.get("meals") ? Number(formData.get("meals")) : null;
  const travelBonus = formData.get("travelBonus") ? Number(formData.get("travelBonus")) : null;
  const transportAllowance = formData.get("transportAllowance") ? Number(formData.get("transportAllowance")) : null;
  const otherPremium = String(formData.get("otherPremium") || "").trim() || null;

  const contactName = String(formData.get("contactName") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();

  const jobSpec = formData.get("jobSpec") as File | null;

  if (!jobLabel || !startDate || !durationValue || !location || !hourlyRate || !contactName || !contactEmail || !contactPhone) {
    return { ok: false, error: "Tous les champs obligatoires doivent être remplis." };
  }

  const admin = createServiceClient();

  // Upload éventuel de la fiche de poste.
  let jobSpecPath: string | null = null;
  if (jobSpec && jobSpec.size > 0) {
    const timestamp = Date.now();
    const safeName = jobSpec.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${clientRow.id}/${timestamp}-${safeName}`;
    const buffer = await jobSpec.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("job-specs")
      .upload(path, buffer, {
        contentType: jobSpec.type || "application/octet-stream",
      });
    if (uploadError) {
      return { ok: false, error: `Upload fiche de poste : ${uploadError.message}` };
    }
    jobSpecPath = path;
  }

  // Insert de la demande. La reference est générée automatiquement par trigger.
  const { error: insertError } = await admin
    .from("requests")
    .insert({
      client_id: clientRow.id,
      created_by: user.id,
      job_label: jobLabel,
      rome_code: jobCode,
      headcount,
      habilitations,
      custom_habilitations: customHabilitations,
      description,
      start_date: startDate,
      duration_value: durationValue,
      duration_unit: durationUnit,
      location,
      hourly_rate_eur: hourlyRate,
      meal_bonus_eur: meals,
      travel_bonus_eur: travelBonus,
      transport_allowance_eur: transportAllowance,
      other_premium: otherPremium,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      job_spec_path: jobSpecPath,
    })
    .select("reference")
    .single();

  if (insertError) {
    if (jobSpecPath) {
      await admin.storage.from("job-specs").remove([jobSpecPath]);
    }
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/client");
  redirect("/client?status=pending");
}

export async function cancelRequestAction(requestId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("requests")
    .update({ status: "cancelled" })
    .eq("id", requestId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/client");
  revalidatePath(`/client/demande/${requestId}`);
  return { ok: true };
}
