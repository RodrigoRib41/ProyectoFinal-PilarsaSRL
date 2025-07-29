import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (req.method === "GET") {
    try {
      const vehiculo = await db.vehiculo.findUnique({
        where: { id: Number(id) },
        include: { services: true },
      });

      if (!vehiculo) {
        return res.status(404).json({ message: "Vehículo no encontrado" });
      }

      return res.status(200).json(vehiculo);
    } catch (error) {
      console.error("Error al obtener vehículo:", error);
      return res.status(500).json({ message: "Error interno al obtener el vehículo" });
    }
  }

  if (req.method === "PUT") {
    try {
      const data = req.body;

      const updatedVehiculo = await db.vehiculo.update({
        where: { id: Number(id) },
        data,
      });

      return res.status(200).json(updatedVehiculo);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        // Prisma lanza P2025 si no existe el registro a actualizar
        return res.status(404).json({ message: "Vehículo no encontrado para actualizar" });
      }
      console.error("Error al actualizar vehículo:", error);
      return res.status(500).json({ message: "Error interno al actualizar el vehículo" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const servicios = await db.service.count({
        where: { vehiculoId: Number(id) },
      });

      if (servicios > 0) {
        return res.status(400).json({
          message: "No se puede eliminar el vehículo porque tiene servicios asociados",
        });
      }

      await db.vehiculo.delete({
        where: { id: Number(id) },
      });

      return res.status(204).end();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return res.status(404).json({ message: "Vehículo no encontrado para eliminar" });
      }
      console.error("Error al eliminar vehículo:", error);
      return res.status(500).json({ message: "Error interno al eliminar el vehículo" });
    }
  }

  return res.status(405).json({ message: "Método no permitido" });
}
