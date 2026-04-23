"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";
import { sendNewRequestAdminEmail } from "@/lib/email";
import { generateJobDescription } from "@/lib/job-description-generator";

export async function generateJobDescriptionAction(input: {
  jobLabel: string;
  jobCode?: string | null;
  contractType?: string | null;
  experienceLevel?: string | null;
}) {
  if (!input.jobLabel?.trim()) {
    return { ok: false as const, error: "Sélectionnez d'abord un intitulé de poste." };
  }
  // On vérifie qu'on est bien authentifié (pas besoin de role admin).
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };

  try {
    const text = await generateJobDescription(input);
    return { ok: true as const, text };
  } catch (e) {
    console.error("[generateJobDescription] failed:", e);
    return { ok: false as const, error: (e as Error).message };
  }
}

export async function submitRecruitmentRequestAction(formData: FormData) {
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

  if (!clientRow) return { ok: false, error: "Aucun compte client lié à cet utilisateur." };
  if (!clientRow.active) return { ok: false, error: "Votre compte est désactivé. Contactez ASCV CONSEILS." };

  // ---- Champs ----
  const jobLabel = String(formData.get("jobLabel") || "").trim();
  const jobCode = String(formData.get("jobCode") || "").trim() || null;
  const headcount = Number(formData.get("headcount") || 1);
  const contractType = String(formData.get("contractType") || "cdi");
  const cddDurationMonths = formData.get("cddDurationMonths")
    ? Number(formData.get("cddDurationMonths"))
    : null;
  const experienceLevel = String(formData.get("experienceLevel") || "confirme");
  const educationLevel = String(formData.get("educationLevel") || "").trim() || null;
  const habilitations = JSON.parse(String(formData.get("habilitations") || "[]"));
  const customHabilitations = JSON.parse(String(formData.get("customHabilitations") || "[]"));
  const description = String(formData.get("description") || "").trim() || null;

  const startDate = String(formData.get("startDate") || "");
  const trialPeriodMonths = formData.get("trialPeriodMonths")
    ? Number(formData.get("trialPeriodMonths"))
    : null;
  const location = String(formData.get("location") || "").trim();
  const remoteWork = String(formData.get("remoteWork") || "none");

  const salaryMin = formData.get("salaryMin") ? Number(formData.get("salaryMin")) : null;
  const salaryMax = formData.get("salaryMax") ? Number(formData.get("salaryMax")) : null;
  const variablePay = String(formData.get("variablePay") || "").trim() || null;
  const benefits = String(formData.get("benefits") || "").trim() || null;

  const contactName = String(formData.get("contactName") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();

  const jobSpec = formData.get("jobSpec") as File | null;

  // ---- Validations ----
  if (!jobLabel || !startDate || !location || salaryMin === null || !contactName || !contactEmail || !contactPhone) {
    return { ok: false, error: "Tous les champs obligatoires doivent être remplis." };
  }
  if (contractType === "cdd" && !cddDurationMonths) {
    return { ok: false, error: "La durée du CDD est obligatoire." };
  }

  const admin = createServiceClient();

  // Upload fiche de poste
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

  // Récupère le nom client pour l'email
  const { data: fullClient } = await admin
    .from("clients")
    .select("company_name")
    .eq("id", clientRow.id)
    .single();

  // Insert
  const { error: insertError, data: insertedRow } = await admin
    .from("requests")
    .insert({
      client_id: clientRow.id,
      created_by: user.id,
      request_type: "recrutement",
      job_label: jobLabel,
      rome_code: jobCode,
      headcount,
      contract_type: contractType,
      cdd_duration_months: cddDurationMonths,
      experience_level: experienceLevel,
      education_level: educationLevel,
      habilitations,
      custom_habilitations: customHabilitations,
      description,
      start_date: startDate,
      trial_period_months: trialPeriodMonths,
      location,
      remote_work: remoteWork,
      salary_min_eur: salaryMin,
      salary_max_eur: salaryMax,
      salary_period: "annual",
      variable_pay: variablePay,
      benefits,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      job_spec_path: jobSpecPath,
    })
    .select("id, reference")
    .single();

  if (insertError) {
    if (jobSpecPath) {
      await admin.storage.from("job-specs").remove([jobSpecPath]);
    }
    return { ok: false, error: insertError.message };
  }

  // Email admin (best-effort)
  try {
    await sendNewRequestAdminEmail({
      requestId: insertedRow.id,
      reference: insertedRow.reference,
      clientCompanyName: fullClient?.company_name ?? "Client",
      jobLabel,
      headcount,
      startDate,
      location,
    });
  } catch (e) {
    console.error("[submitRecruitment] admin notification failed:", e);
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
