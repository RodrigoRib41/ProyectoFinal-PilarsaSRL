import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const vehiculos = await db.vehiculo.findMany()
      return res.status(200).json(vehiculos)
    } catch (err) {
      console.error("Error al obtener vehículos:", err)
      return res.status(500).json({ message: "Error al obtener vehículos" })
    }
  }

  if (req.method === "POST") {
    const { patente, marca, version, año, kilometros } = req.body

    try {
      const vehiculo = await db.vehiculo.create({
        data: { patente, marca, version, año, kilometros }
      })
      return res.status(201).json(vehiculo)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({ message: "La patente ya está registrada en la base de datos." })
      }
      console.error("Error al crear vehículo:", err)
      return res.status(500).json({ message: "Error interno al crear el vehículo." })
    }
  }

  return res.status(405).json({ message: "Método no permitido" })
}
