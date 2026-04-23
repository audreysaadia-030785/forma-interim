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

export async function toggleChecklistItemAction(
  requestId: string,
  key: string,
  done: boolean,
) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false as const, error: (e as Error).message };
  }

  const admin = createServiceClient();

  // Récupérer l'état actuel
  const { data: row, error: fetchError } = await admin
    .from("requests")
    .select("admin_checklist")
    .eq("id", requestId)
    .single();

  if (fetchError || !row) {
    return { ok: false as const, error: fetchError?.message ?? "Introuvable" };
  }

  const next = {
    ...(row.admin_checklist ?? {}),
    [key]: {
      done,
      done_at: done ? new Date().toISOString() : null,
    },
  };

  const { error: updateError } = await admin
    .from("requests")
    .update({ admin_checklist: next })
    .eq("id", requestId);

  if (updateError) {
    return { ok: false as const, error: updateError.message };
  }

  revalidatePath(`/admin/demande/${requestId}`);
  revalidatePath("/admin");

  return { ok: true as const, state: next };
}
