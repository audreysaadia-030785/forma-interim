"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Formation } from "@/lib/formations-catalog";
import { styleFor } from "@/lib/formation-icons";

type Props = {
  formations: Formation[];
  categories: string[];
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function FormationCatalog({ formations, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = formations;
    if (activeCategory) list = list.filter((f) => f.category === activeCategory);
    const q = norm(query).trim();
    if (q) {
      list = list.filter((f) => {
        const hay = `${norm(f.title)} ${norm(f.category)}`;
        return hay.includes(q);
      });
    }
    return list;
  }, [formations, activeCategory, query]);

  // Compteurs par catégorie pour les pills.
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    formations.forEach((f) => m.set(f.category, (m.get(f.category) ?? 0) + 1));
    return m;
  }, [formations]);

  // Groupage par catégorie pour l'affichage.
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
    <div className="space-y-6">
      {/* Recherche */}
      <div className="relative animate-fade-up">
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
          className="w-full rounded-full border border-neutral-300 bg-white pl-11 pr-4 py-3 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
        />
      </div>

      {/* Pastilles catégorie */}
      <div className="flex flex-wrap gap-2 animate-fade-up">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeCategory === null
              ? "bg-primary-700 text-white shadow-md"
              : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
          }`}
        >
          Toutes
          <span className="opacity-70">({formations.length})</span>
        </button>
        {categories.map((cat) => {
          const style = styleFor(cat);
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(active ? null : cat)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-primary-700 text-white shadow-md ring-1 ring-primary-700"
                  : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
              }`}
            >
              <span>{style.emoji}</span>
              <span>{cat}</span>
              <span className="opacity-70">({counts.get(cat) ?? 0})</span>
            </button>
          );
        })}
      </div>

      {/* Compteur */}
      <p className="text-sm text-neutral-500 animate-fade-up">
        <strong className="text-primary-900">{filtered.length}</strong>{" "}
        formation{filtered.length > 1 ? "s" : ""} affichée
        {filtered.length > 1 ? "s" : ""}
        {activeCategory && (
          <> dans <strong className="text-primary-700">{activeCategory}</strong></>
        )}
        {query && <> correspondant à « {query} »</>}
      </p>

      {/* Catalogue */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center animate-fade-up">
          <p className="text-neutral-500">
            Aucune formation ne correspond à votre recherche.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory(null);
            }}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition"
          >
            Réinitialiser les filtres
          </button>
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
                      index={i}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="rounded-[var(--radius-card)] bg-primary-50/60 ring-1 ring-primary-200 p-5 text-sm text-primary-900 leading-relaxed animate-fade-up">
        💡 <strong>Comment ça se passe ?</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-primary-800/90">
          <li>Sélectionnez la formation qui vous intéresse.</li>
          <li>Renseignez vos besoins (participants, dates souhaitées, format, aménagements…).</li>
          <li>Le calendrier est ajusté avec vous selon vos contraintes — <strong>nous consulter</strong>.</li>
          <li>Vous recevez votre <strong>devis sous 48 h maximum</strong> après réception de la demande.</li>
        </ul>
      </div>
    </div>
  );
}

function FormationCard({
  formation,
  index,
}: {
  formation: Formation;
  index: number;
}) {
  const style = styleFor(formation.category);
  return (
    <Link
      href={`/client/nouvelle-demande/formation/${formation.id}`}
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
            {formation.durationHint && (
              <p className="mt-1 text-[11px] text-neutral-500 font-semibold">
                ⏱ {formation.durationHint}
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
