import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { motivo, nombre, apellido, email, telefono, mensaje } = req.body;

  try {
    await resend.emails.send({
      from: "Contacto Web <pilarsasrlrepuestos@resend.dev>",
      to: "pilarsasrlrepuestos@gmail.com",
      subject: `Nuevo contacto desde la web - Motivo: ${motivo}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return res.status(200).json({ message: "Email enviado" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return res.status(500).json({ message: "Error al enviar email" });
  }
}
