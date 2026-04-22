"use client";

import { useState } from "react";
import type { Client } from "@/lib/demo-data";

type Props = { initial: Client[] };

export function ClientsManager({ initial }: Props) {
  const [rows, setRows] = useState<Client[]>(initial);
  const [showAdd, setShowAdd] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const newClient: Client = {
      id: `CLI-${Date.now().toString().slice(-4)}`,
      companyName,
      siret: siret || undefined,
      primaryContact,
      email,
      phone,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setRows((prev) => [newClient, ...prev]);
    setCompanyName("");
    setSiret("");
    setPrimaryContact("");
    setEmail("");
    setPhone("");
    setSaving(false);
    setShowAdd(false);
    alert(
      `Compte créé pour ${newClient.companyName}.\n\nUn email d'invitation avec les identifiants sera envoyé à ${newClient.email} (à brancher à la prochaine étape).`,
    );
  }

  function toggleActive(id: string) {
    setRows((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end animate-fade-up">
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
          {showAdd ? "Annuler" : "Créer un compte client"}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 animate-fade-up"
        >
          <h3 className="text-lg font-bold text-primary-900 mb-4">
            Nouveau compte client
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nom de l'entreprise" required>
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme BTP"
                className={inputClass}
              />
            </Field>
            <Field label="SIRET">
              <input
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="123 456 789 00012"
                className={inputClass}
              />
            </Field>
            <Field label="Contact principal" required>
              <input
                required
                value={primaryContact}
                onChange={(e) => setPrimaryContact(e.target.value)}
                placeholder="Jean Martin"
                className={inputClass}
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="j.martin@acme-btp.fr"
                className={inputClass}
              />
            </Field>
            <Field label="Téléphone" required>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className={inputClass}
              />
            </Field>
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
              disabled={saving}
              className="rounded-[var(--radius-button)] bg-primary-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {saving ? "Création…" : "Créer et envoyer les identifiants"}
            </button>
          </div>
        </form>
      )}

      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm overflow-hidden animate-fade-up">
        {rows.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            Aucun client pour l&apos;instant.
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {rows.map((c, i) => (
              <li
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-neutral-50 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                      c.active
                        ? "bg-primary-100 text-primary-700"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {c.companyName
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary-900 truncate">
                      {c.companyName}
                    </p>
                    <p className="text-xs text-neutral-600 truncate">
                      {c.primaryContact} · {c.email} · {c.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.active
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        c.active ? "bg-emerald-500" : "bg-neutral-400"
                      }`}
                    />
                    {c.active ? "Actif" : "Désactivé"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleActive(c.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      c.active
                        ? "bg-white ring-1 ring-rose-200 text-rose-600 hover:bg-rose-50"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {c.active ? "Désactiver" : "Réactiver"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
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
