import Link from "next/link";
import { RhSubnav } from "./subnav";

export default function ClientRhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Mon RH</span>
      </nav>

      <header className="mb-6 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Accompagnement RH
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Mon espace RH
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Pilotez votre équipe, suivez vos échéances RH, accédez à votre
          bibliothèque de documents et sollicitez-nous pour tout besoin
          d&apos;accompagnement spécifique.
        </p>
      </header>

      <RhSubnav />

      <div className="mt-6">{children}</div>
    </div>
  );
}
