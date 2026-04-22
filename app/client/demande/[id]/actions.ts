"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";

export async function decideProposalAction(
  proposalId: string,
  decision: "validated" | "refused",
) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  // Mise à jour du status de la proposition (RLS vérifie que l'user est bien le client de cette demande).
  const { data: updated, error } = await supabase
    .from("proposals")
    .update({ status: decision, decided_at: new Date().toISOString() })
    .eq("id", proposalId)
    .select("request_id")
    .single();

  if (error) return { ok: false, error: error.message };

  // Si le client valide au moins un candidat → la demande passe en "validated".
  // Si tous sont refusés → la demande passe en "refused".
  const admin = createServiceClient();
  const { data: siblings } = await admin
    .from("proposals")
    .select("status")
    .eq("request_id", updated.request_id);

  const hasValidated = (siblings ?? []).some((p) => p.status === "validated");
  const allDecided = (siblings ?? []).every(
    (p) => p.status === "validated" || p.status === "refused",
  );
  let newStatus: string | null = null;
  if (hasValidated) newStatus = "validated";
  else if (allDecided) newStatus = "refused";

  if (newStatus) {
    await admin.from("requests").update({ status: newStatus }).eq("id", updated.request_id);
  }

  revalidatePath(`/client/demande/${updated.request_id}`);
  revalidatePath("/client");
  revalidatePath("/admin");

  return { ok: true };
}

export async function cancelMyRequestAction(requestId: string) {
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
