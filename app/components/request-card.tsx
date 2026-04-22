import Link from "next/link";
import {
  type InterimRequest,
  STATUS_META,
  formatShortDate,
} from "@/lib/demo-data";

type Props = {
  request: InterimRequest;
  /** Index pour décaler l'animation d'entrée. */
  index?: number;
  /** Route de destination — côté client par défaut. */
  basePath?: string;
};

export function RequestCard({ request, index = 0, basePath = "/client" }: Props) {
  const meta = STATUS_META[request.status];
  const href = `${basePath}/demande/${request.id}`;

  return (
    <Link
      href={href}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <article className="relative rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:ring-primary-200 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-neutral-500">
              {request.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            {request.candidates.length > 0 &&
              request.status === "proposed" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 text-white px-2.5 py-1 text-xs font-bold shadow-sm animate-pulse">
                  {request.candidates.length} profil
                  {request.candidates.length > 1 ? "s" : ""} à valider
                </span>
              )}
          </div>
          <span className="text-xs text-neutral-500">
            Créée le {formatShortDate(request.createdAt)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-primary-900 group-hover:text-primary-600 transition-colors">
          {request.poste}
        </h3>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Fact icon="users" label="Postes" value={request.headcount} />
          <Fact
            icon="calendar"
            label="Démarrage"
            value={formatShortDate(request.startDate)}
          />
          <Fact icon="clock" label="Durée" value={request.duration} />
          <Fact icon="pin" label="Lieu" value={request.location} />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="text-sm text-neutral-600">
            <span className="font-semibold text-primary-900">
              {request.hourlyRate.toFixed(2)} €/h
            </span>
            {request.meals && (
              <span className="text-neutral-500">
                {" "}
                · Panier {request.meals.toFixed(2)} €
              </span>
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-accent-500 transition-colors">
            Voir
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: "users" | "calendar" | "clock" | "pin";
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
        <FactIcon name={icon} />
      </span>
      <span className="flex flex-col min-w-0">
        <span className="text-[11px] uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        <span className="font-semibold text-primary-900 truncate">
          {value}
        </span>
      </span>
    </div>
  );
}

function FactIcon({ name }: { name: "users" | "calendar" | "clock" | "pin" }) {
  const common = {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "users":
      return (
        <svg {...common}>
          <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="8" r="3.5" />
          <path d="M21 20v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
  }
}
