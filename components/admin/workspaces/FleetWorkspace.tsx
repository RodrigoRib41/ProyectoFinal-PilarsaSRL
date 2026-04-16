"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import {
  createVehiculo,
  deleteVehiculo,
  getVehiculos,
  updateVehiculo,
} from "@/lib/api/admin";
import type { VehiculoDTO } from "@/lib/domain/contracts";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";

const defaults = {
  patente: "",
  marca: "",
  version: "",
  anio: new Date().getFullYear(),
  kilometros: 0,
};

export function FleetWorkspace() {
  const [vehiculos, setVehiculos] = useState<VehiculoDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getVehiculos();
      setVehiculos(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los vehiculos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const selected = vehiculos.find((item) => item.id === selectedId);
    if (!selected) {
      setForm(defaults);
      return;
    }

    setForm({
      patente: selected.patente,
      marca: selected.marca,
      version: selected.version,
      anio: selected.anio,
      kilometros: selected.kilometros,
    });
  }, [selectedId, vehiculos]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await createVehiculo(form);
      setMessage("Vehiculo registrado correctamente.");
      setForm(defaults);
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar el vehiculo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!selectedId) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await updateVehiculo(selectedId, form);
      setMessage("Vehiculo actualizado correctamente.");
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar el vehiculo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await deleteVehiculo(selectedId);
      setMessage("Vehiculo eliminado correctamente.");
      setSelectedId(null);
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo eliminar el vehiculo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage
      eyebrow="Postventa / vehiculos"
      title="Parque vehicular listo para relacionar con services"
      description="Centraliza el alta y el mantenimiento de vehiculos sin duplicar formularios."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Vehiculos registrados" value={String(vehiculos.length)} />
        <AdminMetricCard
          label="Con historial de services"
          value={String(vehiculos.filter((item) => (item.totalServices ?? 0) > 0).length)}
          tone="warning"
        />
        <AdminMetricCard
          label="Disponibles para agenda"
          value={String(vehiculos.filter((item) => (item.totalServices ?? 0) === 0).length)}
          tone="success"
        />
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

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminPanel title="Alta de vehiculos" description="Carga nuevas unidades para el taller.">
          <form onSubmit={handleCreate} className="space-y-4">
            <Field
              label="Patente"
              value={form.patente}
              onChange={(value) => setForm((current) => ({ ...current, patente: value.toUpperCase() }))}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Marca"
                value={form.marca}
                onChange={(value) => setForm((current) => ({ ...current, marca: value }))}
              />
              <Field
                label="Version"
                value={form.version}
                onChange={(value) => setForm((current) => ({ ...current, version: value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Año"
                type="number"
                value={String(form.anio)}
                onChange={(value) => setForm((current) => ({ ...current, anio: Number(value) }))}
              />
              <Field
                label="Kilometros"
                type="number"
                value={String(form.kilometros)}
                onChange={(value) => setForm((current) => ({ ...current, kilometros: Number(value) }))}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              <PlusCircle size={16} />
              Registrar vehiculo
            </button>
          </form>
        </AdminPanel>

        <AdminPanel
          title="Vehiculos cargados"
          description="Selecciona uno para actualizarlo o eliminarlo."
        >
          <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando vehiculos...
              </div>
            ) : (
              vehiculos.map((vehiculo) => (
                <button
                  type="button"
                  key={vehiculo.id}
                  onClick={() => setSelectedId(vehiculo.id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    selectedId === vehiculo.id
                      ? "border-cyan-400 bg-cyan-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{vehiculo.patente}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {vehiculo.marca} • {vehiculo.version}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                      {vehiculo.anio}
                    </div>
                  </div>
                  {selectedId === vehiculo.id ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
                      >
                        <Save size={16} />
                        Guardar cambios
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  ) : null}
                </button>
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
      />
    </label>
  );
}
