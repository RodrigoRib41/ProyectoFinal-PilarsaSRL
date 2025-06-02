import { NextApiRequest, NextApiResponse } from "next"
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const vehiculo = await db.vehiculo.findUnique({
      where: { id: Number(id) },
      include: { services: true }
    })
    return res.status(200).json(vehiculo)
  }

  if (req.method === "PUT") {
    const data = req.body

    const updatedVehiculo = await db.vehiculo.update({
      where: { id: Number(id) },
      data
    })
    return res.status(200).json(updatedVehiculo)
  }

  if (req.method === "DELETE") {
    await db.vehiculo.delete({
      where: { id: Number(id) }
    })
    return res.status(204).end()
  }

  res.status(405).json({ message: "Método no permitido" })
}
