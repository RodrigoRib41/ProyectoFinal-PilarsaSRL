import { z } from "zod";
import { LEGACY_YEAR_FIELD } from "@/lib/core/legacy";

const trimmedString = z.string().trim();
const positiveInt = z.coerce.number().int().nonnegative();
const positiveMoney = z.coerce.number().positive();
const dateInputString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD.");

export const vehicleCreateSchema = z.object({
  patente: trimmedString.min(3).max(12).transform((value) => value.toUpperCase()),
  marca: trimmedString.min(2),
  version: trimmedString.min(1),
  anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  kilometros: positiveInt,
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "No se enviaron cambios para actualizar.",
);

export const legacyVehicleSchema = z
  .object({
    patente: trimmedString.min(3).max(12).transform((value) => value.toUpperCase()),
    marca: trimmedString.min(2),
    version: trimmedString.min(1),
    kilometros: positiveInt,
    anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    [LEGACY_YEAR_FIELD]: z
      .coerce
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .optional(),
  })
  .transform(({ anio, ...rest }) => ({
    ...rest,
    anio: anio ?? Number(rest[LEGACY_YEAR_FIELD]),
  }));

export const repuestoCreateSchema = z.object({
  nombre: trimmedString.min(2),
  codigo: trimmedString.min(2).max(40).transform((value) => value.toUpperCase()),
  cantidadDisponible: positiveInt,
  descripcion: trimmedString.max(240).optional().nullable(),
});

export const repuestoUpdateSchema = repuestoCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "No se enviaron cambios para actualizar.",
);

export const servicePartSchema = z.object({
  repuestoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
});

export const serviceCreateSchema = z.object({
  vehiculoId: z.coerce.number().int().positive(),
  nombreCliente: trimmedString.min(2),
  telefonoCliente: trimmedString.min(6).max(30),
  domicilioCliente: trimmedString.min(4),
  descripcion: trimmedString.min(4),
  kilometros: positiveInt,
  fechaHoraProgramada: z.coerce.date(),
  repuestosUsados: z.array(servicePartSchema).default([]),
});

export const serviceUpdateSchema = z
  .object({
    nombreCliente: trimmedString.min(2).optional(),
    telefonoCliente: trimmedString.min(6).max(30).optional(),
    domicilioCliente: trimmedString.min(4).optional(),
    descripcion: trimmedString.min(4).optional(),
    kilometros: positiveInt.optional(),
    estado: trimmedString.min(3).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "No se enviaron cambios para actualizar.");

export const autoBaseSchema = z.object({
  marca: trimmedString.min(2),
  modelo: trimmedString.min(1),
  version: trimmedString.min(1).default(""),
  anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  precio: positiveMoney,
  precioPromocional: z.union([
    z.coerce.number().nonnegative(),
    z.literal(""),
    z.null(),
    z.undefined(),
  ]),
  moneda: trimmedString.min(1).max(5),
  kilometros: positiveInt,
  color: trimmedString.min(2),
  categoria: trimmedString.min(2),
  descripcion: trimmedString.min(8),
});

export const autoCreateSchema = autoBaseSchema.transform((data) => ({
  ...data,
  precioPromocional:
    data.precioPromocional === "" || data.precioPromocional == null
      ? 0
      : Number(data.precioPromocional),
}));

export const autoUpdateSchema = autoBaseSchema.partial().transform((data) => ({
  ...data,
  precioPromocional:
    data.precioPromocional === "" || data.precioPromocional == null
      ? 0
      : Number(data.precioPromocional),
}));

export const legacyAutoSchema = z
  .object({
    ...autoBaseSchema.shape,
    anio: autoBaseSchema.shape.anio.optional(),
    [LEGACY_YEAR_FIELD]: autoBaseSchema.shape.anio.optional(),
  })
  .transform(({ anio, ...rest }) => ({
    ...rest,
    anio: anio ?? Number(rest[LEGACY_YEAR_FIELD]),
    precioPromocional:
      rest.precioPromocional === "" || rest.precioPromocional == null
        ? 0
        : Number(rest.precioPromocional),
  }));

export const autoSaleSchema = z.object({
  autoId: z.coerce.number().int().positive(),
  precioVenta: positiveMoney,
});

export const balancePurchaseSchema = z.object({
  marca: trimmedString.min(2),
  modelo: trimmedString.min(1),
  anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  kilometros: positiveInt,
  precioCompra: positiveMoney,
});

export const legacyBalancePurchaseSchema = z
  .object({
    marca: trimmedString.min(2),
    modelo: trimmedString.min(1),
    kilometros: positiveInt,
    precioCompra: positiveMoney,
    anio: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    [LEGACY_YEAR_FIELD]: z
      .coerce
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .optional(),
  })
  .transform(({ anio, ...rest }) => ({
    ...rest,
    anio: anio ?? Number(rest[LEGACY_YEAR_FIELD]),
  }));

export const balanceFilterSchema = z.object({
  desde: dateInputString.optional(),
  hasta: dateInputString.optional(),
  tipo: z.enum(["INGRESO", "EGRESO"]).optional(),
}).refine((data) => !(data.desde && data.hasta) || data.desde <= data.hasta, {
  message: "La fecha final debe ser igual o posterior a la inicial.",
  path: ["hasta"],
});

export const registerUserSchema = z.object({
  username: trimmedString.min(3).max(40),
  password: trimmedString.min(6).max(120),
  role: z.enum(["STOCK", "SERVICES", "FINANZAS", "SUPERADMIN"]),
});

export const resetInternalUserPasswordSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    password: trimmedString.min(6).max(120),
    confirmPassword: trimmedString.min(6).max(120),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "La confirmacion no coincide con la contrasena inicial.",
    path: ["confirmPassword"],
  });

export const initialPasswordChangeSchema = z
  .object({
    currentPassword: trimmedString.min(6).max(120),
    newPassword: trimmedString.min(6).max(120),
    confirmPassword: trimmedString.min(6).max(120),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "La confirmacion no coincide con la nueva contrasena.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contrasena debe ser distinta de la inicial.",
    path: ["newPassword"],
  });

export const contactSchema = z
  .object({
    motivo: z.enum(["Consulta", "Reclamo", "Service", "TestDrive"]),
    nombre: trimmedString.min(2),
    apellido: trimmedString.max(80).optional().default(""),
    email: z.string().trim().email(),
    telefono: trimmedString.min(7).max(30),
    modeloAuto: trimmedString.max(80).optional().default(""),
    mensaje: trimmedString.max(250).optional().default(""),
  })
  .superRefine((data, context) => {
    if (data.motivo === "TestDrive") {
      if (data.modeloAuto.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["modeloAuto"],
          message: "Selecciona o escribe el modelo que quieres probar.",
        });
      }

      return;
    }

    if (data.apellido.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["apellido"],
        message: "Ingresa tu apellido.",
      });
    }

    if (data.mensaje.length < 4) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mensaje"],
        message: "Describe un poco mejor tu consulta.",
      });
    }
  });
