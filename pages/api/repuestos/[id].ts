import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (req.method === "PUT") {
    const { nombre, codigo, cantidadDisponible, descripcion } = req.body;

    try {
      const repuestoActualizado = await db.repuesto.update({
        where: { id: Number(id) },
        data: {
          nombre,
          codigo,
          cantidadDisponible: Number(cantidadDisponible),
          descripcion,
        }
      });
      return res.status(200).json(repuestoActualizado);
    } catch (err) {
      console.error("Error al actualizar repuesto:", err);
      return res.status(500).json({ message: "Error al actualizar repuesto" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await db.repuesto.delete({
        where: { id: Number(id) }
      });
      return res.status(204).end();
    } catch (err) {
      console.error("Error al eliminar repuesto:", err);
      return res.status(500).json({ message: "Error al eliminar repuesto" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
