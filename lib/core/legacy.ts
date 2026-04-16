export const LEGACY_YEAR_FIELD = "a\u00f1o" as const;

type LegacyYearRecord = Record<typeof LEGACY_YEAR_FIELD, number>;

export function readLegacyYear(record: LegacyYearRecord) {
  return record[LEGACY_YEAR_FIELD];
}

export function writeLegacyYear<T extends Record<string, unknown>>(
  record: T,
  anio: number,
) {
  return {
    ...record,
    [LEGACY_YEAR_FIELD]: anio,
  };
}

export function withLegacyYear<T extends { anio: number }>(record: T) {
  return {
    ...record,
    [LEGACY_YEAR_FIELD]: record.anio,
  };
}

export function getNumberishYear(input: Record<string, unknown>) {
  const value = input.anio ?? input[LEGACY_YEAR_FIELD];
  return typeof value === "string" || typeof value === "number" ? Number(value) : value;
}
