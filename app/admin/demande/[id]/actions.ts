"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient, createServiceClient } from "@/lib/supabase/server";
import { sendCandidatesProposedEmail } from "@/lib/email";

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

export async function proposeCandidatesAction(
  requestId: string,
  candidateIds: string[],
) {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createServiceClient();

  // Récupérer les propositions existantes.
  const { data: existing } = await admin
    .from("proposals")
    .select("id, candidate_id")
    .eq("request_id", requestId);

  const existingIds = new Set((existing ?? []).map((p) => p.candidate_id));

  const toAdd = candidateIds.filter((id) => !existingIds.has(id));
  const toRemove = (existing ?? []).filter(
    (p) => !candidateIds.includes(p.candidate_id),
  );

  if (toAdd.length > 0) {
    const { error } = await admin.from("proposals").insert(
      toAdd.map((candidate_id) => ({ request_id: requestId, candidate_id })),
    );
    if (error) return { ok: false, error: error.message };
  }

  if (toRemove.length > 0) {
    const { error } = await admin
      .from("proposals")
      .delete()
      .in(
        "id",
        toRemove.map((p) => p.id),
      );
    if (error) return { ok: false, error: error.message };
  }

  // Mise à jour du statut de la demande.
  const totalProposals = candidateIds.length;
  await admin
    .from("requests")
    .update({ status: totalProposals > 0 ? "proposed" : "pending" })
    .eq("id", requestId);

  // Email au client — seulement si on ajoute au moins un nouveau profil.
  if (toAdd.length > 0 && totalProposals > 0) {
    const { data: request } = await admin
      .from("requests")
      .select("reference, job_label, contact_email, clients(primary_user_id)")
      .eq("id", requestId)
      .single();

    let clientEmail = request?.contact_email ?? null;
    // @ts-expect-error relation
    const primaryUserId = request?.clients?.primary_user_id;
    if (primaryUserId) {
      const { data: userRow } = await admin.auth.admin.getUserById(primaryUserId);
      if (userRow?.user?.email) clientEmail = userRow.user.email;
    }

    if (clientEmail) {
      try {
        await sendCandidatesProposedEmail({
          to: clientEmail,
          requestId,
          reference: request?.reference ?? "",
          jobLabel: request?.job_label ?? "",
          candidatesCount: totalProposals,
        });
      } catch (e) {
        console.error("[propose] client notification failed:", e);
      }
    }
  }

  revalidatePath(`/admin/demande/${requestId}`);
  revalidatePath("/admin");
  revalidatePath("/client");

  return { ok: true, addedCount: toAdd.length, removedCount: toRemove.length };
}
