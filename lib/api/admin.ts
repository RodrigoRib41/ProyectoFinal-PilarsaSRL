import type {
  AutoDTO,
  BalanceDTO,
  RepuestoDTO,
  ServiceDTO,
  VehiculoDTO,
} from "@/lib/domain/contracts";
import { requestApi } from "@/lib/api/client";

export type ServiceFormPayload = {
  vehiculoId: number;
  nombreCliente: string;
  telefonoCliente: string;
  domicilioCliente: string;
  descripcion: string;
  kilometros: number;
  fechaHoraProgramada: string;
  repuestosUsados: Array<{ repuestoId: number; cantidad: number }>;
};

export type RepuestoFormPayload = {
  nombre: string;
  codigo: string;
  cantidadDisponible: number;
  descripcion?: string | null;
};

export type VehiculoFormPayload = {
  patente: string;
  marca: string;
  version: string;
  anio: number;
  kilometros: number;
};

export type UsedCarFormPayload = {
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precio: number;
  precioPromocional?: number | null;
  promoDescription?: string | null;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
};

export async function getVehiculos() {
  return requestApi<VehiculoDTO[]>("/api/vehiculos");
}

export async function createVehiculo(payload: VehiculoFormPayload) {
  return requestApi<VehiculoDTO>("/api/vehiculos", {
    method: "POST",
    body: payload,
  });
}

export async function updateVehiculo(id: number, payload: Partial<VehiculoFormPayload>) {
  return requestApi<VehiculoDTO>(`/api/vehiculos/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteVehiculo(id: number) {
  return requestApi<void>(`/api/vehiculos/${id}`, {
    method: "DELETE",
  });
}

export async function getRepuestos() {
  return requestApi<RepuestoDTO[]>("/api/repuestos");
}

export async function createRepuesto(payload: RepuestoFormPayload) {
  return requestApi<RepuestoDTO>("/api/repuestos", {
    method: "POST",
    body: payload,
  });
}

export async function updateRepuesto(id: number, payload: Partial<RepuestoFormPayload>) {
  return requestApi<RepuestoDTO>(`/api/repuestos/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteRepuesto(id: number) {
  return requestApi<void>(`/api/repuestos/${id}`, {
    method: "DELETE",
  });
}

export async function getServices() {
  return requestApi<ServiceDTO[]>("/api/services");
}

export async function createService(payload: ServiceFormPayload) {
  return requestApi<ServiceDTO>("/api/services", {
    method: "POST",
    body: payload,
  });
}

export async function updateService(id: number, payload: Partial<ServiceFormPayload>) {
  return requestApi<ServiceDTO>(`/api/services/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteService(id: number) {
  return requestApi<void>(`/api/services/${id}`, {
    method: "DELETE",
  });
}

export async function getAutos() {
  return requestApi<AutoDTO[]>("/api/autos");
}

export async function getAutosForSales() {
  return requestApi<
    Array<{
      id: number;
      marca: string;
      modelo: string;
      precio: number;
      kilometros: number;
      anio: number;
    }>
  >("/api/autos/listado");
}

export async function getAutoById(id: number) {
  return requestApi<AutoDTO>(`/api/autos/${id}`);
}

export async function createAuto(payload: FormData) {
  return requestApi<AutoDTO>("/api/autos", {
    method: "POST",
    body: payload,
  });
}

export async function updateAuto(id: number, payload: FormData) {
  return requestApi<AutoDTO>(`/api/autos/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteAuto(id: number) {
  return requestApi<void>(`/api/autos/${id}`, {
    method: "DELETE",
  });
}

export async function registerSale(payload: { autoId: number; precioVenta: number }) {
  return requestApi<BalanceDTO>("/api/balance/registrar-venta", {
    method: "POST",
    body: payload,
  });
}

export async function getBalance(filters?: { desde?: string; hasta?: string; tipo?: string }) {
  const params = new URLSearchParams();
  if (filters?.desde) params.set("desde", filters.desde);
  if (filters?.hasta) params.set("hasta", filters.hasta);
  if (filters?.tipo) params.set("tipo", filters.tipo);

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestApi<BalanceDTO[]>(`/api/balance/listado${suffix}`);
}

export async function registerPurchase(payload: {
  marca: string;
  modelo: string;
  anio: number;
  kilometros: number;
  precioCompra: number;
}) {
  return requestApi<BalanceDTO>("/api/balance/registrar-compra", {
    method: "POST",
    body: payload,
  });
}

export async function deletePurchase(id: number) {
  return requestApi<void>(`/api/balance/registrar-compra?id=${id}`, {
    method: "DELETE",
  });
}
