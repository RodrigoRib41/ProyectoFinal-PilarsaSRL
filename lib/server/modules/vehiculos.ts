import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AppError } from "@/lib/core/api-errors";
import {
  LEGACY_YEAR_FIELD,
  getNumberishYear,
  writeLegacyYear,
} from "@/lib/core/legacy";
import {
  vehicleCreateSchema,
  vehicleUpdateSchema,
} from "@/lib/domain/schemas";
import { serializeVehiculo } from "@/lib/domain/serializers";

function normalizeVehiclePayload(input: unknown, partial = false) {
  if (typeof input !== "object" || input == null) {
    return partial ? vehicleUpdateSchema.parse(input) : vehicleCreateSchema.parse(input);
  }

  const parsedYear = getNumberishYear(input as Record<string, unknown>);
  const merged = {
    ...(input as Record<string, unknown>),
    ...(typeof parsedYear === "number" && !Number.isNaN(parsedYear)
      ? { anio: parsedYear }
      : {}),
  };

  return partial ? vehicleUpdateSchema.parse(merged) : vehicleCreateSchema.parse(merged);
}

export async function listVehiculos() {
  const vehiculos = await db.vehiculo.findMany({
    include: {
      services: true,
    },
    orderBy: [{ marca: "asc" }, { patente: "asc" }],
  });

  return vehiculos.map(serializeVehiculo);
}

export async function getVehiculoById(id: number) {
  const vehiculo = await db.vehiculo.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!vehiculo) {
    throw new AppError("No encontramos el vehiculo solicitado.", 404);
  }

  return serializeVehiculo(vehiculo);
}

export async function createVehiculo(input: unknown) {
  const normalized = normalizeVehiclePayload(input);
  if (typeof normalized.anio !== "number") {
    throw new AppError("El año del vehiculo es obligatorio.", 400);
  }

  try {
    const vehiculo = await db.vehiculo.create({
      data: writeLegacyYear(
        {
          patente: normalized.patente,
          marca: normalized.marca,
          version: normalized.version,
          kilometros: normalized.kilometros,
        },
        normalized.anio,
      ) as Prisma.VehiculoCreateInput,
    });

    return serializeVehiculo(vehiculo);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      throw new AppError("La patente ya esta registrada.", 409);
    }

    throw error;
  }
}

export async function updateVehiculo(id: number, input: unknown) {
  const normalized = normalizeVehiclePayload(input, true);

  const updateData = {
    ...(normalized.patente ? { patente: normalized.patente } : {}),
    ...(normalized.marca ? { marca: normalized.marca } : {}),
    ...(normalized.version ? { version: normalized.version } : {}),
    ...(typeof normalized.kilometros === "number"
      ? { kilometros: normalized.kilometros }
      : {}),
    ...(typeof normalized.anio === "number"
      ? { [LEGACY_YEAR_FIELD]: normalized.anio }
      : {}),
  } as Prisma.VehiculoUpdateInput;

  try {
    const vehiculo = await db.vehiculo.update({
      where: { id },
      data: updateData,
    });

    return serializeVehiculo(vehiculo);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El vehiculo que intentas actualizar no existe.", 404);
    }

    if (prismaError.code === "P2002") {
      throw new AppError("La patente ya esta registrada.", 409);
    }

    throw error;
  }
}

export async function deleteVehiculo(id: number) {
  const totalServices = await db.service.count({
    where: { vehiculoId: id },
  });

  if (totalServices > 0) {
    throw new AppError(
      "No se puede eliminar el vehiculo porque tiene servicios asociados.",
      409,
    );
  }

  try {
    await db.vehiculo.delete({
      where: { id },
    });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El vehiculo que intentas eliminar no existe.", 404);
    }

    throw error;
  }
}
