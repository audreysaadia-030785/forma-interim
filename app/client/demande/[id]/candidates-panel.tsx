"use client";

import { useState } from "react";
import type {
  Candidate,
  CandidateStatus,
  RequestStatus,
} from "@/lib/demo-data";

type Props = {
  status: RequestStatus;
  candidates: Candidate[];
};

export function CandidatesPanel({ status, candidates }: Props) {
  // État local : on simule validation/refus en mémoire pour l'UX.
  const [rows, setRows] = useState<Candidate[]>(candidates);

  function setStatus(id: string, newStatus: CandidateStatus) {
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
      <header className="mb-6">
        <h2 className="text-xl font-extrabold text-primary-900">
          Candidats proposés
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          {status === "pending"
            ? "Nous recherchons les meilleurs profils pour votre mission."
            : status === "proposed"
              ? "Validez ou refusez chaque profil — vous pouvez télécharger leur CV."
              : status === "validated"
                ? "Profil(s) validé(s) pour cette mission."
                : status === "refused"
                  ? "Aucun profil n'a été retenu."
                  : "Demande annulée."}
        </p>
      </header>

      {rows.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <ul className="space-y-3">
          {rows.map((candidate, i) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              index={i}
              onValidate={() => setStatus(candidate.id, "validated")}
              onRefuse={() => setStatus(candidate.id, "refused")}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CandidateRow({
  candidate,
  index,
  onValidate,
  onRefuse,
}: {
  candidate: Candidate;
  index: number;
  onValidate: () => void;
  onRefuse: () => void;
}) {
  const initials = candidate.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusMeta = {
    pending: {
      bg: "bg-white ring-neutral-200",
      label: "À valider",
      badge: "bg-accent-50 text-accent-700 ring-accent-200",
    },
    validated: {
      bg: "bg-emerald-50/60 ring-emerald-200",
      label: "Validé",
      badge: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    },
    refused: {
      bg: "bg-rose-50/60 ring-rose-200",
      label: "Refusé",
      badge: "bg-rose-100 text-rose-700 ring-rose-200",
    },
  }[candidate.status];

  return (
    <li
      className={`rounded-2xl p-4 sm:p-5 ring-1 transition animate-fade-up ${statusMeta.bg}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold shadow-sm">
          {initials}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-primary-900">
              {candidate.fullName}
            </h3>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${statusMeta.badge}`}
            >
              {statusMeta.label}
            </span>
          </div>
          <p className="text-sm text-neutral-600">{candidate.headline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between border-t border-neutral-200/70 pt-3">
        <a
          href={candidate.cvUrl}
          onClick={(e) => {
            e.preventDefault();
            alert(
              "Téléchargement du CV — sera branché à la base de données à la prochaine étape.",
            );
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent-500 transition"
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
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              strokeLinejoin="round"
            />
            <path d="M14 2v6h6" strokeLinejoin="round" />
          </svg>
          Télécharger le CV
        </a>

        {candidate.status === "pending" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRefuse}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 transition"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={onValidate}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5 8.5 15 16 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Valider
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function EmptyState({ status }: { status: RequestStatus }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
        <svg
          className="h-6 w-6 text-primary-500 animate-pulse"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" strokeLinejoin="round" />
          <path d="m21 21-5-5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-primary-900">
        {status === "cancelled"
          ? "Cette demande a été annulée."
          : "Recherche en cours…"}
      </p>
      {status !== "cancelled" && (
        <p className="mt-1 text-sm text-neutral-600">
          Nous vous enverrons un email dès que des profils seront prêts à être
          validés.
        </p>
      )}
    </div>
  );
}
