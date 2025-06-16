import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { desde, hasta } = req.query;

    const filtros: Prisma.BalanceWhereInput = {};

    if (desde || hasta) {
      filtros.fecha = {};

      if (desde) {
        filtros.fecha.gte = new Date(desde as string);
      }

      if (hasta) {
        const hastaDate = new Date(hasta as string);
        hastaDate.setHours(23, 59, 59, 999);
        filtros.fecha.lte = hastaDate;
      }
    }

    const registros = await db.balance.findMany({
      where: filtros,
      orderBy: { fecha: 'desc' },
    });

    return res.status(200).json(registros);
  } catch (err) {
    console.error('Error al obtener el listado de balance:', err);
    return res.status(500).json({ message: 'Error interno al obtener balance' });
  }
}
