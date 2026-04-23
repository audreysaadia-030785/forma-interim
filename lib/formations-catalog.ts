// Auto-generated from ascv-conseils_Catalogue_Complet_124_Formations.docx

export type Formation = {
  id: string;        // slug court ex: "aipr-operateur"
  title: string;     // intitule exact
  category: string;  // grande thematique
  durationHint?: string; // ex: "1 jour" si l'info est trouvable
};

export const FORMATION_CATEGORIES: string[] = [
  "AIPR - Reseaux",
  "Bien-etre, QVT & Sante au travail",
  "CACES R482 - Engins de chantier",
  "CACES R483 - Grues mobiles",
  "CACES R484 - Ponts roulants et portiques",
  "CACES R485 - Gerbeurs a conducteur accompagnant",
  "CACES R486 - PEMP / Nacelles",
  "CACES R487 - Grues a tour",
  "CACES R489 - Chariots automoteurs a conducteur porte",
  "CACES R490 - Grues auxiliaires de chargement",
  "Communication & Relations professionnelles",
  "Coordination & Encadrement",
  "Developpement durable, RSE & Transition ecologique",
  "Elingage & Levage",
  "Formations Complementaires",
  "Intelligence Artificielle & Competences numeriques",
  "Management & Leadership",
  "Organisation, Efficacite personnelle & Gestion du temps",
  "RH, Droit du travail & Gestion d'entreprise",
  "Risque Chimique & Amiante",
  "Risque Electrique",
  "Risques Speciaux",
  "Sante & Securite Generale",
  "Travail en Hauteur",
];

export const FORMATIONS: Formation[] = [
  // AIPR - Reseaux
  { id: "aipr-concepteur", title: "AIPR Concepteur", category: "AIPR - Reseaux", durationHint: "QCM 60 questions" },
  { id: "aipr-encadrant", title: "AIPR Encadrant", category: "AIPR - Reseaux", durationHint: "QCM 60 questions" },
  { id: "aipr-operateur", title: "AIPR Operateur", category: "AIPR - Reseaux", durationHint: "QCM 60 questions" },

  // Bien-etre, QVT & Sante au travail
  { id: "qvt-nutrition-energie", title: "Nutrition, energie et hygiene de vie au travail", category: "Bien-etre, QVT & Sante au travail", durationHint: "1/2 jour" },
  { id: "qvt-premiers-secours-sante-mentale", title: "Premiers secours en sante mentale (PSSM)", category: "Bien-etre, QVT & Sante au travail", durationHint: "2 jours" },
  { id: "qvt-prevention-addictions", title: "Prevention des addictions en milieu professionnel", category: "Bien-etre, QVT & Sante au travail", durationHint: "1 jour" },
  { id: "qvt-qualite-vie-conditions-travail", title: "Qualite de Vie et Conditions de Travail (QVCT)", category: "Bien-etre, QVT & Sante au travail", durationHint: "1 jour" },
  { id: "qvt-sommeil-recuperation", title: "Sommeil, recuperation et performance au travail", category: "Bien-etre, QVT & Sante au travail", durationHint: "1/2 jour" },

  // CACES R482 - Engins de chantier
  { id: "caces-r482-a", title: "R482-A - Engins compacts moins de 6t", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-b1", title: "R482-B1 - Engins d'extraction sequentiels (pelles hydrauliques > 6t)", category: "CACES R482 - Engins de chantier", durationHint: "3-4 jours" },
  { id: "caces-r482-b2", title: "R482-B2 - Engins de sondage / forage", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-b3", title: "R482-B3 - Pelles hydrauliques rail-route", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-c1", title: "R482-C1 - Engins de chargement alternatif", category: "CACES R482 - Engins de chantier", durationHint: "3 jours" },
  { id: "caces-r482-c2", title: "R482-C2 - Engins de reglage alternatif", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-c3", title: "R482-C3 - Engins de nivellement", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-d", title: "R482-D - Engins de compactage", category: "CACES R482 - Engins de chantier", durationHint: "2 jours" },
  { id: "caces-r482-e", title: "R482-E - Engins de transport", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-f", title: "R482-F - Chariots tout-terrain (manitou)", category: "CACES R482 - Engins de chantier", durationHint: "2-3 jours" },
  { id: "caces-r482-g", title: "R482-G - Conduite hors production", category: "CACES R482 - Engins de chantier", durationHint: "1 jour" },

  // CACES R483 - Grues mobiles
  { id: "caces-r483-1", title: "R483-1 - Grues mobiles a fleche de treillis", category: "CACES R483 - Grues mobiles", durationHint: "3-5 jours" },
  { id: "caces-r483-2", title: "R483-2 - Grues mobiles a fleche telescopique", category: "CACES R483 - Grues mobiles", durationHint: "3-5 jours" },
  { id: "caces-r483-3", title: "R483-3 - Grues mobiles tout-terrain / chenilles", category: "CACES R483 - Grues mobiles", durationHint: "4-5 jours" },

  // CACES R484 - Ponts roulants et portiques
  { id: "caces-r484-1", title: "R484-1 - Ponts roulants / portiques commande au sol", category: "CACES R484 - Ponts roulants et portiques", durationHint: "2 jours" },
  { id: "caces-r484-2", title: "R484-2 - Ponts roulants commande en cabine", category: "CACES R484 - Ponts roulants et portiques", durationHint: "2-3 jours" },

  // CACES R485 - Gerbeurs a conducteur accompagnant
  { id: "caces-r485-1", title: "R485-1 - Gerbeurs 1,20m < h <= 2,50m", category: "CACES R485 - Gerbeurs a conducteur accompagnant", durationHint: "1 jour" },
  { id: "caces-r485-2", title: "R485-2 - Gerbeurs h > 2,50m", category: "CACES R485 - Gerbeurs a conducteur accompagnant", durationHint: "1 jour" },

  // CACES R486 - PEMP / Nacelles
  { id: "caces-r486-a", title: "R486-A - PEMP type 1 (deplacement chassis replie)", category: "CACES R486 - PEMP / Nacelles", durationHint: "1-2 jours" },
  { id: "caces-r486-b", title: "R486-B - PEMP type 2 (deplacement deploye sol)", category: "CACES R486 - PEMP / Nacelles", durationHint: "2-3 jours" },
  { id: "caces-r486-c", title: "R486-C - PEMP type 3 (deplacement deploye hauteur)", category: "CACES R486 - PEMP / Nacelles", durationHint: "2-3 jours" },

  // CACES R487 - Grues a tour
  { id: "caces-r487-1", title: "R487-1 - Grue a tour a montage automatise (GMA)", category: "CACES R487 - Grues a tour", durationHint: "4-5 jours" },
  { id: "caces-r487-2", title: "R487-2 - Grue a tour a fleche distributrice", category: "CACES R487 - Grues a tour", durationHint: "4-5 jours" },
  { id: "caces-r487-3", title: "R487-3 - Grue a tour a fleche relevable", category: "CACES R487 - Grues a tour", durationHint: "4-5 jours" },

  // CACES R489 - Chariots automoteurs a conducteur porte
  { id: "caces-r489-1a", title: "R489-1A - Transpalette conducteur porte + preparateur <=1,20m", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "1 jour" },
  { id: "caces-r489-1b", title: "R489-1B - Preparateur de commandes haute levee > 1,20m", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "1-2 jours" },
  { id: "caces-r489-2a", title: "R489-2A - Chariots tracteurs / pousseurs <= 25 kN", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "1 jour" },
  { id: "caces-r489-2b", title: "R489-2B - Chariots tracteurs / pousseurs > 25 kN", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "1-2 jours" },
  { id: "caces-r489-3", title: "R489-3 - Chariots elevateurs porte-a-faux <= 6t", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "2-3 jours" },
  { id: "caces-r489-4", title: "R489-4 - Chariots elevateurs porte-a-faux > 6t", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "2-3 jours" },
  { id: "caces-r489-5", title: "R489-5 - Chariots a mat retractable", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "2-3 jours" },
  { id: "caces-r489-6", title: "R489-6 - Chariots a poste de conduite elevable > 1,20m", category: "CACES R489 - Chariots automoteurs a conducteur porte", durationHint: "2 jours" },

  // CACES R490 - Grues auxiliaires de chargement
  { id: "caces-r490-pf", title: "R490-PF - Poste fixe", category: "CACES R490 - Grues auxiliaires de chargement", durationHint: "2-3 jours" },
  { id: "caces-r490-tc", title: "R490-TC - Option telecommande", category: "CACES R490 - Grues auxiliaires de chargement", durationHint: "+1/2 jour" },

  // Communication & Relations professionnelles
  { id: "comm-assertivite", title: "Assertivite - S'affirmer sans agressivite", category: "Communication & Relations professionnelles", durationHint: "1 jour" },
  { id: "comm-cnv", title: "Communication Non Violente (CNV) au travail", category: "Communication & Relations professionnelles", durationHint: "2 jours" },
  { id: "comm-communication-ecrite", title: "Communication professionnelle ecrite", category: "Communication & Relations professionnelles", durationHint: "1 jour" },
  { id: "comm-prise-parole-public", title: "Prise de parole en public - Convaincre et presenter", category: "Communication & Relations professionnelles", durationHint: "2 jours" },
  { id: "comm-relation-client", title: "Relation client - Accueil, satisfaction et fidelisation", category: "Communication & Relations professionnelles", durationHint: "1 jour" },
  { id: "comm-equipe-multiculturelle", title: "Travailler en equipe multiculturelle", category: "Communication & Relations professionnelles", durationHint: "1 jour" },

  // Coordination & Encadrement
  { id: "coord-sps-niveau-1", title: "Coordination SPS Niveau 1", category: "Coordination & Encadrement", durationHint: "4 jours + prerequis" },
  { id: "coord-sps-niveau-2", title: "Coordination SPS Niveau 2", category: "Coordination & Encadrement", durationHint: "4 jours" },
  { id: "coord-sps-niveau-3", title: "Coordination SPS Niveau 3", category: "Coordination & Encadrement", durationHint: "4 jours" },
  { id: "coord-ppsps", title: "PPSPS - Plan Particulier Securite et Protection de la Sante", category: "Coordination & Encadrement", durationHint: "1 jour" },
  { id: "coord-prevention-encadrement-chantier", title: "Prevention des risques pour l'encadrement de chantier", category: "Coordination & Encadrement", durationHint: "2 jours" },

  // Developpement durable, RSE & Transition ecologique
  { id: "dd-achats-responsables", title: "Achats responsables et economie circulaire", category: "Developpement durable, RSE & Transition ecologique", durationHint: "1 jour" },
  { id: "dd-eco-gestes-bureau", title: "Eco-gestes au bureau et en entreprise", category: "Developpement durable, RSE & Transition ecologique", durationHint: "1/2 jour" },
  { id: "dd-efficacite-energetique", title: "Efficacite energetique - Comprendre les enjeux", category: "Developpement durable, RSE & Transition ecologique", durationHint: "1 jour" },
  { id: "dd-fresque-climat", title: "Fresque du Climat - Comprendre le changement climatique", category: "Developpement durable, RSE & Transition ecologique", durationHint: "1/2 jour (atelier)" },
  { id: "dd-rse", title: "RSE - Responsabilite Societale des Entreprises", category: "Developpement durable, RSE & Transition ecologique", durationHint: "1 jour" },

  // Elingage & Levage
  { id: "elingage-chef-manoeuvre", title: "Chef de manoeuvre - Coordination des operations de levage", category: "Elingage & Levage", durationHint: "2 jours" },
  { id: "elingage-avec-pratique-chantier", title: "Elingage avec mise en pratique sur chantier", category: "Elingage & Levage", durationHint: "1 jour" },
  { id: "elingage-initiation", title: "Elingage et accessoires de levage - Initiation", category: "Elingage & Levage", durationHint: "1 jour" },
  { id: "elingage-pontier-elingueur", title: "Pontier-elingueur - Autorisation de conduite (R484)", category: "Elingage & Levage", durationHint: "2 jours" },
  { id: "elingage-verification-accessoires", title: "Verification des accessoires de levage", category: "Elingage & Levage", durationHint: "1 jour" },

  // Formations Complementaires
  { id: "compl-accident-travail", title: "Conduite a tenir en cas d'accident du travail", category: "Formations Complementaires", durationHint: "1/2 jour" },
  { id: "compl-duer", title: "Document Unique d'Evaluation des Risques (DUER)", category: "Formations Complementaires", durationHint: "1 jour" },
  { id: "compl-equipier-1ere-intervention", title: "Equipier de 1ere Intervention (EPI) - Incendie", category: "Formations Complementaires", durationHint: "1 jour" },
  { id: "compl-equipier-2eme-intervention", title: "Equipier de 2eme Intervention (ESI)", category: "Formations Complementaires", durationHint: "2 jours" },
  { id: "compl-prevention-rps", title: "Prevention des Risques Psychosociaux (RPS)", category: "Formations Complementaires", durationHint: "1 jour" },
  { id: "compl-prevention-tms", title: "Prevention des TMS (Troubles Musculo-Squelettiques)", category: "Formations Complementaires", durationHint: "1 jour" },
  { id: "compl-risques-routiers", title: "Risques routiers professionnels", category: "Formations Complementaires", durationHint: "1 jour" },
  { id: "compl-sensibilisation-coactivite", title: "Sensibilisation a la co-activite sur chantier", category: "Formations Complementaires", durationHint: "1/2 jour" },

  // Intelligence Artificielle & Competences numeriques
  { id: "num-cybersecurite", title: "Cybersecurite - Bons reflexes pour tous les salaries", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1/2 a 1 jour" },
  { id: "num-excel", title: "Excel - Initiation, perfectionnement et tableaux de bord", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1 a 3 jours" },
  { id: "num-chatgpt-claude", title: "Gagner du temps avec ChatGPT et Claude - Productivite au quotidien", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1 jour" },
  { id: "num-ia-ethique", title: "IA et ethique - Utiliser l'IA de facon responsable", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1/2 jour" },
  { id: "num-ia-au-travail", title: "L'IA au travail - Comprendre et utiliser sans jargon", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1/2 a 1 jour" },
  { id: "num-linkedin-personal-branding", title: "LinkedIn et personal branding - Valoriser son profil", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1 jour" },
  { id: "num-bureautique", title: "Maitriser la suite bureautique - Word, PowerPoint, Outlook", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1-2 jours" },
  { id: "num-travail-collaboratif", title: "Travail collaboratif a distance - Outils et bonnes pratiques", category: "Intelligence Artificielle & Competences numeriques", durationHint: "1 jour" },

  // Management & Leadership
  { id: "mgmt-animer-reunion", title: "Animer et faciliter une reunion efficace", category: "Management & Leadership", durationHint: "1 jour" },
  { id: "mgmt-entretiens-professionnels", title: "Conduire les entretiens professionnels", category: "Management & Leadership", durationHint: "1 jour" },
  { id: "mgmt-conduite-changement", title: "Conduite du changement - Accompagner les transformations", category: "Management & Leadership", durationHint: "2 jours" },
  { id: "mgmt-gestion-conflits", title: "Gestion des conflits et situations difficiles", category: "Management & Leadership", durationHint: "1 jour" },
  { id: "mgmt-leadership-intelligence-emotionnelle", title: "Leadership et intelligence emotionnelle", category: "Management & Leadership", durationHint: "2 jours" },
  { id: "mgmt-management-proximite", title: "Management de proximite - Animer et motiver une equipe", category: "Management & Leadership", durationHint: "1-2 jours" },
  { id: "mgmt-prise-poste", title: "Prise de poste - Reussir sa premiere mission d'encadrement", category: "Management & Leadership", durationHint: "2 jours" },

  // Organisation, Efficacite personnelle & Gestion du temps
  { id: "orga-gestion-projet-non-chefs", title: "Gestion de projet pour non-chefs de projet", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "2 jours" },
  { id: "orga-gestion-stress", title: "Gestion du stress et prevention de l'epuisement professionnel", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "1-2 jours" },
  { id: "orga-gestion-temps", title: "Gestion du temps et des priorites", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "1 jour" },
  { id: "orga-memoire-concentration", title: "Memoire, concentration et apprentissage efficace", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "1 jour" },
  { id: "orga-organisation-travail", title: "Organisation du travail et methodes de planification", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "1 jour" },
  { id: "orga-resolution-problemes", title: "Resolution de problemes et prise de decision", category: "Organisation, Efficacite personnelle & Gestion du temps", durationHint: "1 jour" },

  // RH, Droit du travail & Gestion d'entreprise
  { id: "rh-plan-formation-gepp", title: "Construire et piloter son plan de formation - GEPP", category: "RH, Droit du travail & Gestion d'entreprise", durationHint: "1 jour" },
  { id: "rh-droit-travail-encadrement", title: "Droit du travail - L'essentiel pour l'encadrement", category: "RH, Droit du travail & Gestion d'entreprise", durationHint: "1-2 jours" },
  { id: "rh-finance-non-financiers", title: "Finance pour non-financiers - Lire et comprendre les chiffres", category: "RH, Droit du travail & Gestion d'entreprise", durationHint: "1-2 jours" },
  { id: "rh-integration-onboarding", title: "Integration et fidelisation - Reussir l'onboarding", category: "RH, Droit du travail & Gestion d'entreprise", durationHint: "1 jour" },
  { id: "rh-prevenir-discriminations", title: "Prevenir les discriminations et promouvoir l'egalite", category: "RH, Droit du travail & Gestion d'entreprise", durationHint: "1 jour" },

  // Risque Chimique & Amiante
  { id: "chim-agents-cmr", title: "Agents CMR - Cancerogenes, Mutagenes, Toxiques", category: "Risque Chimique & Amiante", durationHint: "1/2 a 1 jour" },
  { id: "chim-amiante-ss3", title: "Amiante SS3 - Retrait et encapsulage", category: "Risque Chimique & Amiante", durationHint: "5 a 10 jours" },
  { id: "chim-amiante-ss4", title: "Amiante SS4 - Maintenance et interventions", category: "Risque Chimique & Amiante", durationHint: "2 a 5 jours" },
  { id: "chim-diisocyanates", title: "Diisocyanates - Utilisation sure", category: "Risque Chimique & Amiante", durationHint: "E-learning ou presentiel" },
  { id: "chim-prevention-risques-chimiques", title: "Prevention des risques chimiques (general)", category: "Risque Chimique & Amiante", durationHint: "1/2 a 1 jour" },

  // Risque Electrique
  { id: "elec-b0-h0", title: "Habilitation electrique B0/H0 - Non electricien", category: "Risque Electrique", durationHint: "1 jour" },
  { id: "elec-b1v-br-bc", title: "Habilitation electrique B1/B2/BR/BC - Basse tension", category: "Risque Electrique", durationHint: "2-3 jours" },
  { id: "elec-bs-be", title: "Habilitation electrique BS/BE - Interventions simples", category: "Risque Electrique", durationHint: "1-2 jours" },
  { id: "elec-h1-h2-hc", title: "Habilitation electrique H1/H2/HC - Haute tension", category: "Risque Electrique", durationHint: "3-5 jours" },
  { id: "elec-tst-installations", title: "Travaux sous tension (TST Installations)", category: "Risque Electrique", durationHint: "Organisme agree" },

  // Risques Speciaux
  { id: "spec-explosifs-btp", title: "Explosifs BTP - Stockage, transport, mise en oeuvre", category: "Risques Speciaux", durationHint: "A charge employeur" },
  { id: "spec-hyperbarie-seche-d", title: "Hyperbarie seche Mention D", category: "Risques Speciaux", durationHint: "4-5 jours / classe" },
  { id: "spec-hyperbares-mention-a", title: "Travaux hyperbares Mention A - Travaux (tunnels, caissons)", category: "Risques Speciaux", durationHint: "8 semaines cl.2" },
  { id: "spec-hyperbares-mention-b", title: "Travaux hyperbares Mention B - Plongee professionnelle", category: "Risques Speciaux", durationHint: "24h a 70h / classe" },

  // Sante & Securite Generale
  { id: "sst-epi-port", title: "EPI - Port et utilisation des equipements de protection individuelle", category: "Sante & Securite Generale", durationHint: "1 jour" },
  { id: "sst-formation-generale-securite", title: "Formation generale a la securite", category: "Sante & Securite Generale", durationHint: "1/2 a 1 jour" },
  { id: "sst-prap-gestes-postures", title: "PRAP - Gestes et postures / Manutentions manuelles", category: "Sante & Securite Generale", durationHint: "2 jours (14h)" },
  { id: "sst-prevention-bruit", title: "Prevention des risques lies au bruit", category: "Sante & Securite Generale", durationHint: "1 jour" },
  { id: "sst-prevention-vibrations", title: "Prevention des risques lies aux vibrations mecaniques", category: "Sante & Securite Generale", durationHint: "1 jour" },
  { id: "sst-sauveteur-secouriste-travail", title: "SST - Sauveteur Secouriste du Travail", category: "Sante & Securite Generale", durationHint: "2 jours (14h)" },

  // Travail en Hauteur
  { id: "hauteur-echafaudages-pied", title: "Montage / demontage echafaudages de pied", category: "Travail en Hauteur", durationHint: "1/2 a 1 jour" },
  { id: "hauteur-echafaudages-roulants", title: "Montage / demontage echafaudages roulants", category: "Travail en Hauteur", durationHint: "1/2 a 1 jour" },
  { id: "hauteur-harnais-epi-antichute", title: "Port du harnais et EPI antichute", category: "Travail en Hauteur", durationHint: "1 a 2 jours" },
  { id: "hauteur-prevention-chutes-toit", title: "Prevention des chutes de toit et toiture", category: "Travail en Hauteur", durationHint: "1 jour" },
  { id: "hauteur-travaux-cordes-cordiste", title: "Travaux sur cordes - Techniques cordiste", category: "Travail en Hauteur", durationHint: "Variable" },
  { id: "hauteur-utilisation-reception-echafaudages", title: "Utilisation et reception d'echafaudages", category: "Travail en Hauteur", durationHint: "1 jour" },
];
