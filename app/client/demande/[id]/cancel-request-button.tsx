"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMyRequestAction } from "./actions";

export function CancelRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleCancel() {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.",
      )
    )
      return;
    startTransition(async () => {
      const res = await cancelMyRequestAction(requestId);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleCancel}
      className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 transition disabled:opacity-50"
    >
      {pending ? "Annulation…" : "Annuler la demande"}
    </button>
  );
}
