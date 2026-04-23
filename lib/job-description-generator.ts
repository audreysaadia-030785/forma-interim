// Génère automatiquement une description de poste structurée via Claude.
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la rédaction de fiches de poste pour un cabinet de recrutement professionnel français (ASCV CONSEILS).

Ta mission : générer une description de poste claire, structurée, professionnelle et attractive, à partir des informations fournies (intitulé, code ROME, type de contrat, niveau d'expérience).

Règles strictes :
- Réponds UNIQUEMENT avec le texte de la description, sans préambule, sans markdown, sans guillemets autour.
- Format avec ces 3 sections obligatoires (titres en MAJUSCULES, lignes vides entre sections) :
  MISSIONS PRINCIPALES
  • puce 1
  • puce 2
  ...

  PROFIL RECHERCHÉ
  • compétence/exigence 1
  • ...

  ENVIRONNEMENT & CADRE DE TRAVAIL
  • élément 1
  • ...
- 4 à 6 puces par section, concises (15-25 mots par puce).
- Adapté au niveau d'expérience indiqué (ex: pour un junior, ne pas demander 10 ans de management).
- Adapté au type de contrat (CDI = stabilité long terme, alternance = formation, etc.).
- Style français professionnel, neutre en genre, accessible.
- Ne pas inventer d'avantages spécifiques (le client les renseignera ailleurs).
- Ne pas mentionner de salaire (le client le renseigne ailleurs).
- Ne pas mentionner ASCV CONSEILS dans le texte.`;

const CONTRACT_HINTS: Record<string, string> = {
  cdi: "CDI (poste pérenne)",
  cdd: "CDD",
  alternance: "Alternance (apprentissage / professionnalisation)",
  stage: "Stage",
  freelance: "Freelance / mission",
};

const LEVEL_HINTS: Record<string, string> = {
  junior: "Junior (0 à 2 ans d'expérience)",
  confirme: "Confirmé (3 à 7 ans d'expérience)",
  senior: "Senior (8 à 15 ans d'expérience)",
  expert: "Expert (15+ ans d'expérience)",
};

export async function generateJobDescription(input: {
  jobLabel: string;
  jobCode?: string | null;
  contractType?: string | null;
  experienceLevel?: string | null;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY absent");

  const client = new Anthropic({ apiKey });

  const contract = input.contractType
    ? CONTRACT_HINTS[input.contractType] ?? input.contractType
    : "non précisé";
  const level = input.experienceLevel
    ? LEVEL_HINTS[input.experienceLevel] ?? input.experienceLevel
    : "non précisé";

  const userPrompt = `Génère la description complète pour ce poste :

Intitulé : ${input.jobLabel}${input.jobCode ? ` (code ROME ${input.jobCode})` : ""}
Type de contrat : ${contract}
Niveau d'expérience attendu : ${level}

Réponds avec uniquement le texte structuré, prêt à être collé dans un formulaire.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content.find((c) => c.type === "text");
  if (!block || block.type !== "text") throw new Error("Réponse Claude vide");
  return block.text.trim();
}
