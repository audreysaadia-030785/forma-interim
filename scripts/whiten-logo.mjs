// Remplace le fond gris du logo par du blanc.
// Usage: node scripts/whiten-logo.mjs
import { Jimp } from "jimp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "logo.png");
const DST = path.join(__dirname, "..", "public", "logo.png");

const image = await Jimp.read(SRC);

let swapped = 0;
image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];
  const a = this.bitmap.data[idx + 3];
  if (a === 0) return;
  // On cible les pixels gris : faible saturation + luminosité médiane.
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  if (saturation < 0.08 && r >= 40 && r <= 130) {
    // Interpolation vers blanc proportionnelle à la distance à #4A4A4A.
    this.bitmap.data[idx] = 255;
    this.bitmap.data[idx + 1] = 255;
    this.bitmap.data[idx + 2] = 255;
    swapped++;
  }
});

await image.write(DST);
console.log(`Done. Pixels blanchis: ${swapped.toLocaleString("fr-FR")}`);
