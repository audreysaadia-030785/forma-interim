// Parser de CV à base de Claude (Anthropic).
// Prend un PDF en entrée, retourne un objet candidat structuré.
import Anthropic from "@anthropic-ai/sdk";
import { ROME_JOBS } from "./rome-catalog";

export type ParsedCandidate = {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  headline: string | null;
  primaryRomeCode: string | null;
  primaryRomeLabel: string | null;
  secondaryRomeCodes: string[];
  experienceYears: number | null;
  experiences: Array<{
    title: string;
    company: string | null;
    startYear: number | null;
    endYear: number | null;
    description: string | null;
  }>;
  education: Array<{ degree: string; school: string | null; year: number | null }>;
  languages: Array<{ language: string; level: string | null }>;
  habilitations: string[];
  permis: string[];
  skills: string[];
};

const SYSTEM_PROMPT = `Tu es un assistant spécialisé en extraction d'informations de CV pour une agence d'intérim française. Tu reçois un CV au format PDF et tu retournes un objet JSON structuré.

Règles strictes :
- Sortie UNIQUEMENT en JSON valide, sans texte avant ou après, sans bloc \`\`\`.
- Respecte strictement le schéma fourni. Utilise null pour les champs absents.
- Pour les années d'expérience (experienceYears) : calcule la somme des années travaillées à partir des expériences listées. Si ambigu, estime prudemment.
- Pour le métier principal (primaryRomeCode / primaryRomeLabel) : choisis celui qui correspond au poste le plus récent. Le code ROME doit être de la forme "A1101" (une lettre + 4 chiffres).
- Pour les habilitations/formations (habilitations) : détecte tout ce qui ressemble à un CACES (R482, R483, R489…), habilitation électrique (B0, B1V, BR, BC, HE…), AIPR, SSIAP, HACCP, SST, permis spécifiques, etc. Formate exactement comme dans le CV.
- Pour les permis (permis) : permis B, C, CE, D, BE, etc. (uniquement permis de conduire).
- Pour les langues (languages) : [{ "language": "Anglais", "level": "B2" ou "courant" ou null }, ...]
- Pour les compétences techniques/soft (skills) : liste courte de 5-15 items pertinents.
- Pour le headline : une phrase courte type "Plombier chauffagiste — 8 ans d'expérience".
- Si le CV est manifestement illisible ou vide : renvoie un objet avec tous les champs à null ou vides.`;

const USER_PROMPT_TEMPLATE = (romeHints: string) => `Extrais les informations du CV ci-joint et retourne UNIQUEMENT ce JSON (sans \`\`\` ni autre texte) :

{
  "firstName": string,
  "lastName": string,
  "email": string | null,
  "phone": string | null,
  "location": string | null,
  "headline": string | null,
  "primaryRomeCode": string | null,
  "primaryRomeLabel": string | null,
  "secondaryRomeCodes": string[],
  "experienceYears": number | null,
  "experiences": [
    { "title": string, "company": string | null, "startYear": number | null, "endYear": number | null, "description": string | null }
  ],
  "education": [ { "degree": string, "school": string | null, "year": number | null } ],
  "languages": [ { "language": string, "level": string | null } ],
  "habilitations": string[],
  "permis": string[],
  "skills": string[]
}

Quelques codes ROME courants pour t'aider à choisir le bon métier principal :
${romeHints}`;

// Limite les hints à un sous-ensemble pour ne pas gonfler inutilement le prompt.
const FREQUENT_ROME_CODES = [
  "F1603", "I1308", "F1620", "F1602", "F1703", "F1606", "F1604", "F1607", "F1608", "F1610",
  "F1302", "F1201", "F1202", "N1103", "N4101", "N4105", "G1601", "G1602", "G1803",
  "J1501", "J1502", "K1302", "K1304", "K1303", "K2503", "K2204",
  "H2913", "H2911", "I1604", "I1309",
];

function buildRomeHints(): string {
  const lines: string[] = [];
  for (const code of FREQUENT_ROME_CODES) {
    const job = ROME_JOBS.find((j) => j.code === code);
    if (job) lines.push(`- ${job.code} : ${job.label}`);
  }
  return lines.join("\n");
}

export async function parseCvFromPdf(pdfBuffer: Buffer): Promise<ParsedCandidate> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY absent");

  const client = new Anthropic({ apiKey });

  const base64 = pdfBuffer.toString("base64");

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64,
            },
          },
          {
            type: "text",
            text: USER_PROMPT_TEMPLATE(buildRomeHints()),
          },
        ],
      },
    ],
  });

  // Extrait le texte (premier content text).
  const textBlock = response.content.find((c) => c.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse Claude vide");
  }

  const raw = textBlock.text.trim();
  // Nettoyage au cas où Claude mettrait des ```json malgré tout.
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: ParsedCandidate;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("[cv-parser] JSON parse failed, raw:", raw);
    throw new Error("Impossible de parser la réponse de Claude");
  }

  // Normalisation minimale.
  return {
    firstName: parsed.firstName ?? "",
    lastName: parsed.lastName ?? "",
    email: parsed.email ?? null,
    phone: parsed.phone ?? null,
    location: parsed.location ?? null,
    headline: parsed.headline ?? null,
    primaryRomeCode: parsed.primaryRomeCode ?? null,
    primaryRomeLabel: parsed.primaryRomeLabel ?? null,
    secondaryRomeCodes: parsed.secondaryRomeCodes ?? [],
    experienceYears: parsed.experienceYears ?? null,
    experiences: parsed.experiences ?? [],
    education: parsed.education ?? [],
    languages: parsed.languages ?? [],
    habilitations: parsed.habilitations ?? [],
    permis: parsed.permis ?? [],
    skills: parsed.skills ?? [],
  };
}
