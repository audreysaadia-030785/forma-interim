// Transforme le logo ASCV :
//  - fond blanc → transparent
//  - tous les éléments (montagnes + texte) → or champagne #C9A55E,
//    en préservant les nuances de luminosité pour garder un effet
//    métallique / dégradé.
import { Jimp } from "jimp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "logo.original.png");
const DST = path.join(__dirname, "..", "public", "logo.png");

const GOLD = { r: 201, g: 165, b: 94 }; // #C9A55E

// Seuil considéré comme "blanc" → transparent.
const WHITE_THRESHOLD = 235;

const image = await Jimp.read(SRC);
let madeTransparent = 0;
let goldified = 0;

image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];
  const a = this.bitmap.data[idx + 3];

  if (a === 0) return;

  // Pixel quasi-blanc → transparence totale.
  if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
    this.bitmap.data[idx + 3] = 0;
    madeTransparent++;
    return;
  }

  // Sinon, remplacement par or, modulé par la luminosité d'origine
  // pour conserver l'effet métallique / dégradé du logo.
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  // luminance 0 = pixel sombre (texte) → or pur saturé
  // luminance 1 = pixel clair (montagne) → or éclairci
  const factor = 0.55 + luminance * 0.6; // entre 0.55 et 1.15
  this.bitmap.data[idx] = Math.min(255, Math.round(GOLD.r * factor));
  this.bitmap.data[idx + 1] = Math.min(255, Math.round(GOLD.g * factor));
  this.bitmap.data[idx + 2] = Math.min(255, Math.round(GOLD.b * factor));
  goldified++;
});

await image.write(DST);
console.log(
  `Done. Pixels transparents: ${madeTransparent.toLocaleString("fr-FR")}, dorés: ${goldified.toLocaleString("fr-FR")}`,
);
