"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";

export async function createClientAction(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { ok: false, error: "Accès refusé" };

  const companyName = String(formData.get("companyName") || "").trim();
  const siret = String(formData.get("siret") || "").trim() || null;
  const primaryContactName = String(formData.get("primaryContactName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();

  if (!companyName || !primaryContactName || !email || !phone) {
    return { ok: false, error: "Tous les champs obligatoires sont requis." };
  }

  // 1) Créer le compte auth avec la clé service (bypass RLS).
  const admin = createServiceClient();
  const tempPassword = generatePassword();

  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: primaryContactName,
      phone,
      role: "client",
    },
  });

  if (authError || !created.user) {
    return { ok: false, error: authError?.message ?? "Erreur création compte" };
  }

  // 2) Créer la ligne dans clients.
  const { error: clientError } = await admin.from("clients").insert({
    company_name: companyName,
    siret,
    primary_contact_name: primaryContactName,
    email,
    phone,
    primary_user_id: created.user.id,
  });

  if (clientError) {
    // Rollback du compte auth si la création du client échoue.
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: clientError.message };
  }

  revalidatePath("/admin/clients");

  return {
    ok: true,
    email,
    tempPassword,
    message: `Compte créé. Identifiants à envoyer au contact :\nEmail : ${email}\nMot de passe initial : ${tempPassword}`,
  };
}

export async function toggleClientActiveAction(clientId: string) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { ok: false, error: "Accès refusé" };

  const admin = createServiceClient();
  const { data: current } = await admin
    .from("clients")
    .select("active")
    .eq("id", clientId)
    .single();

  if (!current) return { ok: false, error: "Client introuvable" };

  await admin
    .from("clients")
    .update({ active: !current.active })
    .eq("id", clientId);

  revalidatePath("/admin/clients");
  return { ok: true };
}

function generatePassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let pw = "";
  for (const b of bytes) pw += chars[b % chars.length];
  return pw;
}
