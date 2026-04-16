import { type NextApiRequest } from "next";
import { Resend } from "resend";
import { AppError } from "@/lib/core/api-errors";
import { env, hasResendConfig } from "@/lib/core/env";
import { createApiHandler, parseBody, sendSuccess } from "@/lib/core/http";
import { contactSchema } from "@/lib/domain/schemas";

const resend = hasResendConfig() ? new Resend(env.RESEND_API_KEY) : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendContactEmail(req: NextApiRequest) {
  if (!resend) {
    throw new AppError(
      "Resend no esta configurado. Revisa RESEND_API_KEY antes de enviar mensajes.",
      500,
    );
  }

  const data = parseBody(contactSchema, req);
  const isTestDrive = data.motivo === "TestDrive";
  const subject = isTestDrive
    ? `Solicitud de test drive - ${data.modeloAuto ?? ""}`
    : `Nuevo contacto desde la web - ${data.motivo}`;
  const html = isTestDrive
    ? `
      <h2>Nueva solicitud de test drive</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(data.telefono)}</p>
      <p><strong>Modelo solicitado:</strong> ${escapeHtml(data.modeloAuto ?? "")}</p>
      <p><strong>Comentarios:</strong></p>
      <p>${escapeHtml(data.mensaje || "Sin comentarios adicionales.")}</p>
    `
    : `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(data.nombre)} ${escapeHtml(data.apellido ?? "")}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(data.telefono)}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(data.motivo)}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${escapeHtml(data.mensaje ?? "")}</p>
    `;

  await resend.emails.send({
    from: "Pilarsa Web <pilarsasrlrepuestos@resend.dev>",
    to: "pilarsasrlrepuestos@gmail.com",
    subject,
    html,
  });
}

export default createApiHandler({
  async POST(req, res) {
    await sendContactEmail(req);
    return sendSuccess(res, { sent: true });
  },
});
