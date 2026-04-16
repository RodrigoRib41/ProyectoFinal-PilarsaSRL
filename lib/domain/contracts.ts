export type UserRole = "SUPERADMIN" | "STOCK" | "SERVICES" | "FINANZAS";

export type VehiculoDTO = {
  id: number;
  patente: string;
  marca: string;
  version: string;
  anio: number;
  kilometros: number;
  totalServices?: number;
};

export type RepuestoDTO = {
  id: number;
  nombre: string;
  codigo: string;
  cantidadDisponible: number;
  descripcion: string | null;
  totalUsos?: number;
};

export type ServiceRepuestoDTO = {
  id: number;
  repuestoId: number;
  cantidad: number;
  repuesto?: RepuestoDTO;
};

export type ServiceDTO = {
  id: number;
  vehiculoId: number;
  nombreCliente: string;
  telefonoCliente: string;
  domicilioCliente: string;
  fecha: string;
  fechaHoraProgramada: string;
  descripcion: string;
  kilometros: number;
  estado: string;
  vehiculo?: VehiculoDTO;
  repuestosUsados?: ServiceRepuestoDTO[];
};

export type AutoDTO = {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precio: number;
  precioPromocional: number | null;
  promoDescription: string | null;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
  foto1: string | null;
  foto2: string | null;
  foto3: string | null;
  foto4: string | null;
  fotos: string[];
  createdAt: string;
  updatedAt: string;
};

export type BalanceDTO = {
  id: number;
  tipo: "INGRESO" | "EGRESO";
  monto: number;
  fecha: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometros: number;
};

export type ContactRequestDTO = {
  motivo: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  mensaje: string;
};
