import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

// Función para actualizar services vencidos
const actualizarEstadosServices = async () => {
  await db.service.updateMany({
    where: {
      fechaHoraProgramada: { lte: new Date() },
      estado: "Pendiente"
    },
    data: { estado: "Realizado" }
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await actualizarEstadosServices() // Actualiza antes de consultar

    const services = await db.service.findMany({
      include: { vehiculo: true }
    })
    return res.status(200).json(services)
  }

  if (req.method === "POST") {
    const {
      vehiculoId,
      nombreCliente,
      telefonoCliente,
      domicilioCliente,
      descripcion,
      kilometros,
      fechaHoraProgramada
    } = req.body

    if (!fechaHoraProgramada) {
      return res.status(400).json({ message: "Falta la fecha y hora programada" })
    }

    const service = await db.service.create({
      data: {
        vehiculoId,
        nombreCliente,
        telefonoCliente,
        domicilioCliente,
        descripcion,
        kilometros,
        fechaHoraProgramada: new Date(fechaHoraProgramada)
      }
    })
    return res.status(201).json(service)
  }

  res.status(405).json({ message: "Método no permitido" })
}
