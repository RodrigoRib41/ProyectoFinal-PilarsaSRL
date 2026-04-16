import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AppError } from "@/lib/core/api-errors";
import { readLegacyYear, writeLegacyYear } from "@/lib/core/legacy";
import {
  autoSaleSchema,
  balanceFilterSchema,
  balancePurchaseSchema,
  legacyBalancePurchaseSchema,
} from "@/lib/domain/schemas";
import { serializeBalance } from "@/lib/domain/serializers";
import {
  getAutoPurchaseRecord,
  linkPurchaseToAuto,
  removePurchaseToAutoLink,
} from "@/lib/server/modules/auto-purchase-metadata";
import { removeAutoPromoDescription } from "@/lib/server/modules/auto-promo-metadata";
import { getAutoSaleRecord, markAutoAsSold } from "@/lib/server/modules/auto-sale-metadata";

const PURCHASE_DELETE_WINDOW_DAYS = 7;

function parseDateInputValue(value: string, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);
  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
}

function normalizePurchaseInput(input: unknown) {
  const data = legacyBalancePurchaseSchema.safeParse(input);
  return data.success ? data.data : balancePurchaseSchema.parse(input);
}

function canDeletePurchase(fecha: Date) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - PURCHASE_DELETE_WINDOW_DAYS);
  return fecha >= oneWeekAgo;
}

function buildPurchasedAutoData(data: ReturnType<typeof normalizePurchaseInput>) {
  return writeLegacyYear(
    {
      marca: data.marca,
      modelo: data.modelo,
      version: "Pendiente",
      precio: data.precioCompra,
      precioPromocional: 0,
      moneda: "$",
      kilometros: data.kilometros,
      color: "A definir",
      categoria: "Usado",
      descripcion: "Unidad ingresada por compra. Completar ficha comercial.",
      foto1: null,
      foto2: null,
      foto3: null,
      foto4: null,
    },
    data.anio,
  ) as Prisma.AutoCreateInput;
}

export async function listBalance(input: unknown) {
  const filters = balanceFilterSchema.parse(input);
  const where = {
    ...(filters.tipo ? { tipo: filters.tipo } : {}),
    ...((filters.desde || filters.hasta)
      ? {
          fecha: {
            ...(filters.desde ? { gte: parseDateInputValue(filters.desde) } : {}),
            ...(filters.hasta ? { lte: parseDateInputValue(filters.hasta, true) } : {}),
          },
        }
      : {}),
  };

  const items = await db.balance.findMany({
    where,
    orderBy: {
      fecha: "desc",
    },
  });

  return items.map(serializeBalance);
}

export async function registerCompra(input: unknown) {
  const normalized = normalizePurchaseInput(input);

  const result = await db.$transaction(async (tx) => {
    const createdBalance = await tx.balance.create({
      data: {
        tipo: "EGRESO",
        monto: normalized.precioCompra,
        fecha: new Date(),
        marca: normalized.marca,
        modelo: normalized.modelo,
        anio: normalized.anio,
        kilometros: normalized.kilometros,
      },
    });

    const createdAuto = await tx.auto.create({
      data: buildPurchasedAutoData(normalized),
    });

    return {
      balance: createdBalance,
      auto: createdAuto,
    };
  });

  await linkPurchaseToAuto(result.balance.id, result.auto.id);

  return serializeBalance(result.balance);
}

export async function deleteCompra(id: number) {
  const item = await db.balance.findUnique({
    where: { id },
  });

  if (!item) {
    throw new AppError("El movimiento solicitado no existe.", 404);
  }

  if (item.tipo !== "EGRESO") {
    throw new AppError("Solo se pueden eliminar movimientos de compra.", 409);
  }

  if (!canDeletePurchase(item.fecha)) {
    throw new AppError("Solo se pueden eliminar compras de la ultima semana.", 409);
  }

  const purchaseRecord = await getAutoPurchaseRecord(id);

  if (purchaseRecord) {
    const saleRecord = await getAutoSaleRecord(purchaseRecord.autoId);
    if (saleRecord) {
      throw new AppError(
        "No se puede eliminar la compra porque la unidad asociada ya fue vendida.",
        409,
      );
    }
  }

  await db.$transaction(async (tx) => {
    if (purchaseRecord) {
      const auto = await tx.auto.findUnique({
        where: { id: purchaseRecord.autoId },
      });

      if (auto) {
        await tx.auto.delete({
          where: { id: purchaseRecord.autoId },
        });
      }
    }

    await tx.balance.delete({
      where: { id },
    });
  });

  if (purchaseRecord) {
    await removeAutoPromoDescription(purchaseRecord.autoId);
    await removePurchaseToAutoLink(id);
  }
}

export async function registrarVenta(input: unknown) {
  const data = autoSaleSchema.parse(input);
  const existingSale = await getAutoSaleRecord(data.autoId);

  if (existingSale) {
    throw new AppError("El auto seleccionado ya fue vendido.", 409);
  }

  const result = await db.$transaction(async (tx) => {
    const auto = await tx.auto.findUnique({
      where: { id: data.autoId },
    });

    if (!auto) {
      throw new AppError("El auto seleccionado no existe.", 404);
    }

    const balance = await tx.balance.create({
      data: {
        tipo: "INGRESO",
        monto: data.precioVenta,
        fecha: new Date(),
        marca: auto.marca,
        modelo: auto.modelo,
        anio: readLegacyYear(auto),
        kilometros: auto.kilometros,
      },
    });

    return balance;
  });

  await markAutoAsSold(data.autoId, {
    balanceId: result.id,
    salePrice: data.precioVenta,
    soldAt: result.fecha.toISOString(),
  });

  return serializeBalance(result);
}
