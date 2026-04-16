"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { createService, getRepuestos, getVehiculos } from "@/lib/api/admin";
import type { RepuestoDTO, VehiculoDTO } from "@/lib/domain/contracts";
import { formatNumber } from "@/lib/format";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";

const defaults = {
  vehiculoId: 0,
  nombreCliente: "",
  telefonoCliente: "",
  domicilioCliente: "",
  descripcion: "",
  fechaHoraProgramada: "",
};

export function ServiceScheduleWorkspace() {
  const [vehiculos, setVehiculos] = useState<VehiculoDTO[]>([]);
  const [repuestos, setRepuestos] = useState<RepuestoDTO[]>([]);
  const [form, setForm] = useState(defaults);
  const [parts, setParts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getVehiculos(), getRepuestos()])
      .then(([vehiculosData, repuestosData]) => {
        setVehiculos(vehiculosData);
        setRepuestos(repuestosData);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el formulario.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedVehicle = useMemo(
    () => vehiculos.find((vehiculo) => vehiculo.id === form.vehiculoId),
    [form.vehiculoId, vehiculos],
  );

  const selectedPartsCount = Object.values(parts).filter((value) => value > 0).length;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (!selectedVehicle) {
        throw new Error("Selecciona un vehiculo antes de guardar el service.");
      }

      await createService({
        ...form,
        kilometros: selectedVehicle.kilometros,
        repuestosUsados: Object.entries(parts)
          .filter(([, cantidad]) => cantidad > 0)
          .map(([repuestoId, cantidad]) => ({
            repuestoId: Number(repuestoId),
            cantidad,
          })),
      });

      setMessage("Service programado correctamente.");
      setForm(defaults);
      setParts({});
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo programar el service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage
      eyebrow="Postventa / agenda"
      title="Programa services con el vehiculo y el stock en el mismo flujo"
      description="La orden toma kilometraje del vehiculo registrado y descuenta repuestos solo al confirmar la operacion."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Vehiculos registrados" value={String(vehiculos.length)} />
        <AdminMetricCard label="Repuestos disponibles" value={String(repuestos.length)} tone="success" />
        <AdminMetricCard label="Repuestos seleccionados" value={String(selectedPartsCount)} tone="warning" />
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

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel
          title="Nueva orden"
          description="Datos del cliente, vehiculo y fecha de programacion."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Vehiculo
              <select
                value={form.vehiculoId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    vehiculoId: Number(event.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
              >
                <option value={0}>Selecciona una patente</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.patente} • {vehiculo.marca}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Nombre del cliente"
                value={form.nombreCliente}
                onChange={(value) => setForm((current) => ({ ...current, nombreCliente: value }))}
              />
              <Field
                label="Telefono"
                value={form.telefonoCliente}
                onChange={(value) => setForm((current) => ({ ...current, telefonoCliente: value }))}
              />
            </div>

            <Field
              label="Domicilio"
              value={form.domicilioCliente}
              onChange={(value) => setForm((current) => ({ ...current, domicilioCliente: value }))}
            />

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Fecha y hora programada
              <input
                type="datetime-local"
                value={form.fechaHoraProgramada}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fechaHoraProgramada: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Descripcion
              <textarea
                value={form.descripcion}
                onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              <PlusCircle size={16} />
              Guardar service
            </button>
          </form>
        </AdminPanel>

        <AdminPanel
          title="Repuestos para la orden"
          description="Marca cantidades solo donde haga falta. El sistema valida stock disponible."
        >
          <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando repuestos...
              </div>
            ) : (
              repuestos.map((repuesto) => (
                <div
                  key={repuesto.id}
                  className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 sm:grid-cols-[1fr_130px]"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{repuesto.nombre}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {repuesto.codigo} • stock {formatNumber(repuesto.cantidadDisponible)}
                    </p>
                  </div>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Cantidad
                    <input
                      type="number"
                      min={0}
                      max={repuesto.cantidadDisponible}
                      value={parts[repuesto.id] ?? 0}
                      onChange={(event) =>
                        setParts((current) => ({
                          ...current,
                          [repuesto.id]: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                    />
                  </label>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      </section>
    </AdminPage>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
      />
    </label>
  );
}
