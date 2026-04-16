"use client";

import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { deleteService, getServices, updateService } from "@/lib/api/admin";
import type { ServiceDTO } from "@/lib/domain/contracts";
import { formatDateTime } from "@/lib/format";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";

const editDefaults = {
  nombreCliente: "",
  telefonoCliente: "",
  domicilioCliente: "",
  descripcion: "",
  kilometros: 0,
  estado: "Pendiente",
};

export function ServiceOrdersWorkspace() {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [edit, setEdit] = useState(editDefaults);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las ordenes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const selected = services.find((item) => item.id === selectedId);
    if (!selected) {
      setEdit(editDefaults);
      return;
    }

    setEdit({
      nombreCliente: selected.nombreCliente,
      telefonoCliente: selected.telefonoCliente,
      domicilioCliente: selected.domicilioCliente,
      descripcion: selected.descripcion,
      kilometros: selected.kilometros,
      estado: selected.estado,
    });
  }, [selectedId, services]);

  const pending = services.filter((item) => item.estado === "Pendiente").length;

  async function handleUpdate() {
    if (!selectedId) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      await updateService(selectedId, edit);
      setMessage("Service actualizado correctamente.");
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar el service.");
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
      await deleteService(selectedId);
      setMessage("Service eliminado correctamente.");
      setSelectedId(null);
      await refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo eliminar el service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage
      eyebrow="Postventa / ordenes"
      title="Gestiona la cartera de services desde un solo panel"
      description="Edita datos del cliente, estado y kilometraje con una vista mas clara de cada orden registrada."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Ordenes totales" value={String(services.length)} />
        <AdminMetricCard label="Pendientes" value={String(pending)} tone="warning" />
        <AdminMetricCard label="Realizadas" value={String(services.length - pending)} tone="success" />
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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel
          title="Listado de ordenes"
          description="Selecciona una para editar o eliminar."
        >
          <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando services...
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No hay services cargados.
              </div>
            ) : (
              services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedId(service.id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    selectedId === service.id
                      ? "border-cyan-400 bg-cyan-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-lg font-semibold text-slate-950">
                    {service.vehiculo?.patente ?? "Sin patente"} • {service.nombreCliente}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(service.fechaHoraProgramada)} • {service.estado}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.descripcion}</p>
                </button>
              ))
            )}
          </div>
        </AdminPanel>

        <AdminPanel
          title="Edicion rapida"
          description="Se habilita cuando eliges una orden del listado."
        >
          <div className="space-y-4">
            <Field
              label="Nombre del cliente"
              value={edit.nombreCliente}
              onChange={(value) => setEdit((current) => ({ ...current, nombreCliente: value }))}
            />
            <Field
              label="Telefono"
              value={edit.telefonoCliente}
              onChange={(value) => setEdit((current) => ({ ...current, telefonoCliente: value }))}
            />
            <Field
              label="Domicilio"
              value={edit.domicilioCliente}
              onChange={(value) => setEdit((current) => ({ ...current, domicilioCliente: value }))}
            />
            <Field
              label="Kilometros"
              value={String(edit.kilometros)}
              type="number"
              onChange={(value) => setEdit((current) => ({ ...current, kilometros: Number(value) }))}
            />
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Estado
              <select
                value={edit.estado}
                onChange={(event) => setEdit((current) => ({ ...current, estado: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Realizado">Realizado</option>
              </select>
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Descripcion
              <textarea
                value={edit.descripcion}
                onChange={(event) => setEdit((current) => ({ ...current, descripcion: event.target.value }))}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={!selectedId || submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
              >
                <Save size={16} />
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedId || submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Eliminar service
              </button>
            </div>
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
