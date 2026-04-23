// Types partagés du module RH.

export type ContractType =
  | "cdi"
  | "cdd"
  | "alternance"
  | "stage"
  | "freelance"
  | "interim";

export const CONTRACT_LABELS: Record<ContractType, string> = {
  cdi: "CDI",
  cdd: "CDD",
  alternance: "Alternance",
  stage: "Stage",
  freelance: "Freelance",
  interim: "Intérim",
};

export type HrEmployee = {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  contract_type: ContractType | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  trial_end_date: string | null;
  last_medical_visit_date: string | null;
  next_medical_visit_date: string | null;
  last_entretien_pro_date: string | null;
  next_entretien_pro_date: string | null;
  notes: string | null;
};

export type ReminderCategory =
  | "conges"
  | "visite_medicale"
  | "entretien_pro"
  | "formation"
  | "duerp"
  | "legal"
  | "contrat"
  | "autre";

export const REMINDER_CATEGORY_META: Record<
  ReminderCategory,
  { label: string; emoji: string; badge: string }
> = {
  conges: {
    label: "Congés",
    emoji: "🏖️",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  visite_medicale: {
    label: "Visite médicale",
    emoji: "🩺",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  entretien_pro: {
    label: "Entretien pro",
    emoji: "💬",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  formation: {
    label: "Formation",
    emoji: "🎓",
    badge: "bg-accent-50 text-accent-700 ring-accent-200",
  },
  duerp: {
    label: "DUERP",
    emoji: "📋",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  legal: {
    label: "Échéance légale",
    emoji: "⚖️",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
  contrat: {
    label: "Contrat",
    emoji: "📄",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  autre: {
    label: "Autre",
    emoji: "📌",
    badge: "bg-neutral-100 text-neutral-700 ring-neutral-200",
  },
};

export type HrReminder = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  category: ReminderCategory | null;
  due_date: string;
  related_employee_id: string | null;
  done: boolean;
  done_at: string | null;
};

export type DocumentCategory =
  | "contrats"
  | "procedures"
  | "reglement_interieur"
  | "entretiens"
  | "veille_juridique"
  | "modeles"
  | "autre";

export const DOCUMENT_CATEGORY_META: Record<
  DocumentCategory,
  { label: string; emoji: string }
> = {
  contrats: { label: "Modèles de contrats", emoji: "📄" },
  procedures: { label: "Procédures RH", emoji: "📋" },
  reglement_interieur: { label: "Règlement intérieur", emoji: "⚖️" },
  entretiens: { label: "Trames d'entretiens", emoji: "💬" },
  veille_juridique: { label: "Veille juridique", emoji: "📰" },
  modeles: { label: "Autres modèles", emoji: "📝" },
  autre: { label: "Autre", emoji: "📁" },
};

export type HrDocument = {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  category: DocumentCategory | null;
  file_path: string | null;
  file_name: string | null;
  published_at: string;
};

export function daysUntil(iso: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function isOverdue(iso: string): boolean {
  return daysUntil(iso) < 0;
}

export function isUrgent(iso: string): boolean {
  const d = daysUntil(iso);
  return d >= 0 && d <= 15;
}
