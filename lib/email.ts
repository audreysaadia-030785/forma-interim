// Wrapper d'envoi d'emails via Resend.
// Les templates sont définis en dessous, un par événement métier.
import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY absent — envoi désactivé.");
    return null;
  }
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? "ASCV CONSEILS <onboarding@resend.dev>";
const ADMIN = process.env.EMAIL_ADMIN ?? "contact.audreysaadia@gmail.com";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://ascv-conseils.vercel.app";

async function send(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getResend();
  if (!resend) return { ok: false as const, error: "Service email non configuré" };

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    if (result.error) {
      console.error("[email] send failed:", result.error);
      return { ok: false as const, error: result.error.message };
    }
    return { ok: true as const, id: result.data?.id };
  } catch (e) {
    console.error("[email] unexpected:", e);
    return { ok: false as const, error: (e as Error).message };
  }
}

/* =========================================================================
 * Layout commun (en-tête, pied, couleurs ASCV CONSEILS)
 * ========================================================================= */

function layout({ title, content }: { title: string; content: string }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f8f4ed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;color:#2c1f15;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(44,31,21,0.08);overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#1a120b 0%,#3e2a1f 55%,#6b4f37 100%);padding:24px 32px;">
              <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.08em;">
                <span style="color:#ffffff;">ASCV</span>
                <span style="color:#c9a55e;">CONSEILS</span>
              </div>
              <div style="font-size:11px;font-style:italic;color:#ebe2d1;margin-top:2px;">Recruter avec stratégie, grandir avec excellence</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;text-align:center;">
              Cet email vous a été envoyé automatiquement par ASCV CONSEILS.<br>
              © ${new Date().getFullYear()} ASCV CONSEILS
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background:#c9a55e;border-radius:12px;">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">
          ${escapeHtml(label)} →
        </a>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================================
 * Templates
 * ========================================================================= */

/** Email envoyé au client lors de la création de son compte par l'admin. */
export async function sendClientWelcomeEmail(params: {
  to: string;
  companyName: string;
  primaryContactName: string;
  password: string;
}) {
  const loginUrl = APP_URL;
  const html = layout({
    title: "Bienvenue sur ASCV CONSEILS",
    content: `
      <h1 style="font-size:24px;font-weight:800;color:#2c1f15;margin:0 0 12px;">Bienvenue ${escapeHtml(params.primaryContactName)} 👋</h1>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        Votre compte entreprise <strong>${escapeHtml(params.companyName)}</strong> vient d'être créé sur la plateforme ASCV CONSEILS.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        Voici vos identifiants de connexion :
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:12px;padding:16px;margin:16px 0;width:100%;">
        <tr>
          <td style="font-size:12px;color:#71717a;padding:4px 12px;">Email</td>
          <td style="font-size:14px;font-weight:600;color:#2c1f15;padding:4px 12px;font-family:monospace;">${escapeHtml(params.to)}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:#71717a;padding:4px 12px;">Mot de passe initial</td>
          <td style="font-size:14px;font-weight:600;color:#2c1f15;padding:4px 12px;font-family:monospace;">${escapeHtml(params.password)}</td>
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.5;color:#71717a;margin:0 0 16px;">
        Nous vous recommandons de le changer dès votre première connexion.
      </p>
      ${button(loginUrl, "Accéder à la plateforme")}
      <p style="font-size:14px;line-height:1.6;color:#3f3f46;margin:16px 0 0;">
        Une fois connecté(e), vous pourrez saisir vos besoins en recrutement (CDD, CDI, missions) en quelques minutes — nous vous proposerons rapidement les meilleurs profils adaptés à vos enjeux stratégiques.
      </p>
    `,
  });

  return send({
    to: params.to,
    subject: "Bienvenue sur ASCV CONSEILS — Vos identifiants",
    html,
  });
}

/** Email à l'admin quand un client soumet une nouvelle demande. */
export async function sendNewRequestAdminEmail(params: {
  requestId: string;
  reference: string;
  clientCompanyName: string;
  jobLabel: string;
  headcount: number;
  startDate: string;
  location: string;
}) {
  const url = `${APP_URL}/admin/demande/${params.requestId}`;
  const html = layout({
    title: `Nouvelle demande — ${params.reference}`,
    content: `
      <h1 style="font-size:22px;font-weight:800;color:#2c1f15;margin:0 0 12px;">🆕 Nouvelle demande reçue</h1>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        <strong>${escapeHtml(params.clientCompanyName)}</strong> vient de déposer une nouvelle demande sur la plateforme.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:12px;padding:16px;margin:16px 0;width:100%;">
        <tr><td style="font-size:12px;color:#71717a;padding:4px 12px;">Référence</td><td style="font-size:14px;font-weight:600;font-family:monospace;padding:4px 12px;">${escapeHtml(params.reference)}</td></tr>
        <tr><td style="font-size:12px;color:#71717a;padding:4px 12px;">Poste</td><td style="font-size:14px;font-weight:600;padding:4px 12px;">${escapeHtml(params.jobLabel)}</td></tr>
        <tr><td style="font-size:12px;color:#71717a;padding:4px 12px;">Nombre</td><td style="font-size:14px;font-weight:600;padding:4px 12px;">${params.headcount}</td></tr>
        <tr><td style="font-size:12px;color:#71717a;padding:4px 12px;">Démarrage</td><td style="font-size:14px;font-weight:600;padding:4px 12px;">${escapeHtml(params.startDate)}</td></tr>
        <tr><td style="font-size:12px;color:#71717a;padding:4px 12px;">Lieu</td><td style="font-size:14px;font-weight:600;padding:4px 12px;">${escapeHtml(params.location)}</td></tr>
      </table>
      ${button(url, "Ouvrir la demande")}
    `,
  });

  return send({
    to: ADMIN,
    subject: `🆕 ${params.clientCompanyName} — ${params.jobLabel} (${params.reference})`,
    html,
  });
}

/** Email au client quand l'admin lui propose des candidats. */
export async function sendCandidatesProposedEmail(params: {
  to: string;
  requestId: string;
  reference: string;
  jobLabel: string;
  candidatesCount: number;
}) {
  const url = `${APP_URL}/client/demande/${params.requestId}`;
  const html = layout({
    title: "Candidats proposés pour votre demande",
    content: `
      <h1 style="font-size:22px;font-weight:800;color:#2c1f15;margin:0 0 12px;">✨ Vos candidats sont prêts !</h1>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        Nous avons sélectionné <strong>${params.candidatesCount} profil${params.candidatesCount > 1 ? "s" : ""}</strong> pour votre demande <strong>${escapeHtml(params.jobLabel)}</strong> (${escapeHtml(params.reference)}).
      </p>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        Connectez-vous à votre espace pour consulter leur CV et valider ou refuser chaque candidat.
      </p>
      ${button(url, "Voir les candidats proposés")}
    `,
  });

  return send({
    to: params.to,
    subject: `✨ ${params.candidatesCount} candidat${params.candidatesCount > 1 ? "s" : ""} prêt${params.candidatesCount > 1 ? "s" : ""} — ${params.jobLabel}`,
    html,
  });
}

/** Email à l'admin quand un client valide ou refuse un candidat. */
export async function sendProposalDecisionEmail(params: {
  requestId: string;
  reference: string;
  clientCompanyName: string;
  jobLabel: string;
  candidateName: string;
  decision: "validated" | "refused";
}) {
  const url = `${APP_URL}/admin/demande/${params.requestId}`;
  const ok = params.decision === "validated";
  const html = layout({
    title: ok ? "Candidat validé" : "Candidat refusé",
    content: `
      <h1 style="font-size:22px;font-weight:800;color:#2c1f15;margin:0 0 12px;">
        ${ok ? "✅" : "❌"} ${escapeHtml(params.clientCompanyName)} a ${ok ? "validé" : "refusé"} un candidat
      </h1>
      <p style="font-size:15px;line-height:1.6;color:#3f3f46;margin:0 0 16px;">
        <strong>${escapeHtml(params.candidateName)}</strong> a été ${ok ? "<strong style='color:#10b981'>validé</strong>" : "<strong style='color:#f43f5e'>refusé</strong>"} pour la mission <strong>${escapeHtml(params.jobLabel)}</strong> (${escapeHtml(params.reference)}).
      </p>
      ${button(url, "Voir la demande")}
    `,
  });

  return send({
    to: ADMIN,
    subject: `${ok ? "✅" : "❌"} ${params.clientCompanyName} — ${params.candidateName} (${params.reference})`,
    html,
  });
}
