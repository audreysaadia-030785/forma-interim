"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import { createClient } from "@/lib/supabase/client";

type TopbarProps = {
  role: "client" | "admin";
  userName: string;
  userCompany?: string;
};

export function Topbar({ role, userName, userCompany }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems =
    role === "client"
      ? [
          { label: "Tableau de bord", href: "/client" },
          { label: "Nouvelle demande", href: "/client/nouvelle-demande" },
        ]
      : [
          { label: "Demandes", href: "/admin" },
          { label: "Candidats", href: "/admin/candidats" },
          { label: "Clients", href: "/admin/clients" },
        ];

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href={role === "client" ? "/client" : "/admin"}
          className="flex items-center gap-3 shrink-0"
        >
          <BrandMark size="sm" withText={false} />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-[0.08em]">
              <span className="text-primary-700">ASCV</span>{" "}
              <span className="text-accent-500">CONSEILS</span>
            </span>
            <span
              className="text-[9px] italic text-neutral-500"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Recruter avec stratégie, grandir avec excellence
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/client" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-white ring-1 ring-neutral-200 px-2 py-1 hover:ring-primary-300 hover:shadow-sm transition"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold shadow-sm">
                {initials}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight pr-2">
                <span className="text-xs font-semibold text-primary-900">
                  {userName}
                </span>
                {userCompany && (
                  <span className="text-[11px] text-neutral-500">
                    {userCompany}
                  </span>
                )}
              </span>
              <svg
                className="h-4 w-4 text-neutral-500 mr-1"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 7.5 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-neutral-200 p-1.5 z-20 animate-fade-up"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-primary-900">
                      {userName}
                    </p>
                    {userCompany && (
                      <p className="text-xs text-neutral-500">{userCompany}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-neutral-50 text-neutral-700"
                    onClick={() => {
                      setMenuOpen(false);
                      alert("Fonction à venir");
                    }}
                  >
                    Mon profil
                  </button>
                  <button
                    type="button"
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-rose-50 text-rose-600"
                    onClick={async () => {
                      setMenuOpen(false);
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-2 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
