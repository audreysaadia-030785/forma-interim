import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CONTRACT_LABELS, type HrEmployee, daysUntil } from "@/lib/hr-types";

export const dynamic = "force-dynamic";

export default async function ClientRhEquipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("primary_user_id", user.id)
    .maybeSingle();
  if (!clientRow) return null;

  const { data: employees } = await supabase
    .from("hr_employees")
    .select("*")
    .eq("client_id", clientRow.id)
    .order("last_name", { ascending: true });

  const list = (employees ?? []) as HrEmployee[];

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-primary-900">
            Mon équipe{" "}
            <span className="text-neutral-500 font-medium text-base">
              ({list.length} {list.length > 1 ? "salariés" : "salarié"})
            </span>
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Consultez les informations de vos salariés, leurs échéances et
            leurs données RH. Les fiches sont gérées par votre référent(e)
            ASCV.
          </p>
        </div>
      </header>

      {list.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center space-y-3">
          <p className="text-neutral-500">
            Aucun salarié enregistré pour l&apos;instant.
          </p>
          <p className="text-xs text-neutral-500">
            Demandez à votre référent(e) ASCV d&apos;ajouter vos salariés pour
            générer automatiquement les rappels RH.
          </p>
          <Link
            href="/client/nouvelle-demande/accompagnement-rh"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700 transition"
          >
            Nous contacter
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </ul>
      )}
    </div>
  );
}

function EmployeeCard({ employee: e }: { employee: HrEmployee }) {
  const initials =
    ((e.first_name[0] ?? "") + (e.last_name[0] ?? "")).toUpperCase();

  const alerts: { label: string; days: number }[] = [];
  if (e.trial_end_date) {
    alerts.push({ label: "Fin période d'essai", days: daysUntil(e.trial_end_date) });
  }
  if (e.contract_end_date) {
    alerts.push({ label: "Fin CDD", days: daysUntil(e.contract_end_date) });
  }
  if (e.next_medical_visit_date) {
    alerts.push({
      label: "Visite médicale",
      days: daysUntil(e.next_medical_visit_date),
    });
  }
  if (e.next_entretien_pro_date) {
    alerts.push({
      label: "Entretien pro",
      days: daysUntil(e.next_entretien_pro_date),
    });
  }

  return (
    <li className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-4 hover:shadow-md transition animate-fade-up">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold">
          {initials}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-primary-900">
              {e.first_name} {e.last_name}
            </h3>
            {e.contract_type && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                {CONTRACT_LABELS[e.contract_type]}
              </span>
            )}
          </div>
          {e.job_title && (
            <p className="text-sm text-neutral-700">{e.job_title}</p>
          )}
          {(e.email || e.phone) && (
            <p className="text-xs text-neutral-500 mt-0.5">
              {[e.email, e.phone].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1">
          {alerts.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="text-neutral-600">{a.label}</span>
              <span
                className={`font-bold ${
                  a.days < 0
                    ? "text-rose-700"
                    : a.days <= 30
                      ? "text-accent-700"
                      : "text-neutral-500"
                }`}
              >
                {a.days < 0
                  ? `Dépassé de ${Math.abs(a.days)} j`
                  : a.days === 0
                    ? "Aujourd'hui"
                    : `Dans ${a.days} j`}
              </span>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
