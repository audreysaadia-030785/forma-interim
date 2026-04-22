"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CandidateRecord } from "@/lib/demo-data";
import {
  createCandidateAction,
  deleteCandidateAction,
  getCandidateCvUrlAction,
} from "./actions";

type Props = { initial: CandidateRecord[] };

export function CandidatesManager({ initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<CandidateRecord[]>(initial);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [pending, startTransition] = useTransition();

  // Synchronise avec les donnees serveur quand la page revalide (apres insert/delete).
  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.headline}`.toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createCandidateAction(formData);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setShowAdd(false);
      router.refresh();
    });
  }

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
      <section className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between animate-fade-up">
        <div className="relative flex-1 max-w-md">
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
            placeholder="Rechercher un candidat…"
            className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 4v12m-6-6h12"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          {showAdd ? "Annuler" : "Ajouter un candidat"}
        </button>
      </section>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 animate-fade-up"
        >
          <h3 className="text-lg font-bold text-primary-900 mb-4">
            Nouveau candidat
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Prénom" required>
              <input name="firstName" required className={inputClass} />
            </Field>
            <Field label="Nom" required>
              <input name="lastName" required className={inputClass} />
            </Field>
            <Field label="Descriptif court">
              <input
                name="headline"
                placeholder="Ex. Plombier — 8 ans"
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-3">
              <Field label="CV (PDF)" required>
                <label className="flex items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-dashed border-primary-300 bg-primary-50/40 px-4 py-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 0v5h5"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    id="cv-filename"
                    className="text-sm font-semibold text-primary-700"
                  >
                    Cliquez pour choisir un fichier PDF
                  </span>
                  <input
                    name="cv"
                    type="file"
                    accept=".pdf"
                    required
                    className="sr-only"
                    onChange={(e) => {
                      const span = document.getElementById("cv-filename");
                      if (span && e.target.files?.[0]) {
                        span.textContent = e.target.files[0].name;
                      }
                    }}
                  />
                </label>
              </Field>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-[var(--radius-button)] bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      )}

      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm overflow-hidden animate-fade-up">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            {query
              ? "Aucun candidat ne correspond à votre recherche."
              : "Votre base est vide — cliquez sur « Ajouter un candidat »."}
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filtered.map((c, i) => (
              <li
                key={c.id}
                className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold">
                  {c.firstName[0]}
                  {c.lastName[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary-900">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">
                    {c.headline} · {c.cvFileName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleViewCv(c.id)}
                  className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50 hover:ring-primary-300 transition"
                >
                  Voir CV
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    handleDelete(c.id, `${c.firstName} ${c.lastName}`)
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 7h16M10 11v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-neutral-500 italic">
        ⚖️ Conformité RGPD : la suppression supprime définitivement le CV et
        les données personnelles du candidat. Aucune trace conservée.
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-primary-900 flex items-center gap-1">
        {label}
        {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
    </div>
  );
}
