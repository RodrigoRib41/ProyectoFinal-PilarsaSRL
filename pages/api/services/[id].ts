import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (req.method === "PUT") {
    const {
      nombreCliente,
      telefonoCliente,
      domicilioCliente,
      descripcion,
      kilometros
    } = req.body;

    try {
      const updatedService = await db.service.update({
        where: { id: Number(id) },
        data: {
          nombreCliente,
          telefonoCliente,
          domicilioCliente,
          descripcion,
          kilometros: Number(kilometros)
        }
      });

      return res.status(200).json(updatedService);
    } catch (err) {
      console.error("Error al actualizar service", err);
      return res.status(500).json({ message: "Error al actualizar service" });
    }
  }

  if (req.method === "DELETE") {
    try {
      // Elimina también los repuestos relacionados, si existen
      await db.servicioRepuesto.deleteMany({
        where: { serviceId: Number(id) }
      });

      await db.service.delete({
        where: { id: Number(id) }
      });

      return res.status(204).end();
    } catch (err) {
      console.error("Error al eliminar service", err);
      return res.status(500).json({ message: "Error al eliminar service" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
