// Auto-generated from ascv-conseils_Catalogue_Complet_124_Formations.docx

export type SuperCategory =
  | "Réglementaires"
  | "Sécurité & Prévention"
  | "Management & Soft skills"
  | "RH & Développement"
  | "Autre";

export type Formation = {
  id: string;
  title: string;
  category: string;
  superCategory: SuperCategory;
  hasRecyclage: boolean;
  durationHint?: string;
};

export const SUPER_CATEGORIES: SuperCategory[] = [
  "Réglementaires",
  "Sécurité & Prévention",
  "Management & Soft skills",
  "RH & Développement",
  "Autre",
];

export const FORMATION_CATEGORIES: string[] = [
  "AIPR - Réseaux",
  "Bien-être, QVT & Santé au travail",
  "CACES R482 - Engins de chantier",
  "CACES R483 - Grues mobiles",
  "CACES R484 - Ponts roulants et portiques",
  "CACES R485 - Gerbeurs à conducteur accompagnant",
  "CACES R486 - PEMP / Nacelles",
  "CACES R487 - Grues à tour",
  "CACES R489 - Chariots automoteurs à conducteur porté",
  "CACES R490 - Grues auxiliaires de chargement",
  "Communication & Relations professionnelles",
  "Coordination & Encadrement",
  "Développement durable, RSE & Transition écologique",
  "Élingage & Levage",
  "Formations Complémentaires",
  "Intelligence Artificielle & Compétences numériques",
  "Management & Leadership",
  "Organisation, Efficacité personnelle & Gestion du temps",
  "RH, Droit du travail & Gestion d'entreprise",
  "Risque Chimique & Amiante",
  "Risque Électrique",
  "Risques Spéciaux",
  "Santé & Sécurité Générale",
  "Travail en Hauteur",
];

export const FORMATIONS: Formation[] = [
  // Réglementaires - AIPR - Réseaux
  { id: "aipr-concepteur", title: "AIPR Concepteur", category: "AIPR - Réseaux", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "QCM 60 questions" },
  { id: "aipr-encadrant", title: "AIPR Encadrant", category: "AIPR - Réseaux", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "QCM 60 questions" },
  { id: "aipr-operateur", title: "AIPR Opérateur", category: "AIPR - Réseaux", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "QCM 60 questions" },

  // Réglementaires - CACES R482 - Engins de chantier
  { id: "caces-r482-a", title: "R482-A - Engins compacts moins de 6t", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-b1", title: "R482-B1 - Engins d'extraction séquentiels (pelles hydrauliques > 6t)", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "3-4 jours" },
  { id: "caces-r482-b2", title: "R482-B2 - Engins de sondage / forage", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-b3", title: "R482-B3 - Pelles hydrauliques rail-route", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-c1", title: "R482-C1 - Engins de chargement alternatif", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "3 jours" },
  { id: "caces-r482-c2", title: "R482-C2 - Engins de réglage alternatif", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-c3", title: "R482-C3 - Engins de nivellement", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-d", title: "R482-D - Engins de compactage", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2 jours" },
  { id: "caces-r482-e", title: "R482-E - Engins de transport", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-f", title: "R482-F - Chariots tout-terrain (manitou)", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r482-g", title: "R482-G - Conduite hors production", category: "CACES R482 - Engins de chantier", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },

  // Réglementaires - CACES R483 - Grues mobiles
  { id: "caces-r483-1", title: "R483-1 - Grues mobiles à flèche de treillis", category: "CACES R483 - Grues mobiles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "3-5 jours" },
  { id: "caces-r483-2", title: "R483-2 - Grues mobiles à flèche télescopique", category: "CACES R483 - Grues mobiles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "3-5 jours" },
  { id: "caces-r483-3", title: "R483-3 - Grues mobiles tout-terrain / chenilles", category: "CACES R483 - Grues mobiles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4-5 jours" },

  // Réglementaires - CACES R484 - Ponts roulants et portiques
  { id: "caces-r484-1", title: "R484-1 - Ponts roulants / portiques commande au sol", category: "CACES R484 - Ponts roulants et portiques", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2 jours" },
  { id: "caces-r484-2", title: "R484-2 - Ponts roulants commande en cabine", category: "CACES R484 - Ponts roulants et portiques", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },

  // Réglementaires - CACES R485 - Gerbeurs à conducteur accompagnant
  { id: "caces-r485-1", title: "R485-1 - Gerbeurs 1,20m < h <= 2,50m", category: "CACES R485 - Gerbeurs à conducteur accompagnant", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },
  { id: "caces-r485-2", title: "R485-2 - Gerbeurs h > 2,50m", category: "CACES R485 - Gerbeurs à conducteur accompagnant", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },

  // Réglementaires - CACES R486 - PEMP / Nacelles
  { id: "caces-r486-a", title: "R486-A - PEMP type 1 (déplacement châssis replié)", category: "CACES R486 - PEMP / Nacelles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1-2 jours" },
  { id: "caces-r486-b", title: "R486-B - PEMP type 2 (déplacement déployé sol)", category: "CACES R486 - PEMP / Nacelles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r486-c", title: "R486-C - PEMP type 3 (déplacement déployé hauteur)", category: "CACES R486 - PEMP / Nacelles", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },

  // Réglementaires - CACES R487 - Grues à tour
  { id: "caces-r487-1", title: "R487-1 - Grue à tour à montage automatisé (GMA)", category: "CACES R487 - Grues à tour", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4-5 jours" },
  { id: "caces-r487-2", title: "R487-2 - Grue à tour à flèche distributrice", category: "CACES R487 - Grues à tour", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4-5 jours" },
  { id: "caces-r487-3", title: "R487-3 - Grue à tour à flèche relevable", category: "CACES R487 - Grues à tour", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4-5 jours" },

  // Réglementaires - CACES R489 - Chariots automoteurs à conducteur porté
  { id: "caces-r489-1a", title: "R489-1A - Transpalette conducteur porté + préparateur <=1,20m", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },
  { id: "caces-r489-1b", title: "R489-1B - Préparateur de commandes haute levée > 1,20m", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1-2 jours" },
  { id: "caces-r489-2a", title: "R489-2A - Chariots tracteurs / pousseurs <= 25 kN", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },
  { id: "caces-r489-2b", title: "R489-2B - Chariots tracteurs / pousseurs > 25 kN", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1-2 jours" },
  { id: "caces-r489-3", title: "R489-3 - Chariots élévateurs porte-à-faux <= 6t", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r489-4", title: "R489-4 - Chariots élévateurs porte-à-faux > 6t", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r489-5", title: "R489-5 - Chariots à mât rétractable", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r489-6", title: "R489-6 - Chariots à poste de conduite élevable > 1,20m", category: "CACES R489 - Chariots automoteurs à conducteur porté", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2 jours" },

  // Réglementaires - CACES R490 - Grues auxiliaires de chargement
  { id: "caces-r490-pf", title: "R490-PF - Poste fixe", category: "CACES R490 - Grues auxiliaires de chargement", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "caces-r490-tc", title: "R490-TC - Option télécommande", category: "CACES R490 - Grues auxiliaires de chargement", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "+1/2 jour" },

  // Réglementaires - Coordination SPS
  { id: "coord-sps-niveau-1", title: "Coordination SPS Niveau 1", category: "Coordination & Encadrement", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4 jours + prérequis" },
  { id: "coord-sps-niveau-2", title: "Coordination SPS Niveau 2", category: "Coordination & Encadrement", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4 jours" },
  { id: "coord-sps-niveau-3", title: "Coordination SPS Niveau 3", category: "Coordination & Encadrement", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "4 jours" },

  // Réglementaires - Risque Chimique & Amiante
  { id: "chim-agents-cmr", title: "Agents CMR - Cancérogènes, Mutagènes, Toxiques", category: "Risque Chimique & Amiante", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1/2 à 1 jour" },
  { id: "chim-amiante-ss3", title: "Amiante SS3 - Retrait et encapsulage", category: "Risque Chimique & Amiante", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "5 à 10 jours" },
  { id: "chim-amiante-ss4", title: "Amiante SS4 - Maintenance et interventions", category: "Risque Chimique & Amiante", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2 à 5 jours" },
  { id: "chim-diisocyanates", title: "Diisocyanates - Utilisation sûre", category: "Risque Chimique & Amiante", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "E-learning ou présentiel" },
  { id: "chim-prevention-risques-chimiques", title: "Prévention des risques chimiques (général)", category: "Risque Chimique & Amiante", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1/2 à 1 jour" },

  // Réglementaires - Risque Électrique
  { id: "elec-b0-h0", title: "Habilitation électrique B0/H0 - Non électricien", category: "Risque Électrique", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1 jour" },
  { id: "elec-b1v-br-bc", title: "Habilitation électrique B1/B2/BR/BC - Basse tension", category: "Risque Électrique", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "2-3 jours" },
  { id: "elec-bs-be", title: "Habilitation électrique BS/BE - Interventions simples", category: "Risque Électrique", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "1-2 jours" },
  { id: "elec-h1-h2-hc", title: "Habilitation électrique H1/H2/HC - Haute tension", category: "Risque Électrique", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "3-5 jours" },
  { id: "elec-tst-installations", title: "Travaux sous tension (TST Installations)", category: "Risque Électrique", superCategory: "Réglementaires", hasRecyclage: true, durationHint: "Organisme agréé" },

  // Sécurité & Prévention - Coordination & Encadrement (hors SPS)
  { id: "coord-ppsps", title: "PPSPS - Plan Particulier Sécurité et Protection de la Santé", category: "Coordination & Encadrement", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "coord-prevention-encadrement-chantier", title: "Prévention des risques pour l'encadrement de chantier", category: "Coordination & Encadrement", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours" },

  // Sécurité & Prévention - Élingage & Levage
  { id: "elingage-chef-manoeuvre", title: "Chef de manœuvre - Coordination des opérations de levage", category: "Élingage & Levage", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours" },
  { id: "elingage-avec-pratique-chantier", title: "Élingage avec mise en pratique sur chantier", category: "Élingage & Levage", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "elingage-initiation", title: "Élingage et accessoires de levage - Initiation", category: "Élingage & Levage", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "elingage-pontier-elingueur", title: "Pontier-élingueur - Autorisation de conduite (R484)", category: "Élingage & Levage", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours" },
  { id: "elingage-verification-accessoires", title: "Vérification des accessoires de levage", category: "Élingage & Levage", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },

  // Sécurité & Prévention - Formations Complémentaires (santé/sécu)
  { id: "compl-accident-travail", title: "Conduite à tenir en cas d'accident du travail", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1/2 jour" },
  { id: "compl-duer", title: "Document Unique d'Évaluation des Risques (DUER)", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "compl-equipier-1ere-intervention", title: "Équipier de 1ère Intervention (EPI) - Incendie", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "compl-equipier-2eme-intervention", title: "Équipier de 2ème Intervention (ESI)", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours" },
  { id: "compl-prevention-rps", title: "Prévention des Risques Psychosociaux (RPS)", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "compl-prevention-tms", title: "Prévention des TMS (Troubles Musculo-Squelettiques)", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "compl-risques-routiers", title: "Risques routiers professionnels", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "compl-sensibilisation-coactivite", title: "Sensibilisation à la co-activité sur chantier", category: "Formations Complémentaires", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1/2 jour" },

  // Sécurité & Prévention - Risques Spéciaux
  { id: "spec-explosifs-btp", title: "Explosifs BTP - Stockage, transport, mise en œuvre", category: "Risques Spéciaux", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "À charge employeur" },
  { id: "spec-hyperbarie-seche-d", title: "Hyperbarie sèche Mention D", category: "Risques Spéciaux", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "4-5 jours / classe" },
  { id: "spec-hyperbares-mention-a", title: "Travaux hyperbares Mention A - Travaux (tunnels, caissons)", category: "Risques Spéciaux", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "8 semaines cl.2" },
  { id: "spec-hyperbares-mention-b", title: "Travaux hyperbares Mention B - Plongée professionnelle", category: "Risques Spéciaux", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "24h à 70h / classe" },

  // Sécurité & Prévention - Santé & Sécurité Générale
  { id: "sst-epi-port", title: "EPI - Port et utilisation des équipements de protection individuelle", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "sst-formation-generale-securite", title: "Formation générale à la sécurité", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1/2 à 1 jour" },
  { id: "sst-prap-gestes-postures", title: "PRAP - Gestes et postures / Manutentions manuelles", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours (14h)" },
  { id: "sst-prevention-bruit", title: "Prévention des risques liés au bruit", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "sst-prevention-vibrations", title: "Prévention des risques liés aux vibrations mécaniques", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "sst-sauveteur-secouriste-travail", title: "SST - Sauveteur Secouriste du Travail", category: "Santé & Sécurité Générale", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "2 jours (14h)" },

  // Sécurité & Prévention - Travail en Hauteur
  { id: "hauteur-echafaudages-pied", title: "Montage / démontage échafaudages de pied", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1/2 à 1 jour" },
  { id: "hauteur-echafaudages-roulants", title: "Montage / démontage échafaudages roulants", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1/2 à 1 jour" },
  { id: "hauteur-harnais-epi-antichute", title: "Port du harnais et EPI antichute", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 à 2 jours" },
  { id: "hauteur-prevention-chutes-toit", title: "Prévention des chutes de toit et toiture", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },
  { id: "hauteur-travaux-cordes-cordiste", title: "Travaux sur cordes - Techniques cordiste", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "Variable" },
  { id: "hauteur-utilisation-reception-echafaudages", title: "Utilisation et réception d'échafaudages", category: "Travail en Hauteur", superCategory: "Sécurité & Prévention", hasRecyclage: true, durationHint: "1 jour" },

  // Management & Soft skills - Communication & Relations professionnelles
  { id: "comm-assertivite", title: "Assertivité - S'affirmer sans agressivité", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "comm-cnv", title: "Communication Non Violente (CNV) au travail", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },
  { id: "comm-communication-ecrite", title: "Communication professionnelle écrite", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "comm-prise-parole-public", title: "Prise de parole en public - Convaincre et présenter", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },
  { id: "comm-relation-client", title: "Relation client - Accueil, satisfaction et fidélisation", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "comm-equipe-multiculturelle", title: "Travailler en équipe multiculturelle", category: "Communication & Relations professionnelles", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },

  // Management & Soft skills - Management & Leadership
  { id: "mgmt-animer-reunion", title: "Animer et faciliter une réunion efficace", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "mgmt-entretiens-professionnels", title: "Conduire les entretiens professionnels", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "mgmt-conduite-changement", title: "Conduite du changement - Accompagner les transformations", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },
  { id: "mgmt-gestion-conflits", title: "Gestion des conflits et situations difficiles", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "mgmt-leadership-intelligence-emotionnelle", title: "Leadership et intelligence émotionnelle", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },
  { id: "mgmt-management-proximite", title: "Management de proximité - Animer et motiver une équipe", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1-2 jours" },
  { id: "mgmt-prise-poste", title: "Prise de poste - Réussir sa première mission d'encadrement", category: "Management & Leadership", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },

  // Management & Soft skills - Organisation, Efficacité personnelle & Gestion du temps
  { id: "orga-gestion-projet-non-chefs", title: "Gestion de projet pour non-chefs de projet", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "2 jours" },
  { id: "orga-gestion-stress", title: "Gestion du stress et prévention de l'épuisement professionnel", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1-2 jours" },
  { id: "orga-gestion-temps", title: "Gestion du temps et des priorités", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "orga-memoire-concentration", title: "Mémoire, concentration et apprentissage efficace", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "orga-organisation-travail", title: "Organisation du travail et méthodes de planification", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },
  { id: "orga-resolution-problemes", title: "Résolution de problèmes et prise de décision", category: "Organisation, Efficacité personnelle & Gestion du temps", superCategory: "Management & Soft skills", hasRecyclage: false, durationHint: "1 jour" },

  // RH & Développement - Bien-être, QVT & Santé au travail
  { id: "qvt-nutrition-energie", title: "Nutrition, énergie et hygiène de vie au travail", category: "Bien-être, QVT & Santé au travail", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 jour" },
  { id: "qvt-premiers-secours-sante-mentale", title: "Premiers secours en santé mentale (PSSM)", category: "Bien-être, QVT & Santé au travail", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "2 jours" },
  { id: "qvt-prevention-addictions", title: "Prévention des addictions en milieu professionnel", category: "Bien-être, QVT & Santé au travail", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "qvt-qualite-vie-conditions-travail", title: "Qualité de Vie et Conditions de Travail (QVCT)", category: "Bien-être, QVT & Santé au travail", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "qvt-sommeil-recuperation", title: "Sommeil, récupération et performance au travail", category: "Bien-être, QVT & Santé au travail", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 jour" },

  // RH & Développement - Développement durable, RSE & Transition écologique
  { id: "dd-achats-responsables", title: "Achats responsables et économie circulaire", category: "Développement durable, RSE & Transition écologique", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "dd-eco-gestes-bureau", title: "Éco-gestes au bureau et en entreprise", category: "Développement durable, RSE & Transition écologique", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 jour" },
  { id: "dd-efficacite-energetique", title: "Efficacité énergétique - Comprendre les enjeux", category: "Développement durable, RSE & Transition écologique", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "dd-fresque-climat", title: "Fresque du Climat - Comprendre le changement climatique", category: "Développement durable, RSE & Transition écologique", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 jour (atelier)" },
  { id: "dd-rse", title: "RSE - Responsabilité Sociétale des Entreprises", category: "Développement durable, RSE & Transition écologique", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },

  // RH & Développement - Formations Complémentaires (hors santé/sécu) — aucune ici, toutes en Sécurité & Prévention

  // RH & Développement - Intelligence Artificielle & Compétences numériques
  { id: "num-cybersecurite", title: "Cybersécurité - Bons réflexes pour tous les salariés", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 à 1 jour" },
  { id: "num-excel", title: "Excel - Initiation, perfectionnement et tableaux de bord", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 à 3 jours" },
  { id: "num-chatgpt-claude", title: "Gagner du temps avec ChatGPT et Claude - Productivité au quotidien", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "num-ia-ethique", title: "IA et éthique - Utiliser l'IA de façon responsable", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 jour" },
  { id: "num-ia-au-travail", title: "L'IA au travail - Comprendre et utiliser sans jargon", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1/2 à 1 jour" },
  { id: "num-linkedin-personal-branding", title: "LinkedIn et personal branding - Valoriser son profil", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "num-bureautique", title: "Maîtriser la suite bureautique - Word, PowerPoint, Outlook", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1-2 jours" },
  { id: "num-travail-collaboratif", title: "Travail collaboratif à distance - Outils et bonnes pratiques", category: "Intelligence Artificielle & Compétences numériques", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },

  // RH & Développement - RH, Droit du travail & Gestion d'entreprise
  { id: "rh-plan-formation-gepp", title: "Construire et piloter son plan de formation - GEPP", category: "RH, Droit du travail & Gestion d'entreprise", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "rh-droit-travail-encadrement", title: "Droit du travail - L'essentiel pour l'encadrement", category: "RH, Droit du travail & Gestion d'entreprise", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1-2 jours" },
  { id: "rh-finance-non-financiers", title: "Finance pour non-financiers - Lire et comprendre les chiffres", category: "RH, Droit du travail & Gestion d'entreprise", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1-2 jours" },
  { id: "rh-integration-onboarding", title: "Intégration et fidélisation - Réussir l'onboarding", category: "RH, Droit du travail & Gestion d'entreprise", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
  { id: "rh-prevenir-discriminations", title: "Prévenir les discriminations et promouvoir l'égalité", category: "RH, Droit du travail & Gestion d'entreprise", superCategory: "RH & Développement", hasRecyclage: false, durationHint: "1 jour" },
];
