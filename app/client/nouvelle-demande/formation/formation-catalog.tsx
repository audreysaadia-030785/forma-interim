"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Formation, SuperCategory } from "@/lib/formations-catalog";
import { styleFor } from "@/lib/formation-icons";

type Props = {
  formations: Formation[];
  superCategories: SuperCategory[];
  detailedCategories: string[];
};

type TrainingKind = "initiale" | "recyclage";

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function FormationCatalog({
  formations,
  superCategories,
  detailedCategories,
}: Props) {
  const [kind, setKind] = useState<TrainingKind>("initiale");
  const [superCat, setSuperCat] = useState<SuperCategory | "all">("all");
  const [detailedCat, setDetailedCat] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = formations;

    if (kind === "recyclage") list = list.filter((f) => f.hasRecyclage);
    if (superCat !== "all") list = list.filter((f) => f.superCategory === superCat);
    if (detailedCat !== "all") list = list.filter((f) => f.category === detailedCat);

    const q = norm(query).trim();
    if (q) {
      list = list.filter((f) =>
        `${norm(f.title)} ${norm(f.category)}`.includes(q),
      );
    }
    return list;
  }, [formations, kind, superCat, detailedCat, query]);

  // Catégories détaillées affichées dans la 2e liste déroulante selon la
  // super-catégorie choisie.
  const availableDetailedCategories = useMemo(() => {
    if (superCat === "all") return detailedCategories;
    return [
      ...new Set(
        formations
          .filter((f) => f.superCategory === superCat)
          .map((f) => f.category),
      ),
    ].sort((a, b) => a.localeCompare(b, "fr"));
  }, [superCat, detailedCategories, formations]);

  // Regrouper pour l'affichage.
  const grouped = useMemo(() => {
    const m = new Map<string, Formation[]>();
    filtered.forEach((f) => {
      const arr = m.get(f.category);
      if (arr) arr.push(f);
      else m.set(f.category, [f]);
    });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Toggle initial / recyclage */}
      <div
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-up"
        role="radiogroup"
        aria-label="Type de formation"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-primary-700 sm:mr-2">
          Je cherche une formation
        </span>
        <div className="inline-flex rounded-full bg-white ring-1 ring-neutral-200 p-1 shadow-sm">
          {(
            [
              { value: "initiale", label: "Initiale" },
              { value: "recyclage", label: "Recyclage / renouvellement" },
            ] as const
          ).map((opt) => {
            const active = kind === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setKind(opt.value);
                  // Reset des filtres détaillés si on bascule.
                  setDetailedCat("all");
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-primary-700 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
                }`}
                role="radio"
                aria-checked={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-up">
        {/* Recherche */}
        <div className="relative md:col-span-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-5-5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une formation (ex : CACES, leadership, amiante…)"
            className="w-full rounded-full border border-neutral-300 bg-white pl-11 pr-4 py-2.5 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
          />
        </div>

        {/* Super catégorie */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-primary-700 mb-1">
            Grande famille
          </label>
          <div className="relative">
            <select
              value={superCat}
              onChange={(e) => {
                setSuperCat(e.target.value as SuperCategory | "all");
                setDetailedCat("all");
              }}
              className="w-full appearance-none rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-3 pr-10 py-2.5 text-sm font-semibold text-primary-900 cursor-pointer focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
            >
              <option value="all">Toutes les familles</option>
              {superCategories.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>

        {/* Catégorie détaillée */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-primary-700 mb-1">
            Catégorie précise
          </label>
          <div className="relative">
            <select
              value={detailedCat}
              onChange={(e) => setDetailedCat(e.target.value)}
              className="w-full appearance-none rounded-[var(--radius-button)] border border-neutral-300 bg-white pl-3 pr-10 py-2.5 text-sm font-semibold text-primary-900 cursor-pointer focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
            >
              <option value="all">Toutes les catégories</option>
              {availableDetailedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* Compteur / reset */}
      <div className="flex items-center justify-between flex-wrap gap-2 animate-fade-up">
        <p className="text-sm text-neutral-600">
          <strong className="text-primary-900">{filtered.length}</strong>{" "}
          formation{filtered.length > 1 ? "s" : ""} affichée
          {filtered.length > 1 ? "s" : ""}
          {kind === "recyclage" && (
            <span className="ml-1 text-accent-600 font-semibold">(recyclage)</span>
          )}
        </p>
        {(superCat !== "all" || detailedCat !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setSuperCat("all");
              setDetailedCat("all");
              setQuery("");
            }}
            className="text-xs font-semibold text-primary-600 hover:text-accent-600"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Catalogue */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center animate-fade-up">
          <p className="text-neutral-500">
            Aucune formation ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([category, items], gi) => {
            const style = styleFor(category);
            return (
              <section
                key={category}
                className="animate-fade-up"
                style={{ animationDelay: `${gi * 50}ms` }}
              >
                <header className="mb-3 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl shadow-sm ${style.iconBgClass}`}
                  >
                    {style.emoji}
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold text-primary-900">
                      {category}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {items.length} formation{items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((f, i) => (
                    <FormationCard
                      key={f.id}
                      formation={f}
                      kind={kind}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* CTA "Formation non listée" — toujours visible */}
      <section className="rounded-[var(--radius-card)] bg-gradient-to-br from-accent-50 via-white to-primary-50 ring-1 ring-accent-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-2xl shadow-md">
            ✨
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-primary-900">
              Vous ne trouvez pas votre formation dans notre offre&nbsp;?
            </h3>
            <p className="text-sm text-neutral-700 mt-1">
              Décrivez-nous votre besoin&nbsp;: nous étudions chaque demande et
              proposons régulièrement des formations sur mesure que nous
              intégrerons ensuite au catalogue.
            </p>
          </div>
          <Link
            href="/client/nouvelle-demande/formation/autre"
            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-800 hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            Demander une formation sur mesure
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <div className="rounded-[var(--radius-card)] bg-primary-50/60 ring-1 ring-primary-200 p-5 text-sm text-primary-900 leading-relaxed animate-fade-up">
        💡 <strong>Comment ça se passe&nbsp;?</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-primary-800/90">
          <li>Sélectionnez la formation qui vous intéresse.</li>
          <li>
            Renseignez vos besoins (participants, dates souhaitées, format,
            aménagements…).
          </li>
          <li>
            Calendrier ajusté ensemble selon vos contraintes —{" "}
            <strong>nous consulter</strong>.
          </li>
          <li>
            Vous recevez votre <strong>devis sous 48 h maximum</strong> après
            réception de la demande.
          </li>
        </ul>
      </div>
    </div>
  );
}

function FormationCard({
  formation,
  kind,
  index,
}: {
  formation: Formation;
  kind: TrainingKind;
  index: number;
}) {
  const style = styleFor(formation.category);
  // Conserver le choix initial/recyclage dans l'URL pour pré-sélectionner côté form.
  const href = `/client/nouvelle-demande/formation/${formation.id}?kind=${kind}`;

  return (
    <Link
      href={href}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <article className="h-full rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm hover:shadow-md hover:ring-primary-200 hover:-translate-y-0.5 transition-all p-4 flex flex-col">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${style.iconBgClass}`}
          >
            {style.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-primary-900 leading-snug group-hover:text-primary-600 transition-colors">
              {formation.title}
            </h3>
            {formation.hasRecyclage && (
              <p className="mt-1 text-[10px] font-bold text-emerald-700">
                ↻ Recyclage disponible
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-end text-xs font-bold text-primary-600 group-hover:text-accent-600 transition-colors">
          Demander
          <svg
            className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
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
  );
}
