"use client";

import { useState, useTransition } from "react";
import { getDocumentUrlAction } from "@/app/admin/rh/actions";

export function DocumentDownload({
  id,
  fileName,
}: {
  id: string;
  fileName: string;
}) {
  const [loading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function open() {
    setError(null);
    startLoading(async () => {
      const res = await getDocumentUrlAction(id);
      if (!res.ok || !res.url) {
        setError(res.error ?? "Erreur");
        return;
      }
      window.open(res.url, "_blank");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-60 transition"
        title={fileName}
      >
        {loading ? "…" : "Télécharger"}
      </button>
      {error && <span className="text-[10px] text-rose-600">{error}</span>}
    </div>
  );
}
