"use client";

import { useState, useTransition } from "react";
import { getFormationProgramUrlAction } from "../actions";

type Props = {
  programPath: string | null;
};

export function ProgramDownload({ programPath }: Props) {
  const [loading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!programPath) {
    return (
      <span className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-500 ring-1 ring-neutral-200">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
            strokeLinejoin="round"
          />
          <path d="M14 3v5h5" strokeLinejoin="round" />
        </svg>
        Programme détaillé bientôt disponible
      </span>
    );
  }

  function openProgram() {
    setError(null);
    startLoading(async () => {
      const res = await getFormationProgramUrlAction(programPath!);
      if (!res.ok || !res.url) {
        setError(res.error ?? "Lien introuvable");
        return;
      }
      window.open(res.url, "_blank");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openProgram}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-accent-500/25 hover:bg-accent-600 disabled:opacity-70 transition-all"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
            strokeLinejoin="round"
          />
          <path d="M14 3v5h5" strokeLinejoin="round" />
          <path d="M12 12v6m-3-3 3 3 3-3" strokeLinecap="round" />
        </svg>
        {loading ? "Préparation…" : "Télécharger le programme"}
      </button>
      {error && <p className="ml-2 text-xs text-rose-600">{error}</p>}
    </>
  );
}
