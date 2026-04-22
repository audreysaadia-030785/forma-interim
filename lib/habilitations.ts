/**
 * Suggestions d'habilitations/formations en fonction du libellé du poste.
 *
 * Approche : chaque règle définit une liste de mots-clés NORMALISÉS
 * (minuscules, sans accents). Si n'importe lequel apparaît dans le libellé
 * normalisé, la règle se déclenche et ses habilitations sont ajoutées.
 * Plusieurs règles peuvent se cumuler (union sans doublons).
 */

type Rule = {
  keywords: string[];
  habilitations: string[];
};

const RULES: Rule[] = [
  // =====================================================================
  // BTP — TRONC COMMUN (toutes spécialités chantier)
  // =====================================================================
  {
    keywords: [
      "chantier",
      "btp",
      "batiment",
      "gros oeuvre",
      "second oeuvre",
      "travaux publics",
      "macon",
      "coffr",
      "ferrail",
      "bardage",
      "etanch",
      "isolat",
      "ravale",
      "placo",
      "plaqui",
      "platri",
      "carrel",
      "couvr",
      "charpent",
      "menuis",
      "demoliss",
      "terrass",
      "genie civil",
      "voirie",
      "canalisation",
      "reseaux secs",
      "ravalement",
      "facade",
    ],
    habilitations: [
      "Permis B",
      "SST (Sauveteur Secouriste du Travail)",
      "Travail en hauteur",
      "Montage / utilisation d'échafaudages (R408)",
      "AIPR Exécutant",
      "Port des EPI (casque, chaussures, gants, lunettes)",
    ],
  },

  // =====================================================================
  // ÉLECTRICITÉ — bâtiment, industrie, tertiaire
  // =====================================================================
  {
    keywords: [
      "electric",
      "electrotech",
      "cabl",
      "cableur",
      "domotique",
      "photovolta",
      "courant faible",
      "courant fort",
      "irve",
      "bornes de recharge",
      "installation electrique",
    ],
    habilitations: [
      "Habilitation B0 / H0 (non électricien)",
      "Habilitation B1V / B2V (exécutant sous tension BT)",
      "Habilitation BR (chargé d'intervention BT)",
      "Habilitation BC (chargé de consignation)",
      "Habilitation BE Manœuvre",
      "Habilitation BE Essai / Vérification / Mesure",
      "Habilitation H1V / H2V (haute tension)",
      "AIPR Exécutant",
      "AIPR Encadrant",
      "Qualification IRVE (bornes de recharge)",
      "QualiPV (installation photovoltaïque)",
    ],
  },

  // =====================================================================
  // PLOMBERIE / CHAUFFAGE / CLIMATISATION / FROID
  // =====================================================================
  {
    keywords: [
      "plomb",
      "chauffag",
      "chauffagiste",
      "sanitaire",
      "climati",
      "frigori",
      "froid",
      "aeraulique",
      "pac",
      "pompe a chaleur",
      "installateur thermique",
    ],
    habilitations: [
      "PG (Professionnel du Gaz)",
      "PGN / PGR (Professionnel du Gaz Naturel / Réseau)",
      "Habilitation fluides frigorigènes catégorie I (F-Gas)",
      "Habilitation fluides frigorigènes catégorie II",
      "Brasage fort / soudobrasage",
      "QualiPAC (pompes à chaleur)",
      "QualiBois (bois énergie)",
    ],
  },

  // =====================================================================
  // SOUDURE / CHAUDRONNERIE / TUYAUTERIE
  // =====================================================================
  {
    keywords: [
      "soud",
      "soudeur",
      "soudage",
      "chaudronn",
      "tuyaut",
      "metallier",
      "metallurgie",
      "serrur",
      "tolier",
      "tolerie",
      "ferronn",
    ],
    habilitations: [
      "Licence soudage MIG / MAG (135 / 136)",
      "Licence soudage TIG (141)",
      "Licence soudage ARC électrode enrobée (111)",
      "Licence soudage oxyacétylénique (311)",
      "Qualification soudeur NF EN ISO 9606-1",
      "Soudure tuyauterie sous pression (DESP / CODAP)",
      "Lecture d'isométriques",
      "Travail en espace confiné (CATEC)",
      "Habilitation ATEX niveau 1 / 2",
    ],
  },

  // =====================================================================
  // COUVREUR / ZINGUEUR / ÉTANCHEUR — travail en hauteur
  // =====================================================================
  {
    keywords: ["couvr", "zinguerie", "zingueur", "couverture", "etancheur"],
    habilitations: [
      "Travail en hauteur — cordes et harnais",
      "Montage / réception d'échafaudages (R408)",
      "CACES R486 cat. A/B (nacelles)",
      "Amiante sous-section 4 (opérateur)",
      "Amiante sous-section 3 (encadrement)",
    ],
  },

  // =====================================================================
  // PEINTRE / PLAQUISTE / PLÂTRIER
  // =====================================================================
  {
    keywords: [
      "peintr",
      "peintre",
      "plaqui",
      "plaquiste",
      "platri",
      "platrier",
      "enduit",
    ],
    habilitations: [
      "Montage / utilisation échafaudages (R408)",
      "CACES R486 cat. A/B (nacelles)",
      "Amiante sous-section 4 (rénovation)",
      "Plomb sous-section 4",
    ],
  },

  // =====================================================================
  // CONDUITE D'ENGINS TP / CARISTE / LEVAGE / GRUE
  // =====================================================================
  {
    keywords: [
      "cariste",
      "manutention motorisee",
      "conducteur d'engin",
      "conductrice d'engin",
      "conducteur engin",
      "conducteur de pelle",
      "conducteur de grue",
      "grutier",
      "gruti",
      "levage",
      "chariot elevateur",
      "manutentionnaire",
      "engins de chantier",
      "engins de travaux publics",
      "engins tp",
    ],
    habilitations: [
      "CACES R482 cat. A (mini-engins de chantier)",
      "CACES R482 cat. B1 (pelle hydraulique)",
      "CACES R482 cat. B2 / B3 / C1 / C2 / C3",
      "CACES R482 cat. D / E / F / G (compacteur, tombereau, télescopique, transport)",
      "CACES R489 cat. 1A / 1B (transpalette accompagnant / porté)",
      "CACES R489 cat. 3 (chariot frontal)",
      "CACES R489 cat. 5 (chariot grande hauteur)",
      "CACES R485 cat. 1 / 2 (gerbeurs)",
      "CACES R484 cat. 1 (ponts roulants)",
      "CACES R486 cat. A (PEMP verticale)",
      "CACES R486 cat. B (PEMP multidirectionnelle)",
      "CACES R483 (grues mobiles)",
      "CACES R487 (grues à tour)",
      "CACES R490 (grues auxiliaires)",
      "AIPR Exécutant",
    ],
  },

  // =====================================================================
  // LOGISTIQUE / ENTREPÔT / PRÉPARATION DE COMMANDES
  // =====================================================================
  {
    keywords: [
      "magasin",
      "entrepot",
      "logisti",
      "stockage",
      "preparation de commande",
      "preparation commandes",
      "approvision",
      "reception marchandises",
      "expedition",
      "inventaire",
      "preparateur",
    ],
    habilitations: [
      "CACES R489 cat. 1A (transpalette accompagnant)",
      "CACES R489 cat. 3 (chariot frontal)",
      "CACES R489 cat. 5 (chariot grande hauteur)",
      "CACES R485 (gerbeurs)",
      "Port de charges (gestes et postures)",
      "Utilisation scanner / WMS",
    ],
  },

  // =====================================================================
  // TRANSPORT ROUTIER — marchandises
  // =====================================================================
  {
    keywords: [
      "chauffeur pl",
      "chauffeur spl",
      "conducteur routier",
      "conducteur pl",
      "conducteur spl",
      "transport routier",
      "poids lourd",
      "livreur",
      "coursier",
      "conducteur de camion",
      "routier",
    ],
    habilitations: [
      "Permis C (poids lourd)",
      "Permis CE (super poids lourd)",
      "Permis C1 / C1E (petit poids lourd)",
      "FIMO Marchandises",
      "FCO Marchandises (renouvellement 5 ans)",
      "ADR matières dangereuses (base, citerne, GPL…)",
      "Carte de qualification conducteur (CQC)",
      "Carte chronotachygraphe",
      "CACES R490 (grues auxiliaires de chargement)",
    ],
  },

  // =====================================================================
  // TRANSPORT DE VOYAGEURS / BUS / AUTOCAR
  // =====================================================================
  {
    keywords: [
      "conducteur de bus",
      "conducteur de car",
      "chauffeur de bus",
      "chauffeur de car",
      "autocar",
      "transport de personnes",
      "transport de voyageurs",
    ],
    habilitations: [
      "Permis D",
      "Permis D1",
      "FIMO Voyageurs",
      "FCO Voyageurs",
      "Carte de qualification conducteur (CQC)",
      "PSC1 ou AFGSU 1",
    ],
  },

  // =====================================================================
  // AMBULANCIER
  // =====================================================================
  {
    keywords: ["ambulancier", "ambulanciere", "ambulance"],
    habilitations: [
      "Diplôme d'État d'Ambulancier (DEA)",
      "Auxiliaire ambulancier (AA)",
      "Permis B (3 ans minimum)",
      "AFGSU niveau 2",
      "Attestation préfectorale d'aptitude à la conduite",
    ],
  },

  // =====================================================================
  // TAXI / VTC
  // =====================================================================
  {
    keywords: ["taxi", "vtc", "chauffeur prive"],
    habilitations: [
      "Carte professionnelle Taxi (préfecture)",
      "Carte professionnelle VTC",
      "Attestation préfectorale d'aptitude",
      "Permis B (3 ans minimum)",
      "PSC1",
    ],
  },

  // =====================================================================
  // INDUSTRIE / MAINTENANCE / PRODUCTION
  // =====================================================================
  {
    keywords: [
      "maintenance",
      "industriel",
      "industrie",
      "usine",
      "production industrielle",
      "usinage",
      "mecanicien industriel",
      "automatisme",
      "regleur",
      "operateur sur machine",
      "technicien de maintenance",
      "fraiseur",
      "tourneur",
      "ajusteur",
    ],
    habilitations: [
      "Habilitation électrique BS / BR",
      "Habilitation mécanique M0 / M2",
      "Consignation / déconsignation",
      "Pneumatique / hydraulique industrielle",
      "CACES R484 (ponts roulants)",
      "Travail en hauteur",
      "Habilitation ATEX 0 / 1 / 2",
    ],
  },

  // =====================================================================
  // NUCLÉAIRE / CHIMIE / PÉTROCHIMIE
  // =====================================================================
  {
    keywords: [
      "nucleaire",
      "centrale nucleaire",
      "radioactif",
      "radioprotection",
      "chimie",
      "chimique",
      "petrochimie",
      "raffinerie",
      "cosmetique",
      "pharmaceutique",
    ],
    habilitations: [
      "SCN 1 / 2 (Sûreté en Centrale Nucléaire)",
      "CSQ (Complément Sûreté Qualité)",
      "HN1 / HN2 (Habilitation Nucléaire)",
      "RP1 / RP2 (Radioprotection)",
      "PR1 / PR2 (Prévention des Risques)",
      "ATEX niveau 0 / 1 / 2",
      "GIES 1 / GIES 2 (sites chimiques)",
      "N1 / N2 (accès site industriel)",
      "CATEC (espaces confinés)",
    ],
  },

  // =====================================================================
  // AGROALIMENTAIRE / IAA
  // =====================================================================
  {
    keywords: [
      "agroalimentaire",
      "agro-alimentaire",
      "iaa",
      "agro industrie",
      "laitier",
      "fromag",
      "brasserie",
      "vinification",
      "embouteillage",
      "conserverie",
      "abattage",
      "abattoir",
      "boucher",
      "charcutier",
      "poissonnier",
      "boulanger",
      "patissier",
      "viennoiserie",
      "biscuit",
    ],
    habilitations: [
      "HACCP (hygiène alimentaire)",
      "BPF (Bonnes Pratiques de Fabrication)",
      "Formation allergènes",
      "Formation hygiène 14 heures",
      "Port de la tenue agroalimentaire",
    ],
  },

  // =====================================================================
  // CUISINE / RESTAURATION / HÔTELLERIE
  // =====================================================================
  {
    keywords: [
      "cuisinier",
      "cuisiniere",
      "cuisin",
      "commis",
      "chef de partie",
      "chef de cuisine",
      "patissier",
      "patisserie",
      "boulanger",
      "restaurat",
      "traiteur",
      "serveur",
      "serveuse",
      "barman",
      "barmaid",
      "sommelier",
      "maitre d'hotel",
      "chef de rang",
      "plongeur",
      "hotel",
      "hotelier",
      "hotesse d'accueil hotelier",
      "gouvernant",
      "chambre d'hotel",
      "reception hotel",
    ],
    habilitations: [
      "HACCP (hygiène alimentaire)",
      "Permis d'exploitation (débit de boissons)",
      "Formation allergènes",
      "Formation hygiène 14 heures",
      "CAP Cuisine / Restaurant (diplôme)",
      "Anglais niveau B1 minimum",
    ],
  },

  // =====================================================================
  // SANTÉ — infirmier, aide-soignant, paramédical
  // =====================================================================
  {
    keywords: [
      "infirmier",
      "infirmiere",
      "ide",
      "aide-soignant",
      "aide soignant",
      "auxiliaire de puericulture",
      "sage-femme",
      "sage femme",
      "kinesitherapeute",
      "kine",
      "psychomotricien",
      "ergotherapeute",
      "orthophoniste",
      "dentiste",
      "medecin",
      "pharmacien",
      "pediatre",
      "soins generaux",
      "reanimation",
    ],
    habilitations: [
      "Diplôme d'État (DE) correspondant à la profession",
      "Inscription à l'Ordre professionnel",
      "AFGSU niveau 2",
      "Vaccinations obligatoires à jour",
      "Formation bientraitance",
    ],
  },

  // =====================================================================
  // AIDE À LA PERSONNE / SERVICES À DOMICILE
  // =====================================================================
  {
    keywords: [
      "aide a domicile",
      "auxiliaire de vie",
      "advf",
      "accompagnant educatif et social",
      "aes",
      "aide menagere",
      "garde d'enfant",
      "services a la personne",
    ],
    habilitations: [
      "DEAES (Accompagnant Éducatif et Social)",
      "DEAVS (ancien AVS)",
      "Mention complémentaire Aide à domicile",
      "Permis B + véhicule personnel",
      "Gestes et postures / manutention de personnes",
      "PSC1 ou AFGSU 1",
      "Formation bientraitance",
    ],
  },

  // =====================================================================
  // SÉCURITÉ / GARDIENNAGE / INCENDIE
  // =====================================================================
  {
    keywords: [
      "agent de securite",
      "agente de securite",
      "agent de prevention",
      "agente de prevention",
      "agent de protection",
      "agente de protection",
      "securite privee",
      "securite incendie",
      "gardien",
      "gardienne",
      "maitre-chien",
      "maitre chien",
      "cynophile",
      "surveillance",
      "ssiap",
      "rondier",
      "rondiere",
      "vigile",
    ],
    habilitations: [
      "CQP APS (Agent de Prévention et de Sécurité)",
      "SSIAP 1 (agent service sécurité incendie)",
      "SSIAP 2 (chef d'équipe)",
      "SSIAP 3 (chef de service)",
      "Carte professionnelle CNAPS (obligatoire)",
      "CQP Agent cynophile (ACS)",
      "H0B0 (habilitation électrique)",
      "SST",
      "Permis B",
    ],
  },

  // =====================================================================
  // PROPRETÉ / NETTOYAGE
  // =====================================================================
  {
    keywords: [
      "nettoyage",
      "nettoyeur",
      "proprete",
      "agent d'entretien",
      "agent de service",
      "laveur de vitres",
      "vitrier",
      "hygiene des locaux",
    ],
    habilitations: [
      "CAP APH (Agent de Propreté et d'Hygiène)",
      "CQP Agent Machiniste Classique",
      "CQP Laveur de vitres (en hauteur)",
      "Travail en hauteur — cordes",
      "Utilisation autolaveuse / monobrosse",
      "Manipulation produits chimiques",
      "Port des EPI",
    ],
  },

  // =====================================================================
  // ESPACES VERTS / AGRICULTURE / FORÊT
  // =====================================================================
  {
    keywords: [
      "jardin",
      "espaces verts",
      "paysag",
      "horticul",
      "maraicher",
      "arboricul",
      "forest",
      "bucheron",
      "elagueur",
      "sylvic",
      "agricole",
      "agriculteur",
      "viticulteur",
      "viticole",
      "tractoriste",
    ],
    habilitations: [
      "Certiphyto (produits phytopharmaceutiques)",
      "CACES R482 cat. A (mini-pelle, compacteur)",
      "CACES R482 cat. E (tracteur agricole)",
      "Permis de conduire tronçonneuse",
      "CS Taille et soins aux arbres (élagage)",
      "Travail en hauteur / cordes (élagage)",
      "CAP / BP agricole",
      "Permis BE (remorque)",
    ],
  },

  // =====================================================================
  // VÉTÉRINAIRE / SOINS AUX ANIMAUX
  // =====================================================================
  {
    keywords: [
      "veterinaire",
      "toiletteur",
      "asv",
      "auxiliaire specialise veterinaire",
      "palefrenier",
      "soigneur animalier",
      "cynologie",
    ],
    habilitations: [
      "ACACED (Attestation Connaissance Animaux Compagnie)",
      "BPA / CAPA Soigneur d'équidés",
      "Titre professionnel ASV",
      "Formation manipulation animaux",
    ],
  },

  // =====================================================================
  // PETITE ENFANCE / ÉDUCATION
  // =====================================================================
  {
    keywords: [
      "petite enfance",
      "creche",
      "assistante maternelle",
      "atsem",
      "animateur enfance",
      "auxiliaire de puericulture",
      "eje",
      "educateur de jeunes enfants",
      "educatrice de jeunes enfants",
      "jeunes enfants",
      "puericultrice",
      "puericulteur",
    ],
    habilitations: [
      "CAP AEPE (Accompagnant Éducatif Petite Enfance)",
      "Agrément d'assistante maternelle (PMI)",
      "DEEJE (Éducateur de Jeunes Enfants)",
      "DEAP (Auxiliaire de Puériculture)",
      "ATSEM (concours)",
      "BAFA / BAFD",
      "PSC1 / AFGSU 1",
    ],
  },

  // =====================================================================
  // ANIMATION / SPORT / LOISIRS
  // =====================================================================
  {
    keywords: [
      "animateur",
      "animatrice",
      "moniteur",
      "monitrice",
      "educateur sportif",
      "sport",
      "fitness",
      "natation",
      "ski",
      "centre de loisirs",
      "bafa",
      "bafd",
      "maitre-nageur",
      "mns",
      "bnssa",
    ],
    habilitations: [
      "BAFA / BAFD",
      "BPJEPS (diplôme)",
      "DEJEPS / DESJEPS",
      "BNSSA (Sécurité et Sauvetage Aquatique)",
      "BEESAN / BPJEPS AAN (natation)",
      "PSC1 / PSE1",
      "Permis B",
    ],
  },

  // =====================================================================
  // ADMINISTRATIF / TERTIAIRE / SUPPORT
  // =====================================================================
  {
    keywords: [
      "secretaire",
      "assistant de direction",
      "assistante de direction",
      "comptable",
      "gestionnaire de paie",
      "controleur de gestion",
      "ressources humaines",
      "administratif",
      "standardiste",
      "hotesse d'accueil",
      "office manager",
    ],
    habilitations: [
      "Maîtrise du Pack Office (Excel, Word, Outlook)",
      "Logiciels métier (Sage, Cegid, EBP…)",
      "Orthographe et rédaction (certification Voltaire…)",
      "Anglais professionnel (B1 minimum)",
    ],
  },

  // =====================================================================
  // VENTE / COMMERCE / DISTRIBUTION
  // =====================================================================
  {
    keywords: [
      "vendeur",
      "vendeuse",
      "conseiller client",
      "commercial",
      "caissier",
      "caissiere",
      "hote de caisse",
      "employe libre service",
      "els",
      "chef de rayon",
      "merchandiser",
    ],
    habilitations: [
      "CAP Vente / Bac Pro Commerce (diplôme)",
      "Permis d'exploitation (si alcool)",
      "HACCP (produits frais)",
      "Anglais commercial",
    ],
  },

  // =====================================================================
  // INFORMATIQUE / NUMÉRIQUE
  // =====================================================================
  {
    keywords: [
      "informati",
      "developpeur",
      "developpeuse",
      "technicien informatique",
      "cybersecur",
      "administrateur reseau",
      "administrateur systeme",
      "devops",
      "data analyst",
      "data scientist",
      "webmaster",
      "ux designer",
      "ui designer",
      "integrateur web",
      "programmation",
    ],
    habilitations: [
      "Diplôme Bac+2 minimum (BTS SIO, DUT, DEUST…)",
      "Certifications techniques (Microsoft, Cisco CCNA, AWS, GCP…)",
      "ITIL Foundation",
      "Anglais technique (B2 minimum)",
    ],
  },

  // =====================================================================
  // ENCADREMENT / CONDUITE DE TRAVAUX
  // =====================================================================
  {
    keywords: [
      "chef de chantier",
      "chef d'equipe",
      "chef de projet",
      "conducteur de travaux",
      "maitre d'oeuvre",
      "responsable technique",
      "superviseur",
      "encadrant",
      "directeur",
    ],
    habilitations: [
      "AIPR Encadrant",
      "Habilitation électrique H0B0 ou H1V",
      "Formation management sécurité (PRAP, MAC SST)",
      "Lecture de plans avancée",
      "Formation gestion de projet",
      "Permis B",
    ],
  },
];

export type HabilitationsSuggestion = {
  habilitations: string[];
  /** Indique si au moins une règle spécifique a matché. */
  specific: boolean;
};

/** Minuscule + suppression des accents. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function suggestHabilitations(jobLabel: string): HabilitationsSuggestion {
  if (!jobLabel.trim()) return { habilitations: [], specific: false };
  const normalized = norm(jobLabel);

  const set = new Set<string>();
  let specific = false;

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      specific = true;
      rule.habilitations.forEach((h) => set.add(h));
    }
  }

  if (!specific) {
    // Socle ultra minimal si aucune correspondance.
    return {
      habilitations: ["Permis B", "SST (Sauveteur Secouriste du Travail)"],
      specific: false,
    };
  }

  return { habilitations: [...set], specific: true };
}
