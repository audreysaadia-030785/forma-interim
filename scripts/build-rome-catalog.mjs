// Build ROME catalog from the France Travail "Arborescence principale" XLSX.
// Source: data.gouv.fr dataset "repertoire-operationnel-des-metiers-et-des-emplois-rome"
// resource "Les arborescences du ROME - Arborescence principale" (ROME 4.0, sept 2025)
//
// Sheet layout (sheet "Arbo Principale ..."):
//   outlineLevel 0 -> Grand domaine: A=letter, D=label
//   outlineLevel 1 -> Domaine pro:   A=letter, B=2-digit, D=label
//   outlineLevel 2 -> Fiche ROME:    A=letter, B=2-digit, C=2-digit, D=label  (code = A+B+C)
//   outlineLevel 3 -> Appellation (ignored here)

import fs from "node:fs";
import path from "node:path";

const XLSX_DIR = process.env.ROME_XLSX_DIR || "C:/Users/conta/AppData/Local/Temp/rome_xlsx";
const OUT_FILE = "C:/Users/conta/Documents/interim-app/lib/rome-catalog.ts";

// --- 1. Load shared strings ----------------------------------------------
const sharedStringsXml = fs.readFileSync(
  path.join(XLSX_DIR, "xl", "sharedStrings.xml"),
  "utf8",
);

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

const sharedStrings = [];
{
  const siRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
  const tRegex = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
  let m;
  while ((m = siRegex.exec(sharedStringsXml)) !== null) {
    let text = "";
    let tm;
    tRegex.lastIndex = 0;
    while ((tm = tRegex.exec(m[1])) !== null) {
      text += tm[1];
    }
    sharedStrings.push(decodeXmlEntities(text));
  }
}
console.log(`[info] sharedStrings loaded: ${sharedStrings.length}`);

// --- 2. Parse sheet rows -------------------------------------------------
const sheetXml = fs.readFileSync(
  path.join(XLSX_DIR, "xl", "worksheets", "sheet2.xml"),
  "utf8",
);

const rowRegex = /<row\b([^>]*)>([\s\S]*?)<\/row>/g;
const cellRegex = /<c\s+r="([A-Z]+)(\d+)"([^\/>]*)(?:\/>|>([\s\S]*?)<\/c>)/g;

function cellType(attrs) {
  const m = attrs.match(/t="([^"]+)"/);
  return m ? m[1] : "";
}

const rows = [];
let rm;
while ((rm = rowRegex.exec(sheetXml)) !== null) {
  const rowAttrs = rm[1];
  const rowBody = rm[2];
  const outlineMatch = rowAttrs.match(/outlineLevel="(\d+)"/);
  const outlineLevel = outlineMatch ? parseInt(outlineMatch[1], 10) : 0;

  const cells = {};
  let cm;
  cellRegex.lastIndex = 0;
  while ((cm = cellRegex.exec(rowBody)) !== null) {
    const col = cm[1];
    const attrs = cm[3];
    const body = cm[4] || "";
    const type = cellType(attrs);
    const vm = body.match(/<v>([^<]*)<\/v>/);
    let value = "";
    if (vm) {
      if (type === "s") value = sharedStrings[parseInt(vm[1], 10)] || "";
      else value = vm[1];
    }
    cells[col] = value.trim();
  }
  rows.push({ outlineLevel, cells });
}
console.log(`[info] rows parsed: ${rows.length}`);

// --- 3. Extract families and jobs ----------------------------------------
const families = {};
const jobs = [];

for (const { outlineLevel, cells } of rows) {
  if (outlineLevel === 0) {
    // Grand domaine: A = letter, D = label
    if (/^[A-Z]$/.test(cells.A) && cells.D) {
      families[cells.A] = cells.D;
    }
  } else if (outlineLevel === 2) {
    // Fiche ROME
    const letter = cells.A;
    const b = cells.B;
    const c = cells.C;
    const label = cells.D;
    if (/^[A-Z]$/.test(letter) && /^\d{2}$/.test(b) && /^\d{2}$/.test(c) && label) {
      const code = `${letter}${b}${c}`;
      jobs.push({
        code,
        label,
        family: letter,
        familyLabel: families[letter] || "",
      });
    }
  }
}

console.log(`[info] families: ${Object.keys(families).length}`);
console.log(`[info] raw jobs: ${jobs.length}`);

// --- 4. De-duplicate -----------------------------------------------------
const seenCodes = new Set();
const seenLabels = new Set();
const dedup = [];
for (const j of jobs) {
  if (seenCodes.has(j.code)) continue;
  if (seenLabels.has(j.label)) continue;
  seenCodes.add(j.code);
  seenLabels.add(j.label);
  if (!j.familyLabel && families[j.family]) j.familyLabel = families[j.family];
  dedup.push(j);
}
dedup.sort((x, y) => x.code.localeCompare(y.code));

console.log(`[info] dedup jobs: ${dedup.length}`);

if (dedup.length < 500) {
  console.error(`[error] too few jobs (${dedup.length}); aborting.`);
  process.exit(1);
}

// --- 5. Emit TypeScript --------------------------------------------------
const header = `// Auto-generated from the France Travail "Arborescence principale" ROME 4.0 XLSX
// (data.gouv.fr dataset "repertoire-operationnel-des-metiers-et-des-emplois-rome",
// resource ID 88342be1-06b8-4ab6-8ce9-83e117d21346, snapshot sept. 2025).
// Do not edit manually — regenerate via scripts/build-rome-catalog.mjs.

export type RomeJob = {
  code: string;
  label: string;
  family: string;
  familyLabel: string;
};

`;

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const familiesOrdered = Object.keys(families).sort();
let out = header;
out += `export const ROME_FAMILIES: Record<string, string> = {\n`;
for (const k of familiesOrdered) {
  out += `  ${k}: "${esc(families[k])}",\n`;
}
out += `};\n\n`;

out += `export const ROME_JOBS: RomeJob[] = [\n`;
for (const j of dedup) {
  out += `  { code: "${j.code}", label: "${esc(j.label)}", family: "${j.family}", familyLabel: "${esc(j.familyLabel)}" },\n`;
}
out += `];\n`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, out, "utf8");
console.log(`[ok] wrote ${OUT_FILE} (${dedup.length} jobs, ${familiesOrdered.length} families)`);
