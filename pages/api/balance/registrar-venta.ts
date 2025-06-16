// pages/api/balance/registrar-venta.ts
import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método no permitido' });

  const { autoId, precioVenta } = req.body;

  if (!autoId || !precioVenta) {
    return res.status(400).json({ message: 'Faltan datos: autoId y precioVenta son requeridos' });
  }

  try {
    const auto = await db.auto.findUnique({ where: { id: autoId } });
    if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });

    await db.balance.create({
      data: {
        tipo: 'INGRESO',
        monto: precioVenta,
        fecha: new Date(),
        marca: auto.marca,
        modelo: auto.modelo,
        anio: auto.año,
        kilometros: auto.kilometros
      }
    });

    return res.status(200).json({ message: 'Venta registrada en el balance correctamente' });
  } catch (err) {
    console.error('Error al registrar la venta:', err);
    return res.status(500).json({ message: 'Error interno al registrar la venta' });
  }
}
