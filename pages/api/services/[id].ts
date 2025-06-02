import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "PUT") {
    const {
      nombreCliente,
      telefonoCliente,
      domicilioCliente,
      descripcion,
      kilometros
      // Si querés permitir editar fechaHoraProgramada, lo agregás acá
    } = req.body

    try {
      const updatedService = await db.service.update({
        where: { id: Number(id) },
        data: {
          nombreCliente,
          telefonoCliente,
          domicilioCliente,
          descripcion,
          kilometros: Number(kilometros)
          // fechaHoraProgramada: new Date(fechaHoraProgramada)
        }
      })

      return res.status(200).json(updatedService)
    } catch (err) {
      console.error("Error al actualizar service", err)
      return res.status(500).json({ message: "Error al actualizar service" })
    }
  }

  res.status(405).json({ message: "Método no permitido" })
}
