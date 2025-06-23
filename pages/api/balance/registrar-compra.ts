import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'ID inválido o faltante' });
    }

    try {
      const deleted = await db.balance.delete({
        where: {
          id: parseInt(id, 10),
        },
      });

      return res.status(200).json({ message: 'Registro eliminado del balance correctamente', deleted });
    } catch (err) {
      console.error('Error al eliminar el registro de balance:', err);
      return res.status(500).json({ message: 'Error interno al eliminar el registro' });
    }
  }

  if (req.method === 'POST') {
    const { marca, modelo, año, kilometros, precioCompra } = req.body;

    if (!marca || !modelo || !año || !kilometros || !precioCompra) {
      return res.status(400).json({ message: 'Faltan datos en la solicitud' });
    }

    try {
      const nuevaCompra = await db.balance.create({
        data: {
          tipo: 'EGRESO',
          monto: precioCompra,
          fecha: new Date(),
          marca,
          modelo,
          anio: año,
          kilometros,
        },
      });

      return res.status(200).json({ message: 'Compra registrada correctamente', nuevaCompra });
    } catch (err) {
      console.error('Error al registrar compra:', err);
      return res.status(500).json({ message: 'Error interno al registrar compra' });
    }
  }

  // Si no es ni DELETE ni POST
  res.setHeader('Allow', ['POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
