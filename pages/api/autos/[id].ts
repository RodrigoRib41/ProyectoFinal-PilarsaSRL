import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { marca, modelo, año } = req.body;

        const autoActualizado = await db.auto.update({
          where: { id },
          data: { marca, modelo, año: Number(año) },
        });

        return res.status(200).json(autoActualizado);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el auto' });
      }

    case 'DELETE':
      try {
        await db.auto.delete({ where: { id } });
        return res.status(200).json({ message: 'Auto eliminado correctamente' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el auto' });
      }

    default:
      return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
