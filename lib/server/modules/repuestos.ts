import { db } from "@/lib/db";
import { AppError } from "@/lib/core/api-errors";
import { repuestoCreateSchema, repuestoUpdateSchema } from "@/lib/domain/schemas";
import { serializeRepuesto } from "@/lib/domain/serializers";

export async function listRepuestos() {
  const repuestos = await db.repuesto.findMany({
    include: {
      servicios: true,
    },
    orderBy: [{ nombre: "asc" }],
  });

  return repuestos.map(serializeRepuesto);
}

export async function createRepuesto(input: unknown) {
  const data = repuestoCreateSchema.parse(input);

  try {
    const repuesto = await db.repuesto.create({
      data: {
        nombre: data.nombre,
        codigo: data.codigo,
        cantidadDisponible: data.cantidadDisponible,
        descripcion: data.descripcion ?? null,
      },
    });

    return serializeRepuesto(repuesto);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      throw new AppError("Ya existe un repuesto con ese codigo.", 409);
    }

    throw error;
  }
}

export async function updateRepuesto(id: number, input: unknown) {
  const data = repuestoUpdateSchema.parse(input);

  try {
    const repuesto = await db.repuesto.update({
      where: { id },
      data: {
        ...(data.nombre ? { nombre: data.nombre } : {}),
        ...(data.codigo ? { codigo: data.codigo } : {}),
        ...(typeof data.cantidadDisponible === "number"
          ? { cantidadDisponible: data.cantidadDisponible }
          : {}),
        ...(data.descripcion !== undefined ? { descripcion: data.descripcion ?? null } : {}),
      },
    });

    return serializeRepuesto(repuesto);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El repuesto solicitado no existe.", 404);
    }

    if (prismaError.code === "P2002") {
      throw new AppError("Ya existe un repuesto con ese codigo.", 409);
    }

    throw error;
  }
}

export async function deleteRepuesto(id: number) {
  const usages = await db.servicioRepuesto.count({
    where: { repuestoId: id },
  });

  if (usages > 0) {
    throw new AppError(
      "No se puede eliminar el repuesto porque ya fue utilizado en servicios.",
      409,
    );
  }

  try {
    await db.repuesto.delete({
      where: { id },
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El repuesto solicitado no existe.", 404);
    }

    throw error;
  }
}
