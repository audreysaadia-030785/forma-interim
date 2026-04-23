// Mapping catégorie → pictogramme + couleur d'accent
// Permet une présentation visuelle riche du catalogue de formations.

export type CategoryStyle = {
  emoji: string;
  /** Classes Tailwind pour le badge de catégorie. */
  badgeClass: string;
  /** Classes Tailwind pour la pastille de l'icône sur la carte. */
  iconBgClass: string;
};

/**
 * Photos d'illustration par super-catégorie (Unsplash, libres de droit).
 * Format URL Unsplash optimisé en 600x200 pour bandeau de carte.
 */
export const SUPER_CATEGORY_PHOTOS: Record<string, string> = {
  "Réglementaires":
    "https://images.unsplash.com/photo-1541976590-713941681591?w=600&h=200&fit=crop&auto=format",
  "Sécurité & Prévention":
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=200&fit=crop&auto=format",
  "Management & Soft skills":
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=200&fit=crop&auto=format",
  "RH & Développement":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=200&fit=crop&auto=format",
  "Autre":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=200&fit=crop&auto=format",
};

export function photoForSuperCategory(superCategory: string): string {
  return (
    SUPER_CATEGORY_PHOTOS[superCategory] ??
    SUPER_CATEGORY_PHOTOS["Autre"]
  );
}

const DEFAULT_STYLE: CategoryStyle = {
  emoji: "📘",
  badgeClass: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  iconBgClass: "bg-neutral-100 text-neutral-700",
};

const STYLES: Record<string, CategoryStyle> = {
  "AIPR - Reseaux": {
    emoji: "🚧",
    badgeClass: "bg-orange-100 text-orange-700 ring-orange-200",
    iconBgClass: "bg-orange-100 text-orange-700",
  },
  "Bien-etre, QVT & Sante au travail": {
    emoji: "🌿",
    badgeClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    iconBgClass: "bg-emerald-100 text-emerald-700",
  },
  "CACES R482 - Engins de chantier": {
    emoji: "🚜",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R483 - Grues mobiles": {
    emoji: "🏗️",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R484 - Ponts roulants et portiques": {
    emoji: "🏭",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R485 - Gerbeurs a conducteur accompagnant": {
    emoji: "📦",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R486 - PEMP / Nacelles": {
    emoji: "🪜",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R487 - Grues a tour": {
    emoji: "🗼",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R489 - Chariots automoteurs a conducteur porte": {
    emoji: "🚛",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "CACES R490 - Grues auxiliaires de chargement": {
    emoji: "🚚",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-100 text-amber-800",
  },
  "Communication & Relations professionnelles": {
    emoji: "💬",
    badgeClass: "bg-pink-100 text-pink-700 ring-pink-200",
    iconBgClass: "bg-pink-100 text-pink-700",
  },
  "Coordination & Encadrement": {
    emoji: "👥",
    badgeClass: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    iconBgClass: "bg-indigo-100 text-indigo-700",
  },
  "Developpement durable, RSE & Transition ecologique": {
    emoji: "🌍",
    badgeClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    iconBgClass: "bg-emerald-100 text-emerald-700",
  },
  "Elingage & Levage": {
    emoji: "⛓️",
    badgeClass: "bg-slate-100 text-slate-700 ring-slate-200",
    iconBgClass: "bg-slate-100 text-slate-700",
  },
  "Formations Complementaires": {
    emoji: "📚",
    badgeClass: "bg-neutral-100 text-neutral-700 ring-neutral-200",
    iconBgClass: "bg-neutral-100 text-neutral-700",
  },
  "Intelligence Artificielle & Competences numeriques": {
    emoji: "🤖",
    badgeClass: "bg-violet-100 text-violet-700 ring-violet-200",
    iconBgClass: "bg-violet-100 text-violet-700",
  },
  "Management & Leadership": {
    emoji: "🎯",
    badgeClass: "bg-accent-100 text-accent-700 ring-accent-200",
    iconBgClass: "bg-accent-100 text-accent-700",
  },
  "Organisation, Efficacite personnelle & Gestion du temps": {
    emoji: "⏰",
    badgeClass: "bg-blue-100 text-blue-700 ring-blue-200",
    iconBgClass: "bg-blue-100 text-blue-700",
  },
  "RH, Droit du travail & Gestion d'entreprise": {
    emoji: "⚖️",
    badgeClass: "bg-primary-100 text-primary-700 ring-primary-200",
    iconBgClass: "bg-primary-100 text-primary-700",
  },
  "Risque Chimique & Amiante": {
    emoji: "☣️",
    badgeClass: "bg-rose-100 text-rose-700 ring-rose-200",
    iconBgClass: "bg-rose-100 text-rose-700",
  },
  "Risque Electrique": {
    emoji: "⚡",
    badgeClass: "bg-yellow-100 text-yellow-800 ring-yellow-200",
    iconBgClass: "bg-yellow-100 text-yellow-800",
  },
  "Risques Speciaux": {
    emoji: "⚠️",
    badgeClass: "bg-red-100 text-red-700 ring-red-200",
    iconBgClass: "bg-red-100 text-red-700",
  },
  "Sante & Securite Generale": {
    emoji: "⛑️",
    badgeClass: "bg-red-100 text-red-700 ring-red-200",
    iconBgClass: "bg-red-100 text-red-700",
  },
  "Travail en Hauteur": {
    emoji: "🧗",
    badgeClass: "bg-sky-100 text-sky-700 ring-sky-200",
    iconBgClass: "bg-sky-100 text-sky-700",
  },
};

export function styleFor(category: string): CategoryStyle {
  return STYLES[category] ?? DEFAULT_STYLE;
}
