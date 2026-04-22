"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCandidateAction,
  getCandidateCvUrlAction,
} from "./actions";
import { ParseCvPanel } from "./parse-cv-panel";

export type CandidateDisplay = {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  primaryRomeCode: string | null;
  primaryRomeLabel: string | null;
  experienceYears: number | null;
  habilitations: string[];
  permis: string[];
  skills: string[];
  tags: string[];
  rating: number | null;
  availableFrom: string | null;
  cvFileName: string;
  addedAt: string;
};

export function CandidatesHub({ initial }: { initial: CandidateDisplay[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<CandidateDisplay[]>(initial);
  const [query, setQuery] = useState("");
  const [filterHabilitation, setFilterHabilitation] = useState<string | null>(null);
  const [filterRome, setFilterRome] = useState<string | null>(null);
  const [showParser, setShowParser] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setRows(initial), [initial]);

  // Liste unique des habilitations présentes en base (pour le filtre).
  const availableHabilitations = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((c) => c.habilitations.forEach((h) => s.add(h)));
    return [...s].sort();
  }, [rows]);

  const availableRomes = useMemo(() => {
    const m = new Map<string, string>();
    rows.forEach((c) => {
      if (c.primaryRomeCode && c.primaryRomeLabel) {
        m.set(c.primaryRomeCode, c.primaryRomeLabel);
      }
    });
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const hay = [
          c.firstName,
          c.lastName,
          c.headline,
          c.primaryRomeLabel,
          ...c.habilitations,
          ...c.skills,
          ...c.tags,
          c.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    if (filterHabilitation) {
      list = list.filter((c) => c.habilitations.includes(filterHabilitation));
    }
    if (filterRome) {
      list = list.filter((c) => c.primaryRomeCode === filterRome);
    }
    return list;
  }, [rows, query, filterHabilitation, filterRome]);

  function handleDelete(id: string, name: string) {
    if (
      !confirm(
        `Supprimer définitivement le CV de ${name} ?\n\nCette action est irréversible et conforme RGPD.`,
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCandidateAction(id);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      setRows((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    });
  }

  async function handleViewCv(id: string) {
    const res = await getCandidateCvUrlAction(id);
    if (!res.ok || !res.url) {
      alert(`Erreur : ${res.error ?? "CV introuvable"}`);
      return;
    }
    window.open(res.url, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between animate-fade-up">
        <div className="flex flex-1 gap-2 max-w-3xl">
          <div className="relative flex-1">
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
              placeholder="Rechercher par nom, métier, habilitation, compétence…"
              className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowParser((v) => !v)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-all whitespace-nowrap"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12m-6-6h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          {showParser ? "Fermer" : "Ajouter des candidats (IA)"}
        </button>
      </section>

      {/* Panneau de parsing */}
      {showParser && (
        <ParseCvPanel
          onSaved={() => {
            router.refresh();
          }}
          onClose={() => setShowParser(false)}
        />
      )}

      {/* Filtres secondaires */}
      {(availableHabilitations.length > 0 || availableRomes.length > 0) && (
        <section className="flex flex-col sm:flex-row gap-3 sm:items-center animate-fade-up">
          {availableRomes.length > 0 && (
            <select
              value={filterRome ?? ""}
              onChange={(e) => setFilterRome(e.target.value || null)}
              className="rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 cursor-pointer focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Tous les métiers</option>
              {availableRomes.map(([code, label]) => (
                <option key={code} value={code}>
                  {code} — {label}
                </option>
              ))}
            </select>
          )}
          {availableHabilitations.length > 0 && (
            <select
              value={filterHabilitation ?? ""}
              onChange={(e) => setFilterHabilitation(e.target.value || null)}
              className="rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 cursor-pointer focus:ring-primary-500 focus:outline-none"
            >
              <option value="">Toute habilitation</option>
              {availableHabilitations.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          )}
          <span className="text-xs text-neutral-500 sm:ml-auto">
            {filtered.length} candidat{filtered.length > 1 ? "s" : ""} affiché
            {filtered.length > 1 ? "s" : ""}
          </span>
        </section>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center animate-fade-up">
          <p className="text-neutral-500">
            {rows.length === 0
              ? "Votre CVthèque est vide. Cliquez sur « Ajouter des candidats » pour commencer."
              : "Aucun candidat ne correspond à vos filtres."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 animate-fade-up">
          {filtered.map((c, i) => (
            <li
              key={c.id}
              className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm hover:shadow-md hover:ring-primary-200 transition-all p-4 sm:p-5 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold">
                  {(c.firstName[0] ?? "") + (c.lastName[0] ?? "")}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-primary-900">
                      {c.firstName} {c.lastName}
                    </h3>
                    {c.primaryRomeCode && (
                      <span className="inline-flex items-center rounded-md bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white font-mono">
                        {c.primaryRomeCode}
                      </span>
                    )}
                    {c.experienceYears !== null && (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                        {c.experienceYears} an{c.experienceYears > 1 ? "s" : ""} XP
                      </span>
                    )}
                    {c.rating && (
                      <span className="text-accent-500 text-sm font-bold">
                        {"★".repeat(c.rating)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 mt-0.5">
                    {c.headline ||
                      c.primaryRomeLabel ||
                      "Profil à compléter"}
                  </p>
                  {c.location && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      📍 {c.location}
                    </p>
                  )}

                  {(c.habilitations.length > 0 || c.permis.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.habilitations.slice(0, 5).map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center rounded-full bg-primary-50 ring-1 ring-primary-200 px-2 py-0.5 text-[10px] font-semibold text-primary-800"
                        >
                          {h}
                        </span>
                      ))}
                      {c.habilitations.length > 5 && (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                          +{c.habilitations.length - 5}
                        </span>
                      )}
                      {c.permis.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center rounded-full bg-accent-50 ring-1 ring-accent-200 px-2 py-0.5 text-[10px] font-semibold text-accent-800"
                        >
                          🚗 {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 justify-end border-t border-neutral-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleViewCv(c.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 hover:ring-primary-300 transition"
                >
                  Voir le CV
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    handleDelete(c.id, `${c.firstName} ${c.lastName}`)
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  Supprimer (RGPD)
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-neutral-500 italic">
        ⚖️ Conformité RGPD : la suppression supprime définitivement le CV et
        les données personnelles du candidat.
      </p>
    </div>
  );
}
