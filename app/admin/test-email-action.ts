"use server";

import { Resend } from "resend";

// Regex stricte d'adresse email simple.
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

const ADMIN_FALLBACK = "contact.audreysaadia@gmail.com";
const FROM_FALLBACK = "ASCV CONSEILS <onboarding@resend.dev>";

// Extrait une adresse email propre de la valeur brute (ignore tout le bruit).
function extractTo(raw: string | undefined): { value: string; source: "env" | "fallback" } {
  if (!raw) return { value: ADMIN_FALLBACK, source: "fallback" };
  const match = raw.match(EMAIL_RE);
  return match ? { value: match[0], source: "env" } : { value: ADMIN_FALLBACK, source: "fallback" };
}

// Nettoie la valeur "from" : guillemets parasites, puis vérifie qu'on a un email.
function extractFrom(raw: string | undefined): { value: string; source: "env" | "fallback" } {
  if (!raw) return { value: FROM_FALLBACK, source: "fallback" };
  let v = raw.trim();
  while (/^[`'"]/.test(v)) v = v.slice(1);
  while (/[`'"]$/.test(v)) v = v.slice(0, -1);
  v = v.trim();
  if (!EMAIL_RE.test(v)) return { value: FROM_FALLBACK, source: "fallback" };
  return { value: v, source: "env" };
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

  const { value: from, source: fromSrc } = extractFrom(rawFrom);
  const { value: to, source: toSrc } = extractTo(rawTo);

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
        error: `${result.error.message} | FROM=[${preview(from)}] src=${fromSrc} len=${from.length} | TO=[${preview(to)}] src=${toSrc} len=${to.length} rawToLen=${rawTo?.length ?? 0}`,
      };
    }
    return {
      ok: true as const,
      id: result.data?.id,
      debug: `TO=${preview(to)} (${toSrc})`,
    };
  } catch (e) {
    return {
      ok: false as const,
      error: `${(e as Error).message} | FROM=[${preview(from)}] src=${fromSrc} | TO=[${preview(to)}] src=${toSrc}`,
    };
  }
}
