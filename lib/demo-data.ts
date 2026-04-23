// Données de démonstration — remplacées par la vraie base de données à l'étape suivante.

export type Client = {
  id: string;
  companyName: string;
  siret?: string;
  primaryContact: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
};

export const DEMO_CLIENTS: Client[] = [
  {
    id: "CLI-001",
    companyName: "Acme BTP",
    siret: "123 456 789 00012",
    primaryContact: "Jean Martin",
    email: "j.martin@exemple.fr",
    phone: "06 12 34 56 78",
    active: true,
    createdAt: "2025-09-12T09:00:00Z",
  },
  {
    id: "CLI-002",
    companyName: "Méditerranée Construction",
    siret: "987 654 321 00021",
    primaryContact: "Sophie Durand",
    email: "s.durand@exemple.fr",
    phone: "06 98 76 54 32",
    active: true,
    createdAt: "2026-01-18T10:30:00Z",
  },
  {
    id: "CLI-003",
    companyName: "LogiVar Entrepôts",
    siret: "456 789 123 00033",
    primaryContact: "Karine Lopez",
    email: "k.lopez@exemple.fr",
    phone: "06 45 67 89 10",
    active: false,
    createdAt: "2025-05-22T14:10:00Z",
  },
];

export type CandidateRecord = {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  experienceYears: number;
  cvFileName: string;
  addedAt: string;
};

export const DEMO_CANDIDATE_BASE: CandidateRecord[] = [
  {
    id: "CND-001",
    firstName: "Karim",
    lastName: "B.",
    headline: "Plombier chauffagiste — 9 ans d'expérience",
    experienceYears: 9,
    cvFileName: "CV_Karim_B.pdf",
    addedAt: "2026-02-14T09:00:00Z",
  },
  {
    id: "CND-002",
    firstName: "Olivier",
    lastName: "D.",
    headline: "Plombier / Installateur sanitaire — 6 ans",
    experienceYears: 6,
    cvFileName: "CV_Olivier_D.pdf",
    addedAt: "2026-02-20T11:30:00Z",
  },
  {
    id: "CND-003",
    firstName: "Ahmed",
    lastName: "R.",
    headline: "Maçon coffreur — 12 ans",
    experienceYears: 12,
    cvFileName: "CV_Ahmed_R.pdf",
    addedAt: "2025-11-04T15:00:00Z",
  },
  {
    id: "CND-004",
    firstName: "Julien",
    lastName: "P.",
    headline: "Électricien bâtiment B1V/BR — 7 ans",
    experienceYears: 7,
    cvFileName: "CV_Julien_P.pdf",
    addedAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "CND-005",
    firstName: "Marc",
    lastName: "T.",
    headline: "Conducteur d'engins TP — 15 ans, CACES R482 complet",
    experienceYears: 15,
    cvFileName: "CV_Marc_T.pdf",
    addedAt: "2025-07-28T08:45:00Z",
  },
  {
    id: "CND-006",
    firstName: "Fatima",
    lastName: "E.",
    headline: "Cariste CACES R489 1-3-5 — 4 ans",
    experienceYears: 4,
    cvFileName: "CV_Fatima_E.pdf",
    addedAt: "2026-03-02T13:15:00Z",
  },
  {
    id: "CND-007",
    firstName: "Sébastien",
    lastName: "G.",
    headline: "Soudeur MIG/MAG/TIG — 11 ans, tuyauterie pression",
    experienceYears: 11,
    cvFileName: "CV_Sebastien_G.pdf",
    addedAt: "2025-10-17T16:00:00Z",
  },
  {
    id: "CND-008",
    firstName: "Léa",
    lastName: "M.",
    headline: "Aide-soignante DE — 5 ans, EHPAD et hospitalier",
    experienceYears: 5,
    cvFileName: "CV_Lea_M.pdf",
    addedAt: "2026-03-20T09:00:00Z",
  },
];

export type RequestStatus =
  | "pending" // en attente
  | "proposed" // candidats proposés
  | "validated" // validée (au moins un candidat validé)
  | "refused" // refusée
  | "cancelled"; // annulée

export type InterimRequest = {
  id: string;
  clientId: string;
  clientCompanyName: string;
  poste: string;
  headcount: number;
  startDate: string; // ISO
  /** Pour les anciennes demandes intérim — null en recrutement. */
  duration: string | null;
  location: string;
  /** Pour les anciennes demandes intérim — null en recrutement. */
  hourlyRate: number | null;
  meals: number | null;
  bonuses: string | null;
  allowances: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  candidates: Candidate[];

  // Champs recrutement (CDD/CDI)
  requestType?: "recrutement" | "formation" | "accompagnement_rh";
  contractType?: string | null; // cdi, cdd, alternance, stage, freelance
  cddDurationMonths?: number | null;
  experienceLevel?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string | null; // 'annual' | 'monthly'
  variablePay?: string | null;
  benefits?: string | null;
  remoteWork?: string | null; // 'none' | 'hybrid' | 'full'
  trialPeriodMonths?: number | null;
  educationLevel?: string | null;
};

export type CandidateStatus = "pending" | "validated" | "refused";

export type Candidate = {
  id: string;
  fullName: string;
  headline: string; // "Chef de chantier — 8 ans d'expérience"
  experienceYears: number;
  status: CandidateStatus;
  cvUrl: string; // simulé pour le moment
};

export const DEMO_REQUESTS: InterimRequest[] = [
  {
    id: "REQ-2026-0142",
    clientId: "CLI-001",
    clientCompanyName: "Acme BTP",
    poste: "Plombier chauffagiste",
    headcount: 2,
    startDate: "2026-05-05",
    duration: "3 mois",
    location: "Six-Fours-les-Plages (83)",
    hourlyRate: 15.5,
    meals: 10.5,
    bonuses: "Prime de chantier 150€",
    allowances: "Indemnité déplacement",
    contactName: "Jean Martin",
    contactEmail: "j.martin@exemple.fr",
    contactPhone: "06 12 34 56 78",
    description:
      "Intervention sur chantier neuf, pose de réseaux sanitaires et chauffage. Permis B requis.",
    status: "proposed",
    createdAt: "2026-04-18T09:12:00Z",
    candidates: [
      {
        id: "C-001",
        fullName: "Karim B.",
        headline: "Plombier chauffagiste — 9 ans d'expérience",
        experienceYears: 9,
        status: "pending",
        cvUrl: "#",
      },
      {
        id: "C-002",
        fullName: "Olivier D.",
        headline: "Plombier chauffagiste — 6 ans d'expérience",
        experienceYears: 6,
        status: "pending",
        cvUrl: "#",
      },
    ],
  },
  {
    id: "REQ-2026-0138",
    clientId: "CLI-002",
    clientCompanyName: "Méditerranée Construction",
    poste: "Maçon coffreur",
    headcount: 1,
    startDate: "2026-04-28",
    duration: "6 semaines",
    location: "Toulon (83)",
    hourlyRate: 14.2,
    meals: 10.5,
    bonuses: null,
    allowances: "Indemnité trajet",
    contactName: "Sophie Durand",
    contactEmail: "s.durand@exemple.fr",
    contactPhone: "06 98 76 54 32",
    description: "Coffrage traditionnel, lecture de plans impérative.",
    status: "validated",
    createdAt: "2026-04-10T14:30:00Z",
    candidates: [
      {
        id: "C-003",
        fullName: "Ahmed R.",
        headline: "Maçon coffreur — 12 ans d'expérience",
        experienceYears: 12,
        status: "validated",
        cvUrl: "#",
      },
    ],
  },
  {
    id: "REQ-2026-0151",
    clientId: "CLI-001",
    clientCompanyName: "Acme BTP",
    poste: "Électricien bâtiment",
    headcount: 3,
    startDate: "2026-05-15",
    duration: "4 mois",
    location: "La Seyne-sur-Mer (83)",
    hourlyRate: 16.0,
    meals: 11,
    bonuses: "Prime de panier 8€",
    allowances: null,
    contactName: "Jean Martin",
    contactEmail: "j.martin@exemple.fr",
    contactPhone: "06 12 34 56 78",
    description:
      "Tirage de câbles, raccordements tableaux. Habilitation B1V requise.",
    status: "pending",
    createdAt: "2026-04-21T16:05:00Z",
    candidates: [],
  },
  {
    id: "REQ-2026-0129",
    clientId: "CLI-002",
    clientCompanyName: "Méditerranée Construction",
    poste: "Chef d'équipe second œuvre",
    headcount: 1,
    startDate: "2026-03-20",
    duration: "3 mois",
    location: "Marseille (13)",
    hourlyRate: 22.0,
    meals: 12,
    bonuses: "Prime de responsabilité 300€",
    allowances: "Véhicule fourni",
    contactName: "Sophie Durand",
    contactEmail: "s.durand@exemple.fr",
    contactPhone: "06 98 76 54 32",
    description: "Encadrement d'une équipe de 5 personnes sur site occupé.",
    status: "cancelled",
    createdAt: "2026-03-12T10:00:00Z",
    candidates: [],
  },
];

export const STATUS_META: Record<
  RequestStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "En attente",
    dot: "bg-accent-500",
    badge:
      "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200",
  },
  proposed: {
    label: "Candidats proposés",
    dot: "bg-primary-500",
    badge:
      "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200",
  },
  validated: {
    label: "Validée",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
  refused: {
    label: "Refusée",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  },
  cancelled: {
    label: "Annulée",
    dot: "bg-neutral-400",
    badge:
      "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200",
  },
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
