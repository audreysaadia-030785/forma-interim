"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CONTRACT_LABELS,
  REMINDER_CATEGORY_META,
  type ContractType,
  type HrEmployee,
  type HrReminder,
  type ReminderCategory,
} from "@/lib/hr-types";
import {
  createEmployeeAction,
  createReminderAction,
  deleteEmployeeAction,
  deleteReminderAction,
} from "@/app/admin/rh/actions";

type Props = {
  clientId: string;
  employees: HrEmployee[];
  reminders: HrReminder[];
};

export function ClientRhAdminPanels({ clientId, employees, reminders }: Props) {
  const [tab, setTab] = useState<"equipe" | "rappels">("equipe");

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full bg-white ring-1 ring-neutral-200 p-1 shadow-sm">
        {(
          [
            { key: "equipe" as const, label: "👥 Équipe", count: employees.length },
            { key: "rappels" as const, label: "🔔 Rappels", count: reminders.length },
          ]
        ).map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-primary-700 text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary-700"
              }`}
            >
              {t.label}
              <span className="ml-1 opacity-70 text-xs">({t.count})</span>
            </button>
          );
        })}
      </div>

      {tab === "equipe" ? (
        <EmployeesPanel clientId={clientId} employees={employees} />
      ) : (
        <RemindersPanel
          clientId={clientId}
          reminders={reminders}
          employees={employees}
        />
      )}
    </div>
  );
}

/* =========================================================================
 * PANNEAU ÉQUIPE
 * ========================================================================= */

function EmployeesPanel({
  clientId,
  employees,
}: {
  clientId: string;
  employees: HrEmployee[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("client_id", clientId);
    startTransition(async () => {
      const res = await createEmployeeAction(fd);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      router.refresh();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer ${name} ?`)) return;
    startTransition(async () => {
      const res = await deleteEmployeeAction(id, clientId);
      if (!res.ok) alert(`Erreur : ${res.error}`);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-accent-600 transition"
        >
          {showForm ? "Annuler" : "+ Ajouter un salarié"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 animate-fade-up space-y-3"
        >
          <h3 className="text-base font-bold text-primary-900">
            Nouveau salarié
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Prénom" required>
              <input name="first_name" required className={inputClass} />
            </Field>
            <Field label="Nom" required>
              <input name="last_name" required className={inputClass} />
            </Field>
            <Field label="Poste">
              <input name="job_title" className={inputClass} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" className={inputClass} />
            </Field>
            <Field label="Téléphone">
              <input name="phone" className={inputClass} />
            </Field>
            <Field label="Type de contrat">
              <select name="contract_type" className={inputClass}>
                <option value="">—</option>
                {Object.entries(CONTRACT_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date début contrat">
              <input name="contract_start_date" type="date" className={inputClass} />
            </Field>
            <Field label="Fin période d'essai">
              <input name="trial_end_date" type="date" className={inputClass} />
            </Field>
            <Field label="Fin contrat (CDD)">
              <input name="contract_end_date" type="date" className={inputClass} />
            </Field>
            <Field label="Dernière visite médicale">
              <input name="last_medical_visit_date" type="date" className={inputClass} />
            </Field>
            <Field label="Prochaine visite médicale">
              <input name="next_medical_visit_date" type="date" className={inputClass} />
            </Field>
            <Field label="Prochain entretien pro">
              <input name="next_entretien_pro_date" type="date" className={inputClass} />
            </Field>
            <Field label="Notes" className="md:col-span-3">
              <textarea name="notes" rows={2} className={`${inputClass} resize-y`} />
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-[var(--radius-button)] bg-primary-600 px-5 py-2 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      )}

      {employees.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          Aucun salarié. Cliquez sur « Ajouter un salarié ».
        </div>
      ) : (
        <ul className="space-y-2">
          {employees.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl bg-white ring-1 ring-neutral-200 p-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold">
                {((e.first_name[0] ?? "") + (e.last_name[0] ?? "")).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary-900">
                  {e.first_name} {e.last_name}
                </p>
                <p className="text-xs text-neutral-600">
                  {e.job_title ?? "—"}
                  {e.contract_type && (
                    <>
                      {" · "}
                      <span className="font-semibold">
                        {CONTRACT_LABELS[e.contract_type as ContractType]}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleDelete(e.id, `${e.first_name} ${e.last_name}`)}
                className="rounded-full ring-1 ring-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* =========================================================================
 * PANNEAU RAPPELS
 * ========================================================================= */

function RemindersPanel({
  clientId,
  reminders,
  employees,
}: {
  clientId: string;
  reminders: HrReminder[];
  employees: HrEmployee[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("client_id", clientId);
    startTransition(async () => {
      const res = await createReminderAction(fd);
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
    if (!confirm(`Supprimer le rappel « ${title} » ?`)) return;
    startTransition(async () => {
      const res = await deleteReminderAction(id, clientId);
      if (!res.ok) alert(`Erreur : ${res.error}`);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-accent-600 transition"
        >
          {showForm ? "Annuler" : "+ Ajouter un rappel"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 animate-fade-up space-y-3"
        >
          <h3 className="text-base font-bold text-primary-900">Nouveau rappel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Titre" required>
              <input name="title" required className={inputClass} />
            </Field>
            <Field label="Date d'échéance" required>
              <input name="due_date" type="date" required className={inputClass} />
            </Field>
            <Field label="Catégorie">
              <select name="category" className={inputClass}>
                <option value="">—</option>
                {(Object.entries(REMINDER_CATEGORY_META) as Array<[ReminderCategory, typeof REMINDER_CATEGORY_META[ReminderCategory]]>).map(
                  ([k, m]) => (
                    <option key={k} value={k}>
                      {m.emoji} {m.label}
                    </option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Salarié concerné (optionnel)">
              <select name="related_employee_id" className={inputClass}>
                <option value="">—</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                name="description"
                rows={2}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-[var(--radius-button)] bg-primary-600 px-5 py-2 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {pending ? "Enregistrement…" : "Créer le rappel"}
            </button>
          </div>
        </form>
      )}

      {reminders.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
          Aucun rappel. Créez-en un pour ce client.
        </div>
      ) : (
        <ul className="space-y-2">
          {reminders.map((r) => {
            const meta = REMINDER_CATEGORY_META[r.category ?? "autre"];
            return (
              <li
                key={r.id}
                className={`flex items-center gap-3 rounded-xl bg-white ring-1 ring-neutral-200 p-3 ${r.done ? "opacity-60" : ""}`}
              >
                <span className="text-lg">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm ${r.done ? "line-through text-neutral-500" : "text-primary-900"}`}
                  >
                    {r.title}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {new Date(r.due_date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {r.done ? " · ✓ traité" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(r.id, r.title)}
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

/* ------ UI helpers ------ */

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
