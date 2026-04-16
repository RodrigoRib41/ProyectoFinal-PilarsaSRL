import type {
  Auto,
  Balance,
  Repuesto,
  Service,
  ServicioRepuesto,
  Vehiculo,
} from "@prisma/client";
import { isZeroKmCategory } from "@/lib/autos/inventory";
import { readLegacyYear, withLegacyYear } from "@/lib/core/legacy";
import type {
  AutoDTO,
  BalanceDTO,
  RepuestoDTO,
  ServiceDTO,
  ServiceRepuestoDTO,
  VehiculoDTO,
} from "@/lib/domain/contracts";

type VehiculoWithServices = Vehiculo & { services?: Service[] };
type RepuestoWithUsage = Repuesto & { servicios?: ServicioRepuesto[] };
type ServiceWithRelations = Service & {
  vehiculo?: Vehiculo | null;
  repuestosUsados?: (ServicioRepuesto & { repuesto?: Repuesto | null })[];
};

export function serializeVehiculo(vehiculo: VehiculoWithServices) {
  const payload: VehiculoDTO = {
    id: vehiculo.id,
    patente: vehiculo.patente,
    marca: vehiculo.marca,
    version: vehiculo.version,
    anio: readLegacyYear(vehiculo),
    kilometros: vehiculo.kilometros,
    totalServices: vehiculo.services?.length,
  };

  return withLegacyYear(payload);
}

export function serializeRepuesto(repuesto: RepuestoWithUsage): RepuestoDTO {
  return {
    id: repuesto.id,
    nombre: repuesto.nombre,
    codigo: repuesto.codigo,
    cantidadDisponible: repuesto.cantidadDisponible,
    descripcion: repuesto.descripcion,
    totalUsos: repuesto.servicios?.length,
  };
}

export function serializeServiceRepuesto(item: ServicioRepuesto & { repuesto?: Repuesto | null }) {
  const payload: ServiceRepuestoDTO = {
    id: item.id,
    repuestoId: item.repuestoId,
    cantidad: item.cantidad,
    repuesto: item.repuesto ? serializeRepuesto(item.repuesto) : undefined,
  };

  return payload;
}

export function serializeService(service: ServiceWithRelations) {
  const payload: ServiceDTO = {
    id: service.id,
    vehiculoId: service.vehiculoId,
    nombreCliente: service.nombreCliente,
    telefonoCliente: service.telefonoCliente,
    domicilioCliente: service.domicilioCliente,
    fecha: service.fecha.toISOString(),
    fechaHoraProgramada: service.fechaHoraProgramada.toISOString(),
    descripcion: service.descripcion,
    kilometros: service.kilometros,
    estado: service.estado,
    vehiculo: service.vehiculo ? serializeVehiculo(service.vehiculo) : undefined,
    repuestosUsados: service.repuestosUsados?.map(serializeServiceRepuesto),
  };

  return payload;
}

export function serializeAuto(auto: Auto) {
  const zeroKm = isZeroKmCategory(auto.categoria);
  const fotos = [auto.foto1, auto.foto2, auto.foto3, auto.foto4].filter(Boolean) as string[];
  const payload: AutoDTO = {
    id: auto.id,
    marca: auto.marca,
    modelo: auto.modelo,
    version: auto.version,
    anio: readLegacyYear(auto),
    precio: auto.precio,
    precioPromocional: auto.precioPromocional,
    promoDescription: null,
    moneda: auto.moneda,
    kilometros: zeroKm ? 0 : auto.kilometros,
    color: auto.color,
    categoria: zeroKm ? "0km" : auto.categoria,
    descripcion: auto.descripcion,
    foto1: auto.foto1,
    foto2: auto.foto2,
    foto3: auto.foto3,
    foto4: auto.foto4,
    fotos,
    createdAt: auto.createdAt.toISOString(),
    updatedAt: auto.updatedAt.toISOString(),
  };

  return withLegacyYear(payload);
}

export function serializeBalance(item: Balance) {
  const payload: BalanceDTO = {
    id: item.id,
    tipo: item.tipo,
    monto: item.monto,
    fecha: item.fecha.toISOString(),
    marca: item.marca,
    modelo: item.modelo,
    anio: item.anio,
    kilometros: item.kilometros,
  };

  return withLegacyYear(payload);
}
