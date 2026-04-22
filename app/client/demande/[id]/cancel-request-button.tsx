"use client";

export function CancelRequestButton() {
  return (
    <button
      type="button"
      className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 transition"
      onClick={() => {
        if (
          confirm(
            "Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.",
          )
        ) {
          alert(
            "Annulation — sera branchée à la base de données à la prochaine étape.",
          );
        }
      }}
    >
      Annuler la demande
    </button>
  );
}
