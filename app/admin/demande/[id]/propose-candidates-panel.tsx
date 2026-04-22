"use client";

import { useMemo, useState } from "react";
import type { Candidate, CandidateRecord } from "@/lib/demo-data";

type Props = {
  requestId: string;
  alreadyProposed: Candidate[];
  candidateBase: CandidateRecord[];
};

export function ProposeCandidatesPanel({
  requestId,
  alreadyProposed,
  candidateBase,
}: Props) {
  const initiallyProposedIds = new Set(
    alreadyProposed
      .map((c) => {
        const match = candidateBase.find(
          (b) => `${b.firstName} ${b.lastName}` === c.fullName,
        );
        return match?.id;
      })
      .filter(Boolean) as string[],
  );

  const [proposedIds, setProposedIds] = useState<Set<string>>(initiallyProposedIds);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidateBase;
    return candidateBase.filter((c) => {
      const hay = `${c.firstName} ${c.lastName} ${c.headline}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, candidateBase]);

  function toggle(id: string) {
    setSubmitted(false);
    setProposedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    setSubmitted(true);
    alert(
      `${proposedIds.size} candidat(s) proposé(s) au client pour la demande ${requestId}.\n\nLe client sera notifié par email.\nCeci sera branché à la base de données à la prochaine étape.`,
    );
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
      <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-primary-900">
            Proposer des candidats
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Sélectionnez les profils à envoyer au client. Il recevra un email
            avec les CV et pourra valider ou refuser chaque profil.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 ring-1 ring-accent-200 self-start">
          {proposedIds.size} sélectionné{proposedIds.size > 1 ? "s" : ""}
        </span>
      </header>

      <div className="relative mb-4">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-5-5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans la base candidats (nom, compétence…)"
          className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((c, i) => {
          const selected = proposedIds.has(c.id);
          return (
            <li
              key={c.id}
              className={`rounded-xl p-3 sm:p-4 ring-1 transition-all cursor-pointer animate-fade-up ${
                selected
                  ? "bg-primary-50 ring-primary-300 shadow-sm"
                  : "bg-white ring-neutral-200 hover:bg-neutral-50 hover:ring-primary-200"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => toggle(c.id)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggle(c.id)}
                  className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-extrabold">
                  {c.firstName[0]}
                  {c.lastName[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary-900 text-sm">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">
                    {c.headline}
                  </p>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    alert(
                      `Ouverture du CV : ${c.cvFileName}\n(sera branché à la base de données)`,
                    );
                  }}
                  className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-50 hover:ring-primary-300 transition"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeLinejoin="round"
                    />
                    <path d="M14 2v6h6" strokeLinejoin="round" />
                  </svg>
                  CV
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          Aucun candidat ne correspond à votre recherche.
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-4 bg-white/95 backdrop-blur p-3 rounded-xl ring-1 ring-neutral-200 shadow-md">
        <span className="self-center text-xs text-neutral-500 sm:mr-auto">
          {submitted && proposedIds.size > 0 && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5 8.5 15 16 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Candidats envoyés au client
            </span>
          )}
        </span>
        <button
          type="button"
          disabled={proposedIds.size === 0}
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Envoyer au client
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 10h13m0 0L10 4.5M16 10l-6 5.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
