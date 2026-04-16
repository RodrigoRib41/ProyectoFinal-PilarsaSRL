import { type Prisma } from "@prisma/client";
import { type File as FormidableFile } from "formidable";
import { db } from "@/lib/db";
import { isZeroKmCategory } from "@/lib/autos/inventory";
import { AppError } from "@/lib/core/api-errors";
import { LEGACY_YEAR_FIELD, writeLegacyYear } from "@/lib/core/legacy";
import { legacyAutoSchema } from "@/lib/domain/schemas";
import { serializeAuto } from "@/lib/domain/serializers";
import { ensureCloudinary } from "@/lib/server/cloudinary";
import { getFieldValue } from "@/lib/server/formidable";
import {
  getAutoPromoDescriptions,
  removeAutoPromoDescription,
  setAutoPromoDescription,
} from "@/lib/server/modules/auto-promo-metadata";
import {
  getAutoSaleMetadata,
  getAutoSaleRecord,
  removeAutoSaleMetadata,
} from "@/lib/server/modules/auto-sale-metadata";

type AutoFormPayload = {
  fields: Record<string, string | string[] | undefined>;
  files?: Record<string, FormidableFile | FormidableFile[] | undefined>;
};

const FOTO_KEYS = ["foto1", "foto2", "foto3", "foto4"] as const;

function isAutoFormPayload(payload: AutoFormPayload | Record<string, unknown>): payload is AutoFormPayload {
  return typeof payload === "object" && payload != null && "fields" in payload;
}

function normalizeAutoPayload(payload: AutoFormPayload | Record<string, unknown>) {
  if (isAutoFormPayload(payload)) {
    const raw = {
      marca: getFieldValue(payload.fields.marca),
      modelo: getFieldValue(payload.fields.modelo),
      version: getFieldValue(payload.fields.version),
      moneda: getFieldValue(payload.fields.moneda),
      color: getFieldValue(payload.fields.color),
      categoria: getFieldValue(payload.fields.categoria),
      descripcion: getFieldValue(payload.fields.descripcion),
      kilometros: getFieldValue(payload.fields.kilometros),
      precio: getFieldValue(payload.fields.precio),
      precioPromocional: getFieldValue(payload.fields.precioPromocional),
      [LEGACY_YEAR_FIELD]: getFieldValue(
        payload.fields[LEGACY_YEAR_FIELD] ?? payload.fields.anio,
      ),
    };

    return legacyAutoSchema.parse(raw);
  }

  return legacyAutoSchema.parse(payload);
}

function normalizeInventoryData<T extends { categoria: string; kilometros: number }>(
  data: T,
) {
  if (!isZeroKmCategory(data.categoria)) {
    return data;
  }

  return {
    ...data,
    categoria: "0km",
    kilometros: 0,
  };
}

function normalizePromoDescription(value: string | string[] | undefined) {
  const description = getFieldValue(value).trim();
  return description ? description : null;
}

async function attachPromoDescriptions<T extends { id: number; precioPromocional: number | null }>(
  autos: T[],
) {
  if (autos.length === 0) {
    return autos.map((auto) => ({
      ...auto,
      promoDescription: null,
    }));
  }

  const descriptions = await getAutoPromoDescriptions(autos.map((auto) => auto.id));

  return autos.map((auto) => ({
    ...auto,
    promoDescription:
      auto.precioPromocional && auto.precioPromocional > 0
        ? descriptions[String(auto.id)]?.description ?? null
        : null,
  }));
}

async function filterSoldAutos<T extends { id: number }>(autos: T[]) {
  if (autos.length === 0) {
    return autos;
  }

  const soldMetadata = await getAutoSaleMetadata(autos.map((auto) => auto.id));
  return autos.filter((auto) => !soldMetadata[String(auto.id)]);
}

async function uploadFile(file: FormidableFile) {
  const cloudinary = ensureCloudinary();
  if (!cloudinary) {
    throw new AppError(
      "Cloudinary no esta configurado. No se pueden subir imagenes en este entorno.",
      500,
    );
  }

  const result = await cloudinary.uploader.upload(file.filepath, {
    folder: "pilarsa/autos",
  });

  return result.secure_url;
}

async function resolveFotoValues(
  files: Record<string, FormidableFile | FormidableFile[] | undefined> | undefined,
  fields: Record<string, string | string[] | undefined>,
) {
  const urls: Record<(typeof FOTO_KEYS)[number], string | null> = {
    foto1: null,
    foto2: null,
    foto3: null,
    foto4: null,
  };

  for (const key of FOTO_KEYS) {
    const currentFile = files?.[key];
    const currentField = fields[key];
    const normalizedFile = Array.isArray(currentFile) ? currentFile[0] : currentFile;

    if (normalizedFile) {
      urls[key] = await uploadFile(normalizedFile);
      continue;
    }

    const fieldValue = getFieldValue(currentField);
    urls[key] = fieldValue || null;
  }

  return urls;
}

export async function listAutos() {
  const autos = await db.auto.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  const availableAutos = await filterSoldAutos(autos);
  return attachPromoDescriptions(availableAutos.map(serializeAuto));
}

export async function listAutosForSales() {
  const autos = await db.auto.findMany({
    select: {
      id: true,
      marca: true,
      modelo: true,
      precio: true,
      kilometros: true,
      [LEGACY_YEAR_FIELD]: true,
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const availableAutos = await filterSoldAutos(autos);

  return availableAutos.map((auto) => ({
    id: auto.id,
    marca: auto.marca,
    modelo: auto.modelo,
    precio: auto.precio,
    kilometros: auto.kilometros,
    anio: auto[LEGACY_YEAR_FIELD],
    [LEGACY_YEAR_FIELD]: auto[LEGACY_YEAR_FIELD],
  }));
}

export async function getAutoById(id: number) {
  const auto = await db.auto.findUnique({
    where: { id },
  });

  if (!auto) {
    throw new AppError("El auto solicitado no existe.", 404);
  }

  const saleRecord = await getAutoSaleRecord(id);
  if (saleRecord) {
    throw new AppError("El auto solicitado ya fue vendido.", 404);
  }

  const [payload] = await attachPromoDescriptions([serializeAuto(auto)]);
  return payload;
}

export async function createAuto(payload: AutoFormPayload | Record<string, unknown>) {
  const normalized = normalizeInventoryData(normalizeAutoPayload(payload));
  const promoDescription = isAutoFormPayload(payload)
    ? normalizePromoDescription(payload.fields.promoDescription)
    : null;
  const fotos =
    isAutoFormPayload(payload)
      ? await resolveFotoValues(payload.files, payload.fields)
      : ({
          foto1: null,
          foto2: null,
          foto3: null,
          foto4: null,
        } as Record<(typeof FOTO_KEYS)[number], string | null>);

  const auto = await db.auto.create({
    data: writeLegacyYear(
      {
        marca: normalized.marca,
        modelo: normalized.modelo,
        version: normalized.version,
        precio: normalized.precio,
        precioPromocional: normalized.precioPromocional,
        moneda: normalized.moneda,
        kilometros: normalized.kilometros,
        color: normalized.color,
        categoria: normalized.categoria,
        descripcion: normalized.descripcion,
        ...fotos,
      },
      normalized.anio,
    ) as Prisma.AutoCreateInput,
  });

  await setAutoPromoDescription(
    auto.id,
    normalized.precioPromocional > 0 ? promoDescription : null,
  );

  const [serialized] = await attachPromoDescriptions([serializeAuto(auto)]);
  return serialized;
}

export async function updateAuto(id: number, payload: AutoFormPayload | Record<string, unknown>) {
  const saleRecord = await getAutoSaleRecord(id);
  if (saleRecord) {
    throw new AppError("El auto solicitado ya fue vendido y no puede editarse.", 409);
  }

  const normalized = normalizeInventoryData(normalizeAutoPayload(payload));
  const promoDescription = isAutoFormPayload(payload)
    ? normalizePromoDescription(payload.fields.promoDescription)
    : null;
  const fotos =
    isAutoFormPayload(payload)
      ? await resolveFotoValues(payload.files, payload.fields)
      : ({
          foto1: null,
          foto2: null,
          foto3: null,
          foto4: null,
        } as Record<(typeof FOTO_KEYS)[number], string | null>);

  try {
    const auto = await db.auto.update({
      where: { id },
      data: {
        marca: normalized.marca,
        modelo: normalized.modelo,
        version: normalized.version,
        precio: normalized.precio,
        precioPromocional: normalized.precioPromocional,
        moneda: normalized.moneda,
        kilometros: normalized.kilometros,
        color: normalized.color,
        categoria: normalized.categoria,
        descripcion: normalized.descripcion,
        ...fotos,
        [LEGACY_YEAR_FIELD]: normalized.anio,
      } as Prisma.AutoUpdateInput,
    });

    await setAutoPromoDescription(
      auto.id,
      normalized.precioPromocional > 0 ? promoDescription : null,
    );

    const [serialized] = await attachPromoDescriptions([serializeAuto(auto)]);
    return serialized;
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El auto solicitado no existe.", 404);
    }

    throw error;
  }
}

export async function deleteAuto(id: number) {
  try {
    await db.auto.delete({
      where: { id },
    });
    await removeAutoPromoDescription(id);
    await removeAutoSaleMetadata(id);
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2025") {
      throw new AppError("El auto solicitado no existe.", 404);
    }

    throw error;
  }
}
