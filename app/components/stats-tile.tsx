import Link from "next/link";

type Props = {
  label: string;
  value: number;
  trend?: string;
  icon: "clock" | "users" | "check";
  color: "primary" | "accent" | "success";
  href?: string;
};

const COLOR_MAP = {
  primary: {
    iconWrap: "bg-primary-100 text-primary-700",
    value: "text-primary-900",
    trend: "text-primary-600",
  },
  accent: {
    iconWrap: "bg-accent-100 text-accent-700",
    value: "text-primary-900",
    trend: "text-accent-600",
  },
  success: {
    iconWrap: "bg-emerald-100 text-emerald-700",
    value: "text-primary-900",
    trend: "text-emerald-600",
  },
} as const;

export function StatsTile({ label, value, trend, icon, color, href }: Props) {
  const c = COLOR_MAP[color];

  const content = (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{label}</p>
          <p className={`mt-2 text-4xl font-extrabold ${c.value}`}>{value}</p>
          {trend && (
            <p className={`mt-2 text-xs font-semibold ${c.trend}`}>{trend}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconWrap}`}
        >
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function Icon({ name }: { name: Props["icon"] }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="8" r="3.5" />
        <path d="M21 20v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </svg>
  );
}
