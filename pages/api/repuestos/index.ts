import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const repuestos = await db.repuesto.findMany();
    return res.status(200).json(repuestos);
  }

  if (req.method === "POST") {
    const { nombre, codigo, cantidadDisponible, descripcion } = req.body;

    if (!nombre || !codigo || cantidadDisponible == null) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    try {
      const nuevoRepuesto = await db.repuesto.create({
        data: {
          nombre,
          codigo,
          cantidadDisponible: Number(cantidadDisponible),
          descripcion,
        }
      });
      return res.status(201).json(nuevoRepuesto);
    } catch (err) {
      console.error("Error al crear repuesto:", err);
      return res.status(500).json({ message: "Error al crear repuesto" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
