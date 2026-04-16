export type InventoryModule = "used" | "zeroKm" | "all";

export function normalizeAutoCategory(value?: string | null) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, "");
}

export function isZeroKmCategory(value?: string | null) {
  return normalizeAutoCategory(value) === "0km";
}

export function matchesInventoryModule(
  value: string | null | undefined,
  module: InventoryModule,
) {
  if (module === "all") {
    return true;
  }

  if (module === "zeroKm") {
    return isZeroKmCategory(value);
  }

  return !isZeroKmCategory(value);
}

export function getInventoryDetailHref(
  category: string | null | undefined,
  autoId: number | string,
) {
  return isZeroKmCategory(category) ? `/0km/${autoId}` : `/usados/${autoId}`;
}
