import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const vehiculos = await db.vehiculo.findMany()
    return res.status(200).json(vehiculos)
  }

  if (req.method === "POST") {
    const { patente, marca, version, año, kilometros } = req.body

    const vehiculo = await db.vehiculo.create({
      data: {
        patente,
        marca,
        version,
        año,
        kilometros
      }
    })
    return res.status(201).json(vehiculo)
  }

  res.status(405).json({ message: "Método no permitido" })
}
