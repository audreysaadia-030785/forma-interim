"use server";

import { Resend } from "resend";

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  let v = val.trim();
  // Retirer une paire de guillemets ou apostrophes qui entoure la valeur
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'")) ||
    (v.startsWith("`") && v.endsWith("`"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || fallback;
}

/** Aperçu "masqué" d'une chaîne pour debug (ne révèle pas tout l'email). */
function preview(s: string): string {
  if (!s) return "(vide)";
  return s
    .replace(/([a-zA-Z0-9._-]{3})[a-zA-Z0-9._-]*(@)/g, "$1***$2")
    .replace(/(@[a-zA-Z0-9._-]{2})[a-zA-Z0-9._-]*/g, "$1***");
}

export async function sendTestEmailAction() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const rawFrom = process.env.EMAIL_FROM;
  const rawTo = process.env.EMAIL_ADMIN;

  let from = cleanEnv(rawFrom, "ASCV CONSEILS <onboarding@resend.dev>");
  let to = cleanEnv(rawTo, "contact.audreysaadia@gmail.com");

  // Garde-fous : si les valeurs ressemblent à des adresses invalides,
  // on force les valeurs connues pour garantir un envoi réussi.
  if (!/@/.test(to) || /[`'"\s]$/.test(to) || /^[`'"]/.test(to)) {
    to = "contact.audreysaadia@gmail.com";
  }
  if (!/@/.test(from) || /[`'"\s]$/.test(from) || /^[`'"]/.test(from)) {
    from = "ASCV CONSEILS <onboarding@resend.dev>";
  }

  if (!apiKey) {
    return {
      ok: false as const,
      error: "RESEND_API_KEY absent",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject: "🧪 Test d'envoi — ASCV CONSEILS",
      html: `<div style="font-family:sans-serif;padding:24px;"><h1>Test réussi</h1><p>Si tu lis ça, c'est bon.</p></div>`,
    });
    if (result.error) {
      return {
        ok: false as const,
        error: `${result.error.message} | FROM=[${preview(from)}] len=${from.length} TO=[${preview(to)}] len=${to.length}`,
      };
    }
    return { ok: true as const, id: result.data?.id };
  } catch (e) {
    return {
      ok: false as const,
      error: `${(e as Error).message} | FROM=[${preview(from)}] TO=[${preview(to)}]`,
    };
  }
}
