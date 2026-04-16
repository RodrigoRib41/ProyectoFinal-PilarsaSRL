"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PlusCircle, Save, Search, Trash2, X } from "lucide-react";
import {
  createRepuesto,
  deleteRepuesto,
  getRepuestos,
  updateRepuesto,
} from "@/lib/api/admin";
import type { RepuestoDTO } from "@/lib/domain/contracts";
import { formatNumber } from "@/lib/format";
import { AdminMetricCard, AdminPage, AdminPanel } from "@/components/admin/AdminPage";

const LOW_STOCK_THRESHOLD = 3;

const defaults = {
  nombre: "",
  codigo: "",
  cantidadDisponible: 0,
  descripcion: "",
};

function isLowStock(cantidadDisponible: number) {
  return cantidadDisponible <= LOW_STOCK_THRESHOLD;
}

function parseQuantityValue(value: string) {
  if (!value.trim()) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function PartsWorkspace() {
  const [repuestos, setRepuestos] = useState<RepuestoDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState(defaults);
  const [editForm, setEditForm] = useState(defaults);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh(options?: { silent?: boolean }) {
    if (!options?.silent) {
      setLoading(true);
    }

    try {
      const data = await getRepuestos();
      setRepuestos(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los repuestos.");
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  useEffect(() => {
    const selected = repuestos.find((item) => item.id === selectedId);
    if (!selected) {
      setEditForm(defaults);
      setConfirmDelete(false);
      return;
    }

    setEditForm({
      nombre: selected.nombre,
      codigo: selected.codigo,
      cantidadDisponible: selected.cantidadDisponible,
      descripcion: selected.descripcion ?? "",
    });
    setConfirmDelete(false);
  }, [repuestos, selectedId]);

  const filteredRepuestos = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    if (!normalizedQuery) {
      return repuestos;
    }

    return repuestos.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(normalizedQuery) ||
        item.codigo.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [repuestos, search]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createRepuesto({
        ...createForm,
        descripcion: createForm.descripcion || null,
      });
      setMessage("Repuesto creado correctamente.");
      setCreateForm(defaults);
      await refresh({ silent: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el repuesto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!selectedId) {
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await updateRepuesto(selectedId, {
        ...editForm,
        descripcion: editForm.descripcion || null,
      });
      setMessage("Repuesto actualizado correctamente.");
      await refresh({ silent: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar el repuesto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedId || !confirmDelete) {
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await deleteRepuesto(selectedId);
      setMessage("Repuesto eliminado correctamente.");
      setSelectedId(null);
      setConfirmDelete(false);
      await refresh({ silent: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo eliminar el repuesto.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage
      eyebrow="Postventa / repuestos"
      title="Stock de repuestos con una gestion mas ordenada"
      description="Alta, busqueda, edicion inline y limpieza del catalogo en un mismo lugar para sostener la agenda del taller."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Items activos" value={String(repuestos.length)} />
        <AdminMetricCard
          label="Con stock bajo"
          value={String(repuestos.filter((item) => isLowStock(item.cantidadDisponible)).length)}
          tone="warning"
        />
        <AdminMetricCard
          label="Stock saludable"
          value={String(repuestos.filter((item) => !isLowStock(item.cantidadDisponible)).length)}
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
        <AdminPanel title="Alta de repuestos" description="Carga nuevos items al catalogo operativo.">
          <form onSubmit={handleCreate} className="space-y-4">
            <Field
              label="Nombre"
              value={createForm.nombre}
              onChange={(value) => setCreateForm((current) => ({ ...current, nombre: value }))}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Codigo"
                value={createForm.codigo}
                onChange={(value) =>
                  setCreateForm((current) => ({ ...current, codigo: value.toUpperCase() }))
                }
              />
              <Field
                label="Cantidad disponible"
                type="number"
                value={String(createForm.cantidadDisponible)}
                onChange={(value) =>
                  setCreateForm((current) => ({
                    ...current,
                    cantidadDisponible: parseQuantityValue(value),
                  }))
                }
              />
            </div>
            <TextAreaField
              label="Descripcion"
              value={createForm.descripcion}
              onChange={(value) => setCreateForm((current) => ({ ...current, descripcion: value }))}
              rows={4}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              <PlusCircle size={16} />
              Crear repuesto
            </button>
          </form>
        </AdminPanel>

        <AdminPanel
          title="Catalogo actual"
          description="Busca por nombre o codigo, selecciona un item y editalo en la misma tarjeta."
        >
          <div className="mb-4">
            <label className="relative block">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o codigo"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm"
              />
            </label>
          </div>

          <div className="max-h-[72svh] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando repuestos...
              </div>
            ) : filteredRepuestos.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No encontramos repuestos para esa busqueda.
              </div>
            ) : (
              filteredRepuestos.map((repuesto) => {
                const selected = selectedId === repuesto.id;
                const lowStock = isLowStock(repuesto.cantidadDisponible);

                return (
                  <article
                    key={repuesto.id}
                    className={`rounded-[1.5rem] border p-4 transition ${
                      selected
                        ? "border-cyan-400 bg-cyan-50"
                        : lowStock
                          ? "border-amber-300 bg-amber-50/60"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(repuesto.id);
                        setMessage(null);
                        setError(null);
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-slate-950">{repuesto.nombre}</p>
                            {lowStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                                <AlertTriangle size={12} />
                                Stock bajo
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                                Stock ok
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{repuesto.codigo}</p>
                          {repuesto.descripcion ? (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {repuesto.descripcion}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm italic text-slate-400">
                              Sin descripcion cargada.
                            </p>
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                            lowStock
                              ? "bg-amber-100 text-amber-900"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          stock {formatNumber(repuesto.cantidadDisponible)}
                        </div>
                      </div>
                    </button>

                    {selected ? (
                      <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Nombre"
                            value={editForm.nombre}
                            onChange={(value) =>
                              setEditForm((current) => ({ ...current, nombre: value }))
                            }
                          />
                          <Field
                            label="Codigo"
                            value={editForm.codigo}
                            onChange={(value) =>
                              setEditForm((current) => ({
                                ...current,
                                codigo: value.toUpperCase(),
                              }))
                            }
                          />
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                          <Field
                            label="Cantidad disponible"
                            type="number"
                            value={String(editForm.cantidadDisponible)}
                            onChange={(value) =>
                              setEditForm((current) => ({
                                ...current,
                                cantidadDisponible: parseQuantityValue(value),
                              }))
                            }
                          />
                          <TextAreaField
                            label="Descripcion"
                            value={editForm.descripcion}
                            onChange={(value) =>
                              setEditForm((current) => ({ ...current, descripcion: value }))
                            }
                            rows={3}
                          />
                        </div>

                        <label className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          <input
                            type="checkbox"
                            checked={confirmDelete}
                            onChange={(event) => setConfirmDelete(event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-rose-300 text-rose-600"
                          />
                          <span>Confirmo que quiero eliminar este repuesto del catalogo.</span>
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
                          >
                            <Save size={16} />
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedId(null);
                              setConfirmDelete(false);
                              setMessage(null);
                              setError(null);
                            }}
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            <X size={16} />
                            Cerrar
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={submitting || !confirmDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })
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

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
      />
    </label>
  );
}
