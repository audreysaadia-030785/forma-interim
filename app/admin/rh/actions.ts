"use server";

import { revalidatePath } from "next/cache";
import {
  createClient as createServerClient,
  createServiceClient,
} from "@/lib/supabase/server";

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
  return user;
}

/* =========================================================================
 * EMPLOYÉS
 * ========================================================================= */

export async function createEmployeeAction(formData: FormData) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const payload = pickEmployeePayload(formData);
  if (!payload.client_id || !payload.first_name || !payload.last_name) {
    return { ok: false as const, error: "Champs obligatoires manquants." };
  }
  const { error } = await admin.from("hr_employees").insert(payload);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/rh/clients/${payload.client_id}`);
  return { ok: true as const };
}

export async function updateEmployeeAction(id: string, formData: FormData) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const payload = pickEmployeePayload(formData);
  const { error } = await admin.from("hr_employees").update(payload).eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/rh/clients/${payload.client_id}`);
  return { ok: true as const };
}

export async function deleteEmployeeAction(id: string, clientId: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const { error } = await admin.from("hr_employees").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/rh/clients/${clientId}`);
  return { ok: true as const };
}

function pickEmployeePayload(formData: FormData) {
  const getOrNull = (k: string) => {
    const v = formData.get(k);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  return {
    client_id: getOrNull("client_id")!,
    first_name: getOrNull("first_name")!,
    last_name: getOrNull("last_name")!,
    email: getOrNull("email"),
    phone: getOrNull("phone"),
    job_title: getOrNull("job_title"),
    contract_type: getOrNull("contract_type"),
    contract_start_date: getOrNull("contract_start_date"),
    contract_end_date: getOrNull("contract_end_date"),
    trial_end_date: getOrNull("trial_end_date"),
    last_medical_visit_date: getOrNull("last_medical_visit_date"),
    next_medical_visit_date: getOrNull("next_medical_visit_date"),
    last_entretien_pro_date: getOrNull("last_entretien_pro_date"),
    next_entretien_pro_date: getOrNull("next_entretien_pro_date"),
    notes: getOrNull("notes"),
  };
}

/* =========================================================================
 * RAPPELS
 * ========================================================================= */

export async function createReminderAction(formData: FormData) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const client_id = String(formData.get("client_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "") || null;
  const due_date = String(formData.get("due_date") ?? "");
  const related_employee_id =
    String(formData.get("related_employee_id") ?? "") || null;

  if (!client_id || !title || !due_date) {
    return { ok: false as const, error: "Client, titre et date obligatoires." };
  }

  const { error } = await admin.from("hr_reminders").insert({
    client_id,
    title,
    description,
    category,
    due_date,
    related_employee_id,
  });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/rh/clients/${client_id}`);
  revalidatePath("/client/rh");
  revalidatePath("/client/rh/rappels");
  return { ok: true as const };
}

export async function deleteReminderAction(id: string, clientId: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const { error } = await admin.from("hr_reminders").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/admin/rh/clients/${clientId}`);
  revalidatePath("/client/rh/rappels");
  return { ok: true as const };
}

/* =========================================================================
 * DOCUMENTS BIBLIOTHÈQUE
 * ========================================================================= */

export async function uploadDocumentAction(formData: FormData) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "") || null;
  const clientIdRaw = String(formData.get("client_id") ?? "");
  const client_id = clientIdRaw === "all" || !clientIdRaw ? null : clientIdRaw;
  const file = formData.get("file") as File | null;

  if (!title || !file || file.size === 0) {
    return { ok: false as const, error: "Titre et fichier obligatoires." };
  }

  const admin = createServiceClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${client_id ?? "shared"}/${timestamp}-${safeName}`;
  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from("hr-documents")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
    });
  if (uploadError)
    return { ok: false as const, error: `Upload : ${uploadError.message}` };

  const { error } = await admin.from("hr_documents").insert({
    client_id,
    title,
    description,
    category,
    file_path: path,
    file_name: file.name,
  });
  if (error) {
    await admin.storage.from("hr-documents").remove([path]);
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin/rh/documents");
  revalidatePath("/client/rh/bibliotheque");
  return { ok: true as const };
}

export async function deleteDocumentAction(id: string) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }
  const admin = createServiceClient();
  const { data: doc } = await admin
    .from("hr_documents")
    .select("file_path")
    .eq("id", id)
    .single();
  if (doc?.file_path) {
    await admin.storage.from("hr-documents").remove([doc.file_path]);
  }
  const { error } = await admin.from("hr_documents").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/rh/documents");
  revalidatePath("/client/rh/bibliotheque");
  return { ok: true as const };
}

export async function getDocumentUrlAction(id: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };

  const admin = createServiceClient();
  const { data: doc } = await admin
    .from("hr_documents")
    .select("file_path")
    .eq("id", id)
    .single();
  if (!doc?.file_path)
    return { ok: false as const, error: "Fichier introuvable" };

  const { data: signed, error } = await admin.storage
    .from("hr-documents")
    .createSignedUrl(doc.file_path, 120);
  if (error || !signed)
    return { ok: false as const, error: error?.message ?? "Erreur" };
  return { ok: true as const, url: signed.signedUrl };
}

/* =========================================================================
 * RAPPEL — CLIENT (toggle done)
 * ========================================================================= */

export async function toggleReminderDoneAction(
  id: string,
  done: boolean,
) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Non authentifié" };

  // L'update respecte la RLS (client ou admin peuvent updater leurs rappels).
  const { error } = await supabase
    .from("hr_reminders")
    .update({
      done,
      done_at: done ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/client/rh");
  revalidatePath("/client/rh/rappels");
  return { ok: true as const };
}
