"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ROME_FAMILIES,
  ROME_JOBS,
  type RomeJob,
} from "@/lib/rome-catalog";
import { findRomeSynonyms } from "@/lib/rome-synonyms";

type Props = {
  /** Libellé sélectionné. */
  value: string;
  onChange: (value: { label: string; code: string | null }) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
};

// Normalise une chaîne (minuscule, sans accents) pour la recherche.
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MAX_RESULTS = 80;

export function RomeCombobox({
  value,
  onChange,
  placeholder = "Recherchez un métier (ex : plombier, caissier, infirmier…)",
  required,
  id: idProp,
}: Props) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Synchroniser la saisie quand la prop value change depuis l'extérieur.
  useEffect(() => setQuery(value), [value]);

  // Fermer le dropdown au clic extérieur.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const deferredQuery = useDeferredValue(query);

  const results = useMemo<RomeJob[]>(() => {
    const q = norm(deferredQuery).trim();
    if (!q) return ROME_JOBS.slice(0, MAX_RESULTS);

    // 1) Synonymes : si la saisie matche un terme "de terrain"
    //    (ex. "plombier chauffagiste" qui a été scindé en ROME 4.0),
    //    on renvoie d'abord les codes ROME pertinents.
    const synonymCodes = findRomeSynonyms(deferredQuery);
    const synonymJobs: RomeJob[] = [];
    if (synonymCodes.length) {
      for (const code of synonymCodes) {
        const job = ROME_JOBS.find((j) => j.code === code);
        if (job) synonymJobs.push(job);
      }
    }

    // 2) Recherche tokenisée : tous les tokens doivent apparaître dans le libellé.
    const tokens = q.split(/\s+/);
    const scored: Array<{ job: RomeJob; score: number }> = [];
    for (const job of ROME_JOBS) {
      if (synonymJobs.some((s) => s.code === job.code)) continue;
      const hay = norm(job.label);
      let ok = true;
      let score = 0;
      for (const t of tokens) {
        const idx = hay.indexOf(t);
        if (idx < 0) {
          ok = false;
          break;
        }
        score += idx === 0 ? 0 : idx < 3 ? 1 : 2;
      }
      if (ok) scored.push({ job, score });
      if (scored.length > MAX_RESULTS * 4) break;
    }
    scored.sort((a, b) => a.score - b.score);
    const strict = scored.slice(0, MAX_RESULTS).map((s) => s.job);

    // 3) Fallback "OR" si aucun résultat strict et pas de synonyme :
    //    on montre les libellés contenant au moins un des tokens.
    if (strict.length === 0 && synonymJobs.length === 0 && tokens.length > 1) {
      const looseScored: Array<{ job: RomeJob; score: number }> = [];
      for (const job of ROME_JOBS) {
        const hay = norm(job.label);
        let hits = 0;
        for (const t of tokens) if (hay.includes(t)) hits++;
        if (hits > 0)
          looseScored.push({ job, score: tokens.length - hits });
      }
      looseScored.sort((a, b) => a.score - b.score);
      return looseScored.slice(0, MAX_RESULTS).map((s) => s.job);
    }

    // Résultat final : synonymes en tête, puis matches stricts.
    return [...synonymJobs, ...strict].slice(0, MAX_RESULTS);
  }, [deferredQuery]);

  useEffect(() => {
    // Réinitialiser l'item surligné quand la recherche change.
    setHighlight(0);
  }, [deferredQuery]);

  function select(job: RomeJob) {
    onChange({ label: job.label, code: job.code });
    setQuery(job.label);
    setOpen(false);
  }

  function clearAndCustom() {
    onChange({ label: query, code: null });
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const job = results[highlight];
      if (job) select(job);
      else clearAndCustom();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
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
          id={id}
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            // Tant que l'utilisateur tape, on stocke la valeur libre.
            onChange({ label: e.target.value, code: null });
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-9 pr-10 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange({ label: "", code: null });
              inputRef.current?.focus();
              setOpen(true);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 transition"
            aria-label="Effacer"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-xl bg-white ring-1 ring-neutral-200 shadow-xl overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 bg-neutral-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              {results.length === MAX_RESULTS
                ? `${MAX_RESULTS}+ résultats`
                : `${results.length} résultat${results.length > 1 ? "s" : ""}`}{" "}
              · Base ROME 4.0 France&nbsp;Travail
            </span>
            <span className="text-[11px] text-neutral-400">
              ↑↓ naviguer · Entrée valider · Échap fermer
            </span>
          </div>
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-neutral-600">
              <p className="mb-2">Aucun métier trouvé pour « {query} »</p>
              <button
                type="button"
                onClick={clearAndCustom}
                className="rounded-full bg-primary-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition"
              >
                Utiliser « {query} » tel quel
              </button>
            </div>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-80 overflow-y-auto py-1"
            >
              {results.map((job, i) => {
                const active = i === highlight;
                return (
                  <li
                    key={job.code}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => {
                      // éviter que l'input perde le focus avant onClick
                      e.preventDefault();
                      select(job);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer border-l-4 transition-all ${
                      active
                        ? "bg-primary-600 border-accent-500 shadow-inner"
                        : "border-transparent hover:bg-primary-50 hover:border-primary-200"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 shrink-0 items-center justify-center rounded-md px-1.5 text-[10px] font-bold font-mono transition-colors ${
                        active
                          ? "bg-accent-500 text-white shadow-sm"
                          : "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {job.code}
                    </span>
                    <span className="flex flex-col min-w-0 flex-1">
                      <span
                        className={`text-sm font-semibold truncate transition-colors ${
                          active ? "text-white" : "text-primary-900"
                        }`}
                      >
                        {job.label}
                      </span>
                      <span
                        className={`text-[11px] truncate transition-colors ${
                          active ? "text-primary-100" : "text-neutral-500"
                        }`}
                      >
                        {ROME_FAMILIES[job.family]}
                      </span>
                    </span>
                    {active && (
                      <svg
                        className="h-4 w-4 text-accent-300 shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
