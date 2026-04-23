import Link from "next/link";
import {
  FORMATIONS,
  SUPER_CATEGORIES,
  FORMATION_CATEGORIES,
} from "@/lib/formations-catalog";
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
          Notre offre
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Formations réglementaires, sécurité, soft skills et bien plus
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Parcourez notre offre pour sélectionner la formation qui répond à
          votre besoin. Vous ne trouvez pas&nbsp;? Décrivez votre demande, nous
          étudions toute requête sur mesure. Calendrier ajusté ensemble
          (nous consulter), <strong>devis transmis sous 48&nbsp;h maximum</strong>{" "}
          après réception.
        </p>
      </header>

      <FormationCatalog
        formations={FORMATIONS}
        superCategories={SUPER_CATEGORIES}
        detailedCategories={FORMATION_CATEGORIES}
      />
    </div>
  );
}
