"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeDollarSign, PlusCircle, Trash2 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  deletePurchase,
  getAutosForSales,
  getBalance,
  registerPurchase,
  registerSale,
} from "@/lib/api/admin";
import type { BalanceDTO } from "@/lib/domain/contracts";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";

type FinanceMode = "sales" | "purchases" | "balance";

type SaleCandidate = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  kilometros: number;
  anio: number;
};

type BalanceFilters = {
  desde: string;
  hasta: string;
};

type BalanceEvolutionPoint = {
  fecha: string;
  label: string;
  ingresos: number;
  egresos: number;
  neto: number;
  acumulado: number;
};

const PURCHASE_DELETE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const CHART_LEGEND_ITEMS = [
  { key: "ingresos", label: "Ingresos", color: "#10b981" },
  { key: "egresos", label: "Egresos", color: "#f59e0b" },
  { key: "acumulado", label: "Balance acumulado", color: "#0f172a" },
] as const;

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function formatDateInputLabel(value: string) {
  if (!value) {
    return "";
  }

  const parsed = parseDateInputValue(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatChartAxisValue(value: number) {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getDefaultBalanceFilters(): BalanceFilters {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setMonth(desde.getMonth() - 1);

  return {
    desde: formatDateInputValue(desde),
    hasta: formatDateInputValue(hasta),
  };
}

function isPurchaseWithinDeleteWindow(fecha: string) {
  const createdAt = new Date(fecha).getTime();
  if (Number.isNaN(createdAt)) {
    return false;
  }

  return Date.now() - createdAt <= PURCHASE_DELETE_WINDOW_MS;
}

function buildBalanceEvolutionData(items: BalanceDTO[]): BalanceEvolutionPoint[] {
  const groupedByDate = new Map<
    string,
    {
      fecha: string;
      ingresos: number;
      egresos: number;
    }
  >();

  const sortedItems = [...items].sort(
    (left, right) => new Date(left.fecha).getTime() - new Date(right.fecha).getTime(),
  );

  for (const item of sortedItems) {
    const key = formatDateInputValue(new Date(item.fecha));
    const current = groupedByDate.get(key) ?? {
      fecha: key,
      ingresos: 0,
      egresos: 0,
    };

    if (item.tipo === "INGRESO") {
      current.ingresos += item.monto;
    } else {
      current.egresos += item.monto;
    }

    groupedByDate.set(key, current);
  }

  let acumulado = 0;

  return Array.from(groupedByDate.values()).map((entry) => {
    const neto = entry.ingresos - entry.egresos;
    acumulado += neto;

    return {
      fecha: entry.fecha,
      label: formatDateInputLabel(entry.fecha),
      ingresos: entry.ingresos,
      egresos: entry.egresos,
      neto,
      acumulado,
    };
  });
}

function getBalanceTypeStyles(tipo: BalanceDTO["tipo"]) {
  return tipo === "INGRESO"
    ? "bg-emerald-100 text-emerald-800"
    : "bg-amber-100 text-amber-800";
}

export function FinanceWorkspace({ mode }: { mode: FinanceMode }) {
  const [balance, setBalance] = useState<BalanceDTO[]>([]);
  const [autos, setAutos] = useState<SaleCandidate[]>([]);
  const [salePrices, setSalePrices] = useState<Record<number, string>>({});
  const [filters, setFilters] = useState<BalanceFilters>(() =>
    mode === "balance" ? getDefaultBalanceFilters() : { desde: "", hasta: "" },
  );
  const [purchaseForm, setPurchaseForm] = useState({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    kilometros: 0,
    precioCompra: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    const data = await getAutosForSales();
    setAutos(data);
    setSalePrices(
      data.reduce<Record<number, string>>((acc, auto) => {
        acc[auto.id] = String(auto.precio);
        return acc;
      }, {}),
    );
  }, []);

  const loadBalance = useCallback(async (nextFilters?: BalanceFilters) => {
    const activeFilters = nextFilters ?? filters;
    const data = await getBalance(mode === "purchases" ? { tipo: "EGRESO" } : activeFilters);
    setBalance(mode === "purchases" ? data.filter((item) => item.tipo === "EGRESO") : data);
  }, [filters, mode]);

  const refresh = useCallback(async (nextFilters?: BalanceFilters) => {
    setLoading(true);
    try {
      if (mode === "sales") {
        await loadSales();
      } else {
        await loadBalance(nextFilters);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el modulo.");
    } finally {
      setLoading(false);
    }
  }, [loadBalance, loadSales, mode]);

  useEffect(() => {
    refresh();
  }, [mode, refresh]);

  const totals = useMemo(() => {
    const ingresos = balance
      .filter((item) => item.tipo === "INGRESO")
      .reduce((acc, item) => acc + item.monto, 0);
    const egresos = balance
      .filter((item) => item.tipo === "EGRESO")
      .reduce((acc, item) => acc + item.monto, 0);

    return {
      ingresos,
      egresos,
      neto: ingresos - egresos,
    };
  }, [balance]);

  const recentPurchases = useMemo(
    () =>
      balance.filter(
        (item) => item.tipo === "EGRESO" && isPurchaseWithinDeleteWindow(item.fecha),
      ),
    [balance],
  );

  const balanceEvolution = useMemo(() => buildBalanceEvolutionData(balance), [balance]);
  const chartMinWidth = useMemo(
    () => Math.max(balanceEvolution.length * 92, 560),
    [balanceEvolution.length],
  );
  const hasBalanceData = balance.length > 0;
  const activeRangeLabel =
    filters.desde && filters.hasta
      ? `${formatDateInputLabel(filters.desde)} al ${formatDateInputLabel(filters.hasta)}`
      : "Rango abierto";

  async function handleSale(auto: SaleCandidate) {
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await registerSale({
        autoId: auto.id,
        precioVenta: Number(salePrices[auto.id] ?? auto.precio),
      });
      setMessage(
        `Venta registrada para ${auto.marca} ${auto.modelo}. El ingreso ya impacta en Balance.`,
      );
      await refresh();
      await loadBalance();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar la venta.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePurchase(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await registerPurchase(purchaseForm);
      setMessage("Compra registrada, impactada en Balance y agregada al inventario.");
      setPurchaseForm({
        marca: "",
        modelo: "",
        anio: new Date().getFullYear(),
        kilometros: 0,
        precioCompra: 0,
      });
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar la compra.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePurchase(id: number) {
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await deletePurchase(id);
      setMessage("Compra eliminada del balance y retirada del inventario.");
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo eliminar la compra.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApplyBalanceFilters(event?: React.FormEvent) {
    event?.preventDefault();

    if (!filters.desde || !filters.hasta) {
      setError("Selecciona una fecha inicial y una final para consultar el balance.");
      return;
    }

    if (filters.desde > filters.hasta) {
      setError("La fecha final debe ser igual o posterior a la inicial.");
      return;
    }

    setMessage(null);
    setError(null);
    await refresh(filters);
  }

  async function handleResetBalanceFilters() {
    const nextFilters = getDefaultBalanceFilters();
    setFilters(nextFilters);
    setMessage(null);
    setError(null);
    await refresh(nextFilters);
  }

  return (
    <AdminPage
      eyebrow="Finanzas"
      title="Compras, ventas y balance en un flujo mas confiable"
      description="Las operaciones financieras ahora comparten reglas, validaciones y un mismo lenguaje visual para evitar dobles registros y movimientos inconsistentes."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Ingresos" value={formatCurrency(totals.ingresos)} tone="success" />
        <AdminMetricCard label="Egresos" value={formatCurrency(totals.egresos)} tone="warning" />
        <AdminMetricCard label="Balance neto" value={formatCurrency(totals.neto)} />
      </section>

      {message ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 sm:px-5">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 sm:px-5">
          {error}
        </div>
      ) : null}

      {mode === "sales" ? (
        <AdminPanel
          title="Registrar ventas"
          description="La venta crea el movimiento de ingreso, marca la unidad como vendida y la retira del stock visible sin perder trazabilidad."
        >
          <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando unidades para venta...
              </div>
            ) : autos.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No hay unidades disponibles para vender.
              </div>
            ) : (
              autos.map((auto) => (
                <div
                  key={auto.id}
                  className="grid gap-4 rounded-[1.5rem] border border-slate-200 p-4 sm:grid-cols-[1fr_180px] xl:grid-cols-[1fr_180px_200px_180px]"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-950">
                      {auto.marca} {auto.modelo}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {auto.anio} | {formatNumber(auto.kilometros)} km
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">
                      Precio sugerido
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-900">
                      {formatCurrency(auto.precio)}
                    </p>
                  </div>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Precio final de venta
                    <input
                      value={salePrices[auto.id] ?? String(auto.precio)}
                      onChange={(event) =>
                        setSalePrices((current) => ({
                          ...current,
                          [auto.id]: event.target.value,
                        }))
                      }
                      type="number"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSale(auto)}
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50 xl:w-auto"
                  >
                    <BadgeDollarSign size={16} />
                    Registrar venta
                  </button>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      ) : null}

      {mode === "purchases" ? (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <AdminPanel
            title="Registrar compra"
            description="Cada compra crea el egreso en Balance y agrega la unidad al inventario usado."
          >
            <form onSubmit={handlePurchase} className="space-y-4">
              <FinanceField
                label="Marca"
                value={purchaseForm.marca}
                onChange={(value) => setPurchaseForm((current) => ({ ...current, marca: value }))}
                required
              />
              <FinanceField
                label="Modelo"
                value={purchaseForm.modelo}
                onChange={(value) => setPurchaseForm((current) => ({ ...current, modelo: value }))}
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FinanceField
                  label="Año"
                  type="number"
                  value={String(purchaseForm.anio)}
                  onChange={(value) =>
                    setPurchaseForm((current) => ({ ...current, anio: Number(value) }))
                  }
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  required
                />
                <FinanceField
                  label="Kilometros"
                  type="number"
                  value={String(purchaseForm.kilometros)}
                  onChange={(value) =>
                    setPurchaseForm((current) => ({ ...current, kilometros: Number(value) }))
                  }
                  min={0}
                  step={1}
                  required
                />
              </div>
              <FinanceField
                label="Precio de compra"
                type="number"
                value={String(purchaseForm.precioCompra)}
                onChange={(value) =>
                  setPurchaseForm((current) => ({ ...current, precioCompra: Number(value) }))
                }
                min={0.01}
                step={0.01}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
              >
                <PlusCircle size={16} />
                Registrar compra
              </button>
            </form>
          </AdminPanel>

          <AdminPanel
            title="Compras recientes"
            description="Se muestran las compras de los ultimos 7 dias, que todavia pueden eliminarse si fueron cargadas por error."
          >
            <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Cargando movimientos...
                </div>
              ) : recentPurchases.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No hay compras eliminables en la ultima semana.
                </div>
              ) : (
                recentPurchases.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 sm:grid-cols-[1fr_auto] xl:grid-cols-[1fr_1fr_auto]"
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {item.marca} {item.modelo}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(item.fecha)} | {item.anio} | {formatNumber(item.kilometros)} km
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-950">
                      {formatCurrency(item.monto)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePurchase(item.id)}
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50 xl:w-auto"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </AdminPanel>
        </section>
      ) : null}

      {mode === "balance" ? (
        <section className="space-y-6">
          <AdminPanel
            title="Filtro temporal"
            description="El balance se carga por defecto con el ultimo mes y puedes ajustar el rango cuando lo necesites."
          >
            <form
              onSubmit={handleApplyBalanceFilters}
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto]"
            >
              <FinanceField
                label="Desde"
                type="date"
                value={filters.desde}
                onChange={(value) => setFilters((current) => ({ ...current, desde: value }))}
                required
              />
              <FinanceField
                label="Hasta"
                type="date"
                value={filters.hasta}
                onChange={(value) => setFilters((current) => ({ ...current, hasta: value }))}
                required
              />
              <button
                type="button"
                onClick={() => void handleResetBalanceFilters()}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:mt-7 xl:w-auto"
              >
                Ultimo mes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50 sm:mt-7 xl:w-auto"
              >
                Aplicar filtro
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-500">
              Periodo activo: <span className="font-medium text-slate-700">{activeRangeLabel}</span>
            </p>
          </AdminPanel>

          <AdminPanel
            title="Evolucion"
            description="Visualiza ingresos, egresos y el balance acumulado del rango activo."
          >
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Cargando balance...
              </div>
            ) : !hasBalanceData ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No hay movimientos cargados para el rango seleccionado.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <FinanceSummaryStat
                    label="Dias con movimiento"
                    value={String(balanceEvolution.length)}
                  />
                  <FinanceSummaryStat
                    label="Ultimo corte"
                    value={formatDateInputLabel(
                      balanceEvolution[balanceEvolution.length - 1]?.fecha ?? filters.hasta,
                    )}
                  />
                  <FinanceSummaryStat
                    label="Saldo acumulado"
                    value={formatCurrency(
                      balanceEvolution[balanceEvolution.length - 1]?.acumulado ?? totals.neto,
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {CHART_LEGEND_ITEMS.map((item) => (
                    <span
                      key={item.key}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>

                <div className="overflow-x-auto pb-2">
                  <div
                    className="h-[280px] min-w-full sm:h-[320px]"
                    style={{ minWidth: chartMinWidth }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={balanceEvolution}
                        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                        <XAxis
                          dataKey="label"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          minTickGap={24}
                          tickMargin={10}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          tickFormatter={formatChartAxisValue}
                          width={48}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 16,
                            border: "1px solid #e2e8f0",
                          }}
                          formatter={(value: number, name: string) => {
                            const labels: Record<string, string> = {
                              ingresos: "Ingresos",
                              egresos: "Egresos",
                              acumulado: "Balance acumulado",
                            };

                            return [formatCurrency(Number(value)), labels[name] ?? name];
                          }}
                          labelFormatter={(_label, payload) => {
                            const point = payload?.[0]?.payload as BalanceEvolutionPoint | undefined;
                            return point ? formatDateInputLabel(point.fecha) : "";
                          }}
                        />
                        <Bar dataKey="ingresos" name="ingresos" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="egresos" name="egresos" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        <Line
                          type="monotone"
                          dataKey="acumulado"
                          name="acumulado"
                          stroke="#0f172a"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <p className="text-xs leading-5 text-slate-500 md:hidden">
                  Puedes deslizar el grafico en horizontal cuando el rango tiene muchos dias con actividad.
                </p>
              </div>
            )}
          </AdminPanel>

          <AdminPanel
            title="Detalle de movimientos"
            description="Cada registro del rango muestra fecha, tipo, marca, modelo, año, km y monto."
          >
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Cargando tabla...
              </div>
            ) : !hasBalanceData ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No hay datos para mostrar en la tabla del periodo seleccionado.
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {balance.map((item) => (
                    <BalanceMovementCard key={item.id} item={item} />
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[760px] border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr>
                        {["Fecha", "Tipo", "Marca", "Modelo", "Año", "Km", "Monto"].map((column) => (
                          <th
                            key={column}
                            className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-600"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {balance.map((item) => (
                        <tr key={item.id} className="odd:bg-slate-50/70">
                          <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                            {formatDate(item.fecha)}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getBalanceTypeStyles(item.tipo)}`}
                            >
                              {item.tipo}
                            </span>
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                            {item.marca}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                            {item.modelo}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                            {item.anio}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                            {formatNumber(item.kilometros)}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3 text-right font-semibold text-slate-950">
                            {formatCurrency(item.monto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </AdminPanel>
        </section>
      ) : null}
    </AdminPage>
  );
}

function FinanceSummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BalanceMovementCard({ item }: { item: BalanceDTO }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">
            {item.marca} {item.modelo}
          </p>
          <p className="mt-1 text-sm text-slate-500">{formatDate(item.fecha)}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getBalanceTypeStyles(item.tipo)}`}
        >
          {item.tipo}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Monto</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(item.monto)}</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Unidad</p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {item.anio} · {formatNumber(item.kilometros)} km
          </p>
        </div>
      </div>
    </article>
  );
}

function FinanceField({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  step,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        min={min}
        max={max}
        step={step}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
      />
    </label>
  );
}
