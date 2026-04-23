import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  REMINDER_CATEGORY_META,
  type HrEmployee,
  type HrReminder,
  daysUntil,
  isOverdue,
  isUrgent,
} from "@/lib/hr-types";
import { ReminderToggle } from "./rappels/reminder-toggle";

export const dynamic = "force-dynamic";

export default async function ClientRhDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Récupère le client rattaché
  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, company_name")
    .eq("primary_user_id", user.id)
    .maybeSingle();

  if (!clientRow) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
        <p className="text-neutral-500">
          Aucun compte client lié à cet utilisateur.
        </p>
      </div>
    );
  }

  const { data: reminders } = await supabase
    .from("hr_reminders")
    .select(
      "id, client_id, title, description, category, due_date, related_employee_id, done, done_at",
    )
    .eq("client_id", clientRow.id)
    .order("due_date", { ascending: true });

  const { data: employees } = await supabase
    .from("hr_employees")
    .select(
      "id, client_id, first_name, last_name, contract_type, contract_end_date, trial_end_date, next_medical_visit_date, next_entretien_pro_date",
    )
    .eq("client_id", clientRow.id);

  const { data: sharedDocs } = await supabase
    .from("hr_documents")
    .select("id")
    .or(`client_id.is.null,client_id.eq.${clientRow.id}`);

  const all: HrReminder[] = (reminders ?? []) as HrReminder[];
  const overdue = all.filter((r) => !r.done && isOverdue(r.due_date));
  const urgent = all.filter((r) => !r.done && isUrgent(r.due_date));
  const pending = all.filter((r) => !r.done);
  const doneCount = all.length - pending.length;

  // Prochaines échéances (rappels non faits + échéances salariés)
  type DeadlineItem = {
    label: string;
    date: string;
    category: string;
    isEmployee: boolean;
  };
  const deadlines: DeadlineItem[] = [];
  for (const r of pending.slice(0, 10)) {
    deadlines.push({
      label: r.title,
      date: r.due_date,
      category: r.category ?? "autre",
      isEmployee: false,
    });
  }
  for (const e of (employees ?? []) as HrEmployee[]) {
    if (e.trial_end_date) {
      deadlines.push({
        label: `Fin de période d'essai — ${e.first_name} ${e.last_name}`,
        date: e.trial_end_date,
        category: "contrat",
        isEmployee: true,
      });
    }
    if (e.contract_end_date) {
      deadlines.push({
        label: `Fin de CDD — ${e.first_name} ${e.last_name}`,
        date: e.contract_end_date,
        category: "contrat",
        isEmployee: true,
      });
    }
    if (e.next_medical_visit_date) {
      deadlines.push({
        label: `Visite médicale — ${e.first_name} ${e.last_name}`,
        date: e.next_medical_visit_date,
        category: "visite_medicale",
        isEmployee: true,
      });
    }
    if (e.next_entretien_pro_date) {
      deadlines.push({
        label: `Entretien professionnel — ${e.first_name} ${e.last_name}`,
        date: e.next_entretien_pro_date,
        category: "entretien_pro",
        isEmployee: true,
      });
    }
  }
  deadlines.sort((a, b) => a.date.localeCompare(b.date));
  const nextDeadlines = deadlines.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
        <KPI label="Salariés" value={employees?.length ?? 0} color="primary" emoji="👥" />
        <KPI
          label="Rappels en retard"
          value={overdue.length}
          color={overdue.length > 0 ? "rose" : "neutral"}
          emoji="⏰"
        />
        <KPI
          label="Rappels à venir (15j)"
          value={urgent.length}
          color={urgent.length > 0 ? "accent" : "neutral"}
          emoji="🔔"
        />
        <KPI
          label="Documents disponibles"
          value={sharedDocs?.length ?? 0}
          color="success"
          emoji="📁"
        />
      </section>

      {/* Rappels urgents */}
      {(overdue.length > 0 || urgent.length > 0) && (
        <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up">
          <header className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-primary-900 flex items-center gap-2">
              🔔 Rappels à traiter
            </h2>
            <Link
              href="/client/rh/rappels"
              className="text-xs font-bold text-primary-600 hover:text-accent-600"
            >
              Tout voir →
            </Link>
          </header>

          <ul className="space-y-2">
            {[...overdue, ...urgent.filter((r) => !overdue.includes(r))]
              .slice(0, 5)
              .map((r) => {
                const d = daysUntil(r.due_date);
                const overdueItem = d < 0;
                const meta = REMINDER_CATEGORY_META[r.category ?? "autre"];
                return (
                  <li
                    key={r.id}
                    className={`flex items-start gap-3 rounded-xl p-3 ring-1 ${
                      overdueItem
                        ? "bg-rose-50/60 ring-rose-200"
                        : "bg-accent-50/60 ring-accent-200"
                    }`}
                  >
                    <ReminderToggle id={r.id} done={r.done} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${meta.badge}`}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase ${
                            overdueItem ? "text-rose-700" : "text-accent-700"
                          }`}
                        >
                          {overdueItem
                            ? `En retard de ${Math.abs(d)} j`
                            : d === 0
                              ? "Aujourd'hui"
                              : `Dans ${d} j`}
                        </span>
                      </div>
                      <p className="mt-0.5 font-bold text-primary-900 text-sm">
                        {r.title}
                      </p>
                      {r.description && (
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {r.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      )}

      {/* Prochaines échéances */}
      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up">
        <h2 className="text-lg font-extrabold text-primary-900 mb-4 flex items-center gap-2">
          📅 Prochaines échéances
        </h2>
        {nextDeadlines.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">
            Aucune échéance à venir. Ajoutez vos salariés pour voir apparaître
            les échéances automatiques.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {nextDeadlines.map((d, i) => {
              const days = daysUntil(d.date);
              const meta = REMINDER_CATEGORY_META[d.category as keyof typeof REMINDER_CATEGORY_META] ??
                REMINDER_CATEGORY_META.autre;
              return (
                <li key={i} className="py-2 flex items-center gap-3 flex-wrap">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-base">
                    {meta.emoji}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-primary-900">
                    {d.label}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(d.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase ${
                      days < 0
                        ? "text-rose-700"
                        : days <= 15
                          ? "text-accent-700"
                          : "text-neutral-500"
                    }`}
                  >
                    {days < 0 ? `-${Math.abs(days)} j` : `J+${days}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Progression des rappels */}
      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up">
        <h2 className="text-lg font-extrabold text-primary-900 mb-3 flex items-center gap-2">
          ✅ Suivi de vos rappels
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-extrabold text-primary-900">
            {doneCount} / {all.length}
          </span>
          <span className="text-xs text-neutral-500">rappels traités</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{
              width:
                all.length === 0 ? "0%" : `${(doneCount / all.length) * 100}%`,
            }}
          />
        </div>
      </section>
    </div>
  );
}

function KPI({
  label,
  value,
  color,
  emoji,
}: {
  label: string;
  value: number;
  color: "primary" | "accent" | "success" | "rose" | "neutral";
  emoji: string;
}) {
  const colors = {
    primary: "bg-primary-50 text-primary-700",
    accent: "bg-accent-50 text-accent-700",
    success: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    neutral: "bg-neutral-100 text-neutral-600",
  }[color];
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-neutral-200 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-primary-900">{value}</p>
        </div>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${colors}`}
        >
          {emoji}
        </span>
      </div>
    </div>
  );
}
