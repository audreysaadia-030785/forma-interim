"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DOCUMENT_CATEGORY_META, type HrDocument } from "@/lib/hr-types";
import {
  deleteDocumentAction,
  uploadDocumentAction,
} from "@/app/admin/rh/actions";

type Props = {
  documents: HrDocument[];
  clients: Array<{ id: string; name: string }>;
};

export function DocumentsManager({ documents, clients }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await uploadDocumentAction(fd);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer le document « ${title} » ?`)) return;
    startTransition(async () => {
      const res = await deleteDocumentAction(id);
      if (!res.ok) alert(`Erreur : ${res.error}`);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-accent-600 transition"
        >
          {showForm ? "Annuler" : "+ Publier un document"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 animate-fade-up space-y-3"
        >
          <h3 className="text-base font-bold text-primary-900">Nouveau document</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Titre" required>
              <input name="title" required className={inputClass} />
            </Field>
            <Field label="Catégorie" required>
              <select name="category" required className={inputClass}>
                <option value="">Choisir…</option>
                {Object.entries(DOCUMENT_CATEGORY_META).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Destinataire" required className="md:col-span-2">
              <select name="client_id" required className={inputClass} defaultValue="all">
                <option value="all">📢 Partagé — tous les clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    🎯 {c.name} (personnalisé)
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                name="description"
                rows={2}
                placeholder="Brève description (optionnel)"
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Fichier" required className="md:col-span-2">
              <input
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                required
                className="w-full text-sm"
              />
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-[var(--radius-button)] bg-primary-600 px-5 py-2 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {pending ? "Publication…" : "Publier"}
            </button>
          </div>
        </form>
      )}

      {documents.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          Aucun document. Publiez votre premier document !
        </div>
      ) : (
        <ul className="space-y-2">
          {documents.map((d) => {
            const meta =
              DOCUMENT_CATEGORY_META[d.category as keyof typeof DOCUMENT_CATEGORY_META] ??
              DOCUMENT_CATEGORY_META.autre;
            const clientName = d.client_id
              ? clients.find((c) => c.id === d.client_id)?.name ?? "—"
              : null;
            return (
              <li
                key={d.id}
                className="flex items-start gap-3 rounded-xl bg-white ring-1 ring-neutral-200 p-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg">
                  {meta.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-primary-900">{d.title}</p>
                  <p className="text-xs text-neutral-600">
                    {meta.label}
                    {clientName
                      ? ` · Pour ${clientName}`
                      : " · Partagé avec tous"}
                    {" · "}
                    {new Date(d.published_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {d.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{d.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(d.id, d.title)}
                  className="rounded-full ring-1 ring-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  Supprimer
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <label className="text-xs font-semibold text-primary-900 flex items-center gap-1">
        {label}
        {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
    </div>
  );
}
