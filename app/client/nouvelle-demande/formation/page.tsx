import Link from "next/link";
import { FORMATION_CATEGORIES, FORMATIONS } from "@/lib/formations-catalog";
import { FormationCatalog } from "./formation-catalog";

export default function FormationCatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <Link
          href="/client/nouvelle-demande"
          className="hover:text-primary-600 transition"
        >
          Nouvelle demande
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Formation</span>
      </nav>

      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Catalogue de formations
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          {FORMATIONS.length} formations disponibles
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Parcourez notre catalogue, sélectionnez la formation qui répond à
          votre besoin et formulez votre demande en quelques clics. Calendrier
          ajusté en fonction de vos contraintes (nous consulter), devis
          transmis sous <strong>48 h maximum</strong> après réception.
        </p>
      </header>

      <FormationCatalog
        formations={FORMATIONS}
        categories={FORMATION_CATEGORIES}
      />
    </div>
  );
}
