import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

// Actualiza automáticamente los services vencidos
const actualizarEstadosServices = async () => {
  await db.service.updateMany({
    where: {
      fechaHoraProgramada: { lte: new Date() },
      estado: "Pendiente"
    },
    data: { estado: "Realizado" }
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await actualizarEstadosServices();

    const services = await db.service.findMany({
      include: {
        vehiculo: true,
        repuestosUsados: {
          include: { repuesto: true }
        }
      }
    });

    return res.status(200).json(services);
  }

  if (req.method === "POST") {
    const {
      vehiculoId,
      nombreCliente,
      telefonoCliente,
      domicilioCliente,
      descripcion,
      kilometros,
      fechaHoraProgramada,
      repuestosUsados // array: [{ repuestoId, cantidad }]
    } = req.body;

    if (!fechaHoraProgramada) {
      return res.status(400).json({ message: "Falta la fecha y hora programada" });
    }

    try {
      // 1. Crear el service
      const service = await db.service.create({
        data: {
          vehiculoId,
          nombreCliente,
          telefonoCliente,
          domicilioCliente,
          descripcion,
          kilometros,
          fechaHoraProgramada: new Date(fechaHoraProgramada),
        }
      });

      // 2. Si hay repuestos, validar y registrar
      if (repuestosUsados && Array.isArray(repuestosUsados) && repuestosUsados.length > 0) {
        for (const { repuestoId, cantidad } of repuestosUsados) {
          const repuesto = await db.repuesto.findUnique({ where: { id: repuestoId } });

          if (!repuesto || repuesto.cantidadDisponible < cantidad) {
            return res.status(400).json({
              message: `Stock insuficiente para repuesto "${repuesto?.nombre || repuestoId}".`
            });
          }

          // Descontar del stock
          await db.repuesto.update({
            where: { id: repuestoId },
            data: { cantidadDisponible: repuesto.cantidadDisponible - cantidad }
          });

          // Registrar uso en tabla intermedia
          await db.servicioRepuesto.create({
            data: {
              serviceId: service.id,
              repuestoId,
              cantidad
            }
          });
        }
      }

      return res.status(201).json(service);
    } catch (err) {
      console.error("Error al crear service:", err);
      return res.status(500).json({ message: "Error al crear service" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
