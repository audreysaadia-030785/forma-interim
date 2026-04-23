import { createClient } from "@/lib/supabase/server";
import {
  REMINDER_CATEGORY_META,
  type HrReminder,
  daysUntil,
} from "@/lib/hr-types";
import { ReminderToggle } from "./reminder-toggle";

export const dynamic = "force-dynamic";

export default async function ClientRhRappelsPage() {
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

  const { data: reminders } = await supabase
    .from("hr_reminders")
    .select("*")
    .eq("client_id", clientRow.id)
    .order("due_date", { ascending: true });

  const all = (reminders ?? []) as HrReminder[];
  const pending = all.filter((r) => !r.done);
  const done = all.filter((r) => r.done);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-primary-900">
          Tous vos rappels{" "}
          <span className="text-neutral-500 font-medium text-base">
            ({all.length})
          </span>
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Les rappels sont créés par votre référent(e) ASCV. Cochez-les au fur
          et à mesure qu&apos;ils sont traités.
        </p>
      </header>

      {pending.length === 0 && done.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500">
            Aucun rappel pour l&apos;instant. Votre référent(e) ASCV en créera
            selon vos besoins (congés, visites médicales, échéances…).
          </p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700 mb-3">
                À traiter ({pending.length})
              </h3>
              <ul className="space-y-2">
                {pending.map((r) => (
                  <ReminderRow key={r.id} reminder={r} />
                ))}
              </ul>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-3">
                ✓ Traités ({done.length})
              </h3>
              <ul className="space-y-2">
                {done.map((r) => (
                  <ReminderRow key={r.id} reminder={r} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ReminderRow({ reminder: r }: { reminder: HrReminder }) {
  const d = daysUntil(r.due_date);
  const meta = REMINDER_CATEGORY_META[r.category ?? "autre"];
  const overdue = !r.done && d < 0;
  const urgent = !r.done && d >= 0 && d <= 15;

  return (
    <li
      className={`flex items-start gap-3 rounded-xl p-4 ring-1 transition ${
        r.done
          ? "bg-neutral-50 ring-neutral-200 opacity-70"
          : overdue
            ? "bg-rose-50/60 ring-rose-200"
            : urgent
              ? "bg-accent-50/60 ring-accent-200"
              : "bg-white ring-neutral-200"
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
          <span className="text-xs text-neutral-500">
            {new Date(r.due_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          {!r.done && (
            <span
              className={`text-[11px] font-bold uppercase ${
                overdue
                  ? "text-rose-700"
                  : urgent
                    ? "text-accent-700"
                    : "text-neutral-500"
              }`}
            >
              {overdue
                ? `-${Math.abs(d)} j`
                : d === 0
                  ? "Aujourd'hui"
                  : `J+${d}`}
            </span>
          )}
        </div>
        <p
          className={`mt-1 font-bold text-sm ${
            r.done ? "line-through text-neutral-500" : "text-primary-900"
          }`}
        >
          {r.title}
        </p>
        {r.description && (
          <p className="text-xs text-neutral-600 mt-0.5">{r.description}</p>
        )}
        {r.done && r.done_at && (
          <p className="text-[10px] text-emerald-700 mt-1">
            Traité le{" "}
            {new Date(r.done_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </li>
  );
}
