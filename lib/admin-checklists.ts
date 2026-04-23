// Checklists de suivi admin par type de demande.
// Chaque étape a une clé stable, un libellé, et une phase.

export type ChecklistItem = {
  key: string;
  label: string;
  phase: string;
  /** Optionnel: si true, la case se coche automatiquement (ex. demande reçue). */
  auto?: boolean;
};

export type ChecklistState = Record<
  string,
  { done: boolean; done_at: string | null }
>;

export const FORMATION_CHECKLIST: ChecklistItem[] = [
  // Phase 1 — Préparation
  { key: "demande_recue", label: "Demande reçue", phase: "Préparation", auto: true },
  { key: "brief_analyse", label: "Brief / cahier des charges analysé", phase: "Préparation" },
  { key: "programme_envoye", label: "Programme envoyé au client", phase: "Préparation" },
  { key: "devis_envoye", label: "Devis envoyé (sous 48 h)", phase: "Préparation" },
  { key: "devis_accepte", label: "Devis validé par le client", phase: "Préparation" },
  { key: "convention_signee", label: "Convention de formation signée (reçue)", phase: "Préparation" },
  // Phase 2 — Planification
  { key: "dates_planifiees", label: "Dates planifiées avec le client", phase: "Planification" },
  { key: "formateur_confirme", label: "Formateur/trice confirmé(e)", phase: "Planification" },
  { key: "convocations_envoyees", label: "Convocations envoyées aux participants", phase: "Planification" },
  // Phase 3 — Réalisation
  { key: "formation_realisee", label: "Formation réalisée", phase: "Réalisation" },
  { key: "emargements_recus", label: "Feuilles d'émargement reçues", phase: "Réalisation" },
  { key: "attestations_envoyees", label: "Attestations de formation envoyées", phase: "Réalisation" },
  // Phase 4 — Clôture
  { key: "eval_chaud", label: "Évaluation à chaud reçue", phase: "Clôture" },
  { key: "eval_froid", label: "Évaluation à froid reçue", phase: "Clôture" },
  { key: "facturation", label: "Facturation effectuée", phase: "Clôture" },
  { key: "paiement_recu", label: "Paiement reçu", phase: "Clôture" },
  { key: "docs_archives", label: "Documents archivés (Qualiopi)", phase: "Clôture" },
];

export const RECRUTEMENT_CHECKLIST: ChecklistItem[] = [
  // Phase 1 — Analyse
  { key: "demande_recue", label: "Demande reçue", phase: "Analyse", auto: true },
  { key: "brief_rh_analyse", label: "Brief RH analysé", phase: "Analyse" },
  { key: "fiche_poste_validee", label: "Fiche de poste validée avec le client", phase: "Analyse" },
  { key: "devis_envoye", label: "Devis envoyé et signé", phase: "Analyse" },
  // Phase 2 — Sourcing
  { key: "sourcing_lance", label: "Sourcing lancé (CVthèque + chasse)", phase: "Sourcing" },
  { key: "candidats_preselectionnes", label: "Candidats présélectionnés", phase: "Sourcing" },
  { key: "candidats_proposes", label: "Candidats proposés au client", phase: "Sourcing" },
  // Phase 3 — Sélection
  { key: "entretiens_client", label: "Entretiens client réalisés", phase: "Sélection" },
  { key: "candidat_valide", label: "Candidat validé par le client", phase: "Sélection" },
  { key: "references_prises", label: "Prise de références", phase: "Sélection" },
  // Phase 4 — Embauche
  { key: "offre_envoyee", label: "Offre / promesse d'embauche envoyée", phase: "Embauche" },
  { key: "offre_acceptee", label: "Offre acceptée par le candidat", phase: "Embauche" },
  { key: "contrat_signe", label: "Contrat signé (reçu)", phase: "Embauche" },
  { key: "integration", label: "Intégration du salarié", phase: "Embauche" },
  // Phase 5 — Clôture
  { key: "facturation", label: "Facturation effectuée", phase: "Clôture" },
  { key: "paiement_recu", label: "Paiement reçu", phase: "Clôture" },
  { key: "garantie_suivi", label: "Suivi période de garantie", phase: "Clôture" },
  { key: "docs_archives", label: "Documents archivés", phase: "Clôture" },
];

export const RH_CHECKLIST: ChecklistItem[] = [
  { key: "demande_recue", label: "Demande reçue", phase: "Cadrage", auto: true },
  { key: "premier_rdv", label: "Premier RDV / diagnostic réalisé", phase: "Cadrage" },
  { key: "contexte_compris", label: "Contexte & enjeux compris", phase: "Cadrage" },
  { key: "proposition_envoyee", label: "Proposition / devis envoyé", phase: "Cadrage" },
  { key: "devis_accepte", label: "Devis validé", phase: "Cadrage" },
  { key: "mission_demarree", label: "Mission démarrée", phase: "Réalisation" },
  { key: "livrable_interim", label: "Livrable intermédiaire validé", phase: "Réalisation" },
  { key: "livrable_final", label: "Livrable final envoyé", phase: "Réalisation" },
  { key: "restitution", label: "Restitution réalisée", phase: "Clôture" },
  { key: "facturation", label: "Facturation effectuée", phase: "Clôture" },
  { key: "paiement_recu", label: "Paiement reçu", phase: "Clôture" },
  { key: "docs_archives", label: "Documents archivés", phase: "Clôture" },
];

export function checklistFor(requestType: string): ChecklistItem[] {
  switch (requestType) {
    case "formation":
      return FORMATION_CHECKLIST;
    case "accompagnement_rh":
      return RH_CHECKLIST;
    case "recrutement":
    default:
      return RECRUTEMENT_CHECKLIST;
  }
}

/**
 * Calcule la progression d'une checklist.
 * Retourne { done, total, percent }.
 */
export function progressFor(
  requestType: string,
  state: ChecklistState | null | undefined,
): { done: number; total: number; percent: number } {
  const items = checklistFor(requestType);
  const total = items.length;
  let done = 0;
  for (const item of items) {
    if (state?.[item.key]?.done) done++;
  }
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
