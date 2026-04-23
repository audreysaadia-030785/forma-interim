"use server";

import { Resend } from "resend";

function cleanEnv(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  let v = val.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim();
  }
  return v || fallback;
}

export async function sendTestEmailAction() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = cleanEnv(
    process.env.EMAIL_FROM,
    "ASCV CONSEILS <onboarding@resend.dev>",
  );
  const to = cleanEnv(
    process.env.EMAIL_ADMIN,
    "contact.audreysaadia@gmail.com",
  );

  if (!apiKey) {
    return {
      ok: false as const,
      error: "RESEND_API_KEY absent dans les variables d'environnement Vercel",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject: "🧪 Test d'envoi — ASCV CONSEILS",
      html: `
        <div style="font-family:sans-serif;padding:24px;">
          <h1 style="color:#2c1f15;">Test d'envoi réussi</h1>
          <p style="color:#3f3f46;">
            Si tu reçois cet email, la plomberie email fonctionne parfaitement.
          </p>
          <p style="color:#71717a;font-size:12px;margin-top:24px;">
            Envoyé le ${new Date().toLocaleString("fr-FR")}<br>
            From: ${from}<br>
            To: ${to}
          </p>
        </div>
      `,
    });
    if (result.error) {
      return {
        ok: false as const,
        error: `Resend refuse l'envoi : ${result.error.message}`,
      };
    }
    return { ok: true as const, id: result.data?.id };
  } catch (e) {
    return {
      ok: false as const,
      error: `Exception : ${(e as Error).message}`,
    };
  }
}
