import { db } from "@/lib/db";
import { AppError } from "@/lib/core/api-errors";
import { serviceCreateSchema, serviceUpdateSchema } from "@/lib/domain/schemas";
import { serializeService } from "@/lib/domain/serializers";

async function syncExpiredServices() {
  await db.service.updateMany({
    where: {
      fechaHoraProgramada: { lte: new Date() },
      estado: "Pendiente",
    },
    data: {
      estado: "Realizado",
    },
  });
}

export async function listServices() {
  await syncExpiredServices();

  const services = await db.service.findMany({
    include: {
      vehiculo: true,
      repuestosUsados: {
        include: {
          repuesto: true,
        },
      },
    },
    orderBy: [{ fechaHoraProgramada: "desc" }],
  });

  return services.map(serializeService);
}

export async function createService(input: unknown) {
  const data = serviceCreateSchema.parse(input);

  const vehiculo = await db.vehiculo.findUnique({
    where: { id: data.vehiculoId },
  });

  if (!vehiculo) {
    throw new AppError("El vehiculo seleccionado no existe.", 404);
  }

  const repuestos = data.repuestosUsados.length
    ? await db.repuesto.findMany({
        where: {
          id: {
            in: data.repuestosUsados.map((item) => item.repuestoId),
          },
        },
      })
    : [];

  const repuestoMap = new Map(repuestos.map((item) => [item.id, item]));
  for (const item of data.repuestosUsados) {
    const repuesto = repuestoMap.get(item.repuestoId);
    if (!repuesto) {
      throw new AppError(`El repuesto ${item.repuestoId} no existe.`, 404);
    }

    if (repuesto.cantidadDisponible < item.cantidad) {
      throw new AppError(`Stock insuficiente para ${repuesto.nombre}.`, 409);
    }
  }

  const service = await db.$transaction(async (tx) => {
    const createdService = await tx.service.create({
      data: {
        vehiculoId: data.vehiculoId,
        nombreCliente: data.nombreCliente,
        telefonoCliente: data.telefonoCliente,
        domicilioCliente: data.domicilioCliente,
        descripcion: data.descripcion,
        kilometros: data.kilometros,
        fechaHoraProgramada: data.fechaHoraProgramada,
      },
    });

    for (const item of data.repuestosUsados) {
      await tx.repuesto.update({
        where: { id: item.repuestoId },
        data: {
          cantidadDisponible: {
            decrement: item.cantidad,
          },
        },
      });

      await tx.servicioRepuesto.create({
        data: {
          serviceId: createdService.id,
          repuestoId: item.repuestoId,
          cantidad: item.cantidad,
        },
      });
    }

    return tx.service.findUniqueOrThrow({
      where: { id: createdService.id },
      include: {
        vehiculo: true,
        repuestosUsados: {
          include: {
            repuesto: true,
          },
        },
      },
    });
  });

  return serializeService(service);
}

export async function updateService(id: number, input: unknown) {
  const data = serviceUpdateSchema.parse(input);

  try {
    const service = await db.service.update({
      where: { id },
      data,
      include: {
        vehiculo: true,
        repuestosUsados: {
          include: {
            repuesto: true,
          },
        },
      },
    });

    return serializeService(service);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El service solicitado no existe.", 404);
    }

    throw error;
  }
}

export async function deleteService(id: number) {
  const service = await db.service.findUnique({
    where: { id },
    include: {
      repuestosUsados: true,
    },
  });

  if (!service) {
    throw new AppError("El service solicitado no existe.", 404);
  }

  await db.$transaction(async (tx) => {
    for (const item of service.repuestosUsados) {
      await tx.repuesto.update({
        where: { id: item.repuestoId },
        data: {
          cantidadDisponible: {
            increment: item.cantidad,
          },
        },
      });
    }

    await tx.servicioRepuesto.deleteMany({
      where: { serviceId: id },
    });

    await tx.service.delete({
      where: { id },
    });
  });
}
