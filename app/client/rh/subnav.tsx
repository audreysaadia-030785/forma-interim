"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/client/rh", label: "Dashboard", emoji: "📊" },
  { href: "/client/rh/rappels", label: "Rappels & alertes", emoji: "🔔" },
  { href: "/client/rh/equipe", label: "Mon équipe", emoji: "👥" },
  { href: "/client/rh/bibliotheque", label: "Bibliothèque", emoji: "📁" },
  {
    href: "/client/nouvelle-demande/accompagnement-rh",
    label: "Demander un accompagnement",
    emoji: "🤝",
    highlight: true,
  },
];

export function RhSubnav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-2 animate-fade-up">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active
                ? "bg-primary-700 text-white shadow-md"
                : t.highlight
                  ? "bg-accent-500 text-white shadow-md hover:bg-accent-600"
                  : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
            }`}
          >
            <span>{t.emoji}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
