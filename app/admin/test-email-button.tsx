"use client";

import { useState, useTransition } from "react";
import { sendTestEmailAction } from "./test-email-action";

export function TestEmailButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { ok: true; id: string }
    | { ok: false; error: string }
    | null
  >(null);

  function test() {
    setResult(null);
    startTransition(async () => {
      const res = await sendTestEmailAction();
      if (res.ok) setResult({ ok: true, id: res.id ?? "" });
      else setResult({ ok: false, error: res.error });
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={test}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 hover:text-primary-700 disabled:opacity-50 transition"
      >
        {pending ? "🕐 Envoi…" : "🧪 Tester l'envoi d'email"}
      </button>
      {result && (
        <span
          className={`text-[11px] font-bold ${
            result.ok ? "text-emerald-700" : "text-rose-600"
          }`}
        >
          {result.ok
            ? `✅ Email envoyé (id ${result.id.slice(0, 8)}) — regarde ta boîte`
            : `❌ ${result.error}`}
        </span>
      )}
    </div>
  );
}
