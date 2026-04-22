// Système de scoring candidat <-> demande.
// Plus le score est élevé (0-100), plus le candidat est pertinent.

export type MatchInputRequest = {
  romeCode: string | null;
  habilitations: string[]; // habilitations requises (suggested + custom)
  location: string | null;
  startDate: string | null; // YYYY-MM-DD
  hourlyRateEur: number | null;
};

export type MatchInputCandidate = {
  id: string;
  primaryRomeCode: string | null;
  secondaryRomeCodes: string[];
  habilitations: string[];
  experienceYears: number | null;
  location: string | null;
  availableFrom: string | null;
  expectedHourlyRateMinEur: number | null;
  expectedHourlyRateMaxEur: number | null;
};

export type MatchResult = {
  candidateId: string;
  score: number; // 0-100
  breakdown: {
    romeMatch: "exact" | "family" | "secondary" | "none";
    habilitationsMatched: number;
    habilitationsTotal: number;
    availabilityOk: boolean;
    rateCompatible: boolean | null; // null si infos manquantes
    experienceBonus: number; // 0-10
  };
  reasons: string[];
};

export function matchCandidate(
  request: MatchInputRequest,
  candidate: MatchInputCandidate,
): MatchResult {
  const reasons: string[] = [];
  let score = 0;

  // ========== 1) Métier (ROME) — jusqu'à 40 points ==========
  let romeMatch: MatchResult["breakdown"]["romeMatch"] = "none";
  if (request.romeCode && candidate.primaryRomeCode) {
    if (request.romeCode === candidate.primaryRomeCode) {
      romeMatch = "exact";
      score += 40;
      reasons.push(`Métier principal identique (${request.romeCode})`);
    } else if (request.romeCode[0] === candidate.primaryRomeCode[0]) {
      // Même famille ROME (ex. F pour BTP).
      romeMatch = "family";
      score += 20;
      reasons.push(`Même famille métier (${request.romeCode[0]}…)`);
    } else if (candidate.secondaryRomeCodes.includes(request.romeCode)) {
      romeMatch = "secondary";
      score += 30;
      reasons.push(`Métier secondaire du candidat`);
    }
  }

  // ========== 2) Habilitations — jusqu'à 40 points ==========
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const candidateNormalized = candidate.habilitations.map(normalize);
  let habilitationsMatched = 0;
  for (const required of request.habilitations) {
    const normRequired = normalize(required);
    if (normRequired.length < 3) continue;
    const hit = candidateNormalized.some(
      (h) => h.includes(normRequired) || normRequired.includes(h),
    );
    if (hit) habilitationsMatched++;
  }
  const habilitationsTotal = request.habilitations.length;
  if (habilitationsTotal > 0) {
    const ratio = habilitationsMatched / habilitationsTotal;
    score += Math.round(ratio * 40);
    if (habilitationsMatched === habilitationsTotal) {
      reasons.push(`Toutes les habilitations requises (${habilitationsTotal})`);
    } else if (habilitationsMatched > 0) {
      reasons.push(
        `${habilitationsMatched}/${habilitationsTotal} habilitations détenues`,
      );
    } else {
      reasons.push(`Aucune habilitation requise détenue`);
    }
  }

  // ========== 3) Disponibilité — jusqu'à 10 points ==========
  let availabilityOk = true;
  if (request.startDate && candidate.availableFrom) {
    const start = new Date(request.startDate);
    const avail = new Date(candidate.availableFrom);
    if (avail <= start) {
      score += 10;
      reasons.push(`Disponible dès la date de démarrage`);
    } else {
      availabilityOk = false;
      const daysLate = Math.round(
        (avail.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      reasons.push(`Disponible ${daysLate} jour(s) après la date de démarrage`);
    }
  } else if (!candidate.availableFrom) {
    // Pas d'info — on part du principe qu'il est dispo, 5 pts de précaution.
    score += 5;
  }

  // ========== 4) Expérience — jusqu'à 10 points ==========
  let experienceBonus = 0;
  if (candidate.experienceYears !== null) {
    if (candidate.experienceYears >= 10) experienceBonus = 10;
    else if (candidate.experienceYears >= 5) experienceBonus = 7;
    else if (candidate.experienceYears >= 2) experienceBonus = 4;
    else experienceBonus = 2;
    score += experienceBonus;
    if (candidate.experienceYears >= 5) {
      reasons.push(`${candidate.experienceYears} ans d'expérience`);
    }
  }

  // ========== 5) Rémunération — information indicative ==========
  let rateCompatible: boolean | null = null;
  if (
    request.hourlyRateEur !== null &&
    candidate.expectedHourlyRateMinEur !== null
  ) {
    rateCompatible =
      request.hourlyRateEur >= candidate.expectedHourlyRateMinEur;
    if (!rateCompatible) {
      reasons.push(
        `Tarif demandé inférieur aux prétentions (${candidate.expectedHourlyRateMinEur} € min)`,
      );
    }
  }

  return {
    candidateId: candidate.id,
    score: Math.min(100, score),
    breakdown: {
      romeMatch,
      habilitationsMatched,
      habilitationsTotal,
      availabilityOk,
      rateCompatible,
      experienceBonus,
    },
    reasons,
  };
}

/** Trie des candidats par score décroissant et retourne les N meilleurs. */
export function rankCandidates(
  request: MatchInputRequest,
  candidates: MatchInputCandidate[],
): MatchResult[] {
  return candidates
    .map((c) => matchCandidate(request, c))
    .sort((a, b) => b.score - a.score);
}
