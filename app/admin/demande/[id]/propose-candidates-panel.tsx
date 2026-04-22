"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { proposeCandidatesAction } from "./actions";
import type { MatchResult } from "@/lib/matching";

type CandidateWithScore = {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  cvFileName: string;
  primaryRomeCode: string | null;
  primaryRomeLabel: string | null;
  experienceYears: number | null;
  habilitations: string[];
  location: string | null;
  availableFrom: string | null;
  rating: number | null;
  tags: string[];
  score: number;
  breakdown: MatchResult["breakdown"];
  reasons: string[];
};

type Props = {
  requestId: string;
  alreadyProposedIds: string[];
  candidates: CandidateWithScore[];
};

export function ProposeCandidatesPanel({
  requestId,
  alreadyProposedIds,
  candidates,
}: Props) {
  const router = useRouter();
  const [proposedIds, setProposedIds] = useState<Set<string>>(
    () => new Set(alreadyProposedIds),
  );
  const [query, setQuery] = useState("");
  const [onlyMatch, setOnlyMatch] = useState(true);
  const [pending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const filtered = useMemo(() => {
    let list = candidates;
    if (onlyMatch) list = list.filter((c) => c.score >= 40);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const hay = `${c.firstName} ${c.lastName} ${c.headline} ${(c.habilitations ?? []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }
    return list;
  }, [candidates, query, onlyMatch]);

  function toggle(id: string) {
    setSuccess(false);
    setProposedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit() {
    startTransition(async () => {
      const res = await proposeCandidatesAction(requestId, [...proposedIds]);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  const topScore = candidates[0]?.score ?? 0;

  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
      <header className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-primary-900">
            Proposer des candidats
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Triés automatiquement par score de correspondance.
            {topScore > 0 && (
              <span className="ml-1 font-semibold text-emerald-700">
                Meilleur match : {topScore}%
              </span>
            )}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 ring-1 ring-accent-200 self-start">
          {proposedIds.size} sélectionné{proposedIds.size > 1 ? "s" : ""}
        </span>
      </header>

      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-5-5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 select-none">
          <input
            type="checkbox"
            checked={onlyMatch}
            onChange={(e) => setOnlyMatch(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          Afficher uniquement les matchs (≥ 40%)
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-neutral-50 border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          {candidates.length === 0
            ? "Votre base candidats est vide. Ajoutez-en depuis la CVthèque."
            : onlyMatch
              ? "Aucun candidat avec un score ≥ 40%. Décochez le filtre pour voir tous les profils."
              : "Aucun candidat ne correspond à votre recherche."}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c, i) => {
            const selected = proposedIds.has(c.id);
            return (
              <li
                key={c.id}
                className={`rounded-xl p-4 ring-1 transition-all cursor-pointer animate-fade-up ${
                  selected
                    ? "bg-primary-50 ring-primary-300 shadow-sm"
                    : "bg-white ring-neutral-200 hover:bg-neutral-50 hover:ring-primary-200"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => toggle(c.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle(c.id)}
                    className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ScoreDonut score={c.score} />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-extrabold">
                    {c.firstName[0]}
                    {c.lastName[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-primary-900 text-sm">
                        {c.firstName} {c.lastName}
                      </p>
                      {c.primaryRomeCode && (
                        <span className="inline-flex items-center rounded-md bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white font-mono">
                          {c.primaryRomeCode}
                        </span>
                      )}
                      {c.experienceYears !== null && (
                        <span className="text-[10px] font-bold text-neutral-600">
                          {c.experienceYears} ans
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 truncate">
                      {c.headline || c.primaryRomeLabel}
                    </p>
                    {c.reasons.length > 0 && (
                      <ul className="mt-1.5 flex flex-wrap gap-1">
                        {c.reasons.slice(0, 3).map((r, ix) => (
                          <li
                            key={ix}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${
                              r.includes("Aucun") ||
                              r.includes("après") ||
                              r.includes("inférieur")
                                ? "bg-rose-50 text-rose-700 ring-rose-200"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            }`}
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-4 bg-white/95 backdrop-blur p-3 rounded-xl ring-1 ring-neutral-200 shadow-md">
        <span className="self-center text-xs sm:mr-auto">
          {success && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 10.5 8.5 15 16 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Candidats envoyés au client
            </span>
          )}
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 disabled:opacity-50 transition-all"
        >
          {pending ? "Enregistrement…" : "Envoyer au client"}
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

function ScoreDonut({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 14;
  const dash = (score / 100) * circumference;
  const color =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-primary-500"
        : score >= 40
          ? "stroke-accent-500"
          : "stroke-neutral-400";

  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="none" className="stroke-neutral-200" strokeWidth="3" />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          className={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-extrabold text-primary-900">
        {score}
      </span>
    </div>
  );
}
