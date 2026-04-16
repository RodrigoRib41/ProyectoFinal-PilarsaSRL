export function formatCurrency(
  value: number,
  currency = "ARS",
  locale = "es-AR",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale = "es-AR") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(value: string | Date, locale = "es-AR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date, locale = "es-AR") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function clampMin(value: number, minimum = 0) {
  return value < minimum ? minimum : value;
}
