import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

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
