import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const autos = await db.auto.findMany({
      select: {
        id: true,
        marca: true,
        modelo: true,
        año: true,
        kilometros: true,
        precio: true,
      },
    });

    return res.status(200).json(autos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener autos' });
  }
}
