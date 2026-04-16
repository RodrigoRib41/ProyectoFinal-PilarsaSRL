"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, Trash2, UploadCloud } from "lucide-react";
import {
  createAuto,
  deleteAuto,
  getAutos,
  updateAuto,
} from "@/lib/api/admin";
import { broadcastCatalogChange } from "@/lib/browser/catalog-sync";
import {
  matchesInventoryModule,
  type InventoryModule,
} from "@/lib/autos/inventory";
import type { AutoDTO } from "@/lib/domain/contracts";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  AdminMetricCard,
  AdminPage,
  AdminPanel,
} from "@/components/admin/AdminPage";

type WorkspaceMode = "create" | "edit" | "delete";
type MediaValue = File | string | null;
type StockInventoryModule = Exclude<InventoryModule, "all">;

type AutoFormState = {
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precio: number;
  precioPromocional: number | null;
  promoDescription: string;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
};

type CategoryOption = {
  value: string;
  label: string;
};

type WorkspaceConfig = {
  module: StockInventoryModule;
  defaultCategory: string;
  categoryOptions: CategoryOption[];
  forceZeroKilometers?: boolean;
  eyebrow: string;
  title: string;
  description: string;
  inventoryTitle: string;
  inventoryDescription: string;
  createTitle: string;
  editTitle: string;
  deleteTitle: string;
  deleteDescription: string;
  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  searchPlaceholder: string;
  emptyInventoryMessage: string;
};

const initialMedia = [null, null, null, null] as MediaValue[];

const workspaceConfigs: Record<StockInventoryModule, WorkspaceConfig> = {
  used: {
    module: "used",
    defaultCategory: "Usado",
    categoryOptions: [{ value: "Usado", label: "Usado" }],
    forceZeroKilometers: false,
    eyebrow: "Stock / usados",
    title: "Gestion centralizada del catalogo de usados",
    description:
      "Publica nuevas unidades usadas, ajusta precios y retira vehiculos desde un mismo workspace con formularios consistentes.",
    inventoryTitle: "Inventario usado publicado",
    inventoryDescription:
      "Filtra y selecciona un usado para editarlo o retirarlo del sitio.",
    createTitle: "Publicar usado",
    editTitle: "Editar usado seleccionado",
    deleteTitle: "Retirar usado",
    deleteDescription:
      "Selecciona un usado del listado y confirma la baja del catalogo publico.",
    createSuccess: "Usado publicado correctamente.",
    updateSuccess: "Usado actualizado correctamente.",
    deleteSuccess: "Usado retirado del catalogo.",
    searchPlaceholder: "Buscar usados por marca, modelo o version",
    emptyInventoryMessage: "No encontramos usados para ese filtro.",
  },
  zeroKm: {
    module: "zeroKm",
    defaultCategory: "0km",
    categoryOptions: [{ value: "0km", label: "0 km" }],
    forceZeroKilometers: true,
    eyebrow: "Stock / 0 km",
    title: "Gestion centralizada del catalogo 0 km",
    description:
      "Gestiona el stock de 0 km con un flujo dedicado para publicar, ajustar y retirar unidades nuevas sin mezclarlas con los usados.",
    inventoryTitle: "Inventario 0 km publicado",
    inventoryDescription:
      "Filtra y selecciona un 0 km para editarlo o retirarlo del sitio.",
    createTitle: "Publicar 0 km",
    editTitle: "Editar 0 km seleccionado",
    deleteTitle: "Retirar 0 km",
    deleteDescription:
      "Selecciona un 0 km del listado y confirma la baja del catalogo publico.",
    createSuccess: "0 km publicado correctamente.",
    updateSuccess: "0 km actualizado correctamente.",
    deleteSuccess: "0 km retirado del catalogo.",
    searchPlaceholder: "Buscar 0 km por marca, modelo o version",
    emptyInventoryMessage: "No encontramos 0 km para ese filtro.",
  },
};

function createDefaultState(defaultCategory: string): AutoFormState {
  return {
    marca: "",
    modelo: "",
    version: "",
    anio: new Date().getFullYear(),
    precio: 0,
    precioPromocional: 0,
    promoDescription: "",
    moneda: "$",
    kilometros: 0,
    color: "",
    categoria: defaultCategory,
    descripcion: "",
  };
}

function AutoInventoryWorkspace({
  mode,
  config,
}: {
  mode: WorkspaceMode;
  config: WorkspaceConfig;
}) {
  const [autos, setAutos] = useState<AutoDTO[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<AutoFormState>(() =>
    createDefaultState(config.defaultCategory),
  );
  const [media, setMedia] = useState<MediaValue[]>(initialMedia);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function loadAutos() {
    setLoading(true);
    try {
      const data = await getAutos();
      setAutos(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar el catalogo.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAutos();
  }, []);

  const inventoryAutos = useMemo(
    () =>
      autos.filter((auto) =>
        matchesInventoryModule(auto.categoria, config.module),
      ),
    [autos, config.module],
  );

  const selectedAuto = useMemo(
    () => inventoryAutos.find((item) => item.id === selectedId) ?? null,
    [inventoryAutos, selectedId],
  );

  useEffect(() => {
    setConfirmDelete(false);
  }, [selectedId, mode]);

  useEffect(() => {
    if (mode === "create") {
      setForm(createDefaultState(config.defaultCategory));
      setMedia(initialMedia);
      return;
    }

    if (!selectedAuto) {
      setForm(createDefaultState(config.defaultCategory));
      setMedia(initialMedia);
      return;
    }

    setForm({
      marca: selectedAuto.marca,
      modelo: selectedAuto.modelo,
      version: selectedAuto.version,
      anio: selectedAuto.anio,
      precio: selectedAuto.precio,
      precioPromocional: selectedAuto.precioPromocional ?? 0,
      promoDescription: selectedAuto.promoDescription ?? "",
      moneda: selectedAuto.moneda,
      kilometros: config.forceZeroKilometers ? 0 : selectedAuto.kilometros,
      color: selectedAuto.color,
      categoria: config.defaultCategory,
      descripcion: selectedAuto.descripcion,
    });
    setMedia([
      selectedAuto.foto1,
      selectedAuto.foto2,
      selectedAuto.foto3,
      selectedAuto.foto4,
    ]);
  }, [config.defaultCategory, config.forceZeroKilometers, mode, selectedAuto]);

  const filteredAutos = useMemo(() => {
    return inventoryAutos.filter((auto) =>
      `${auto.marca} ${auto.modelo} ${auto.version}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [inventoryAutos, query]);

  const metrics = useMemo(() => {
    const promos = inventoryAutos.filter((auto) => auto.precioPromocional).length;
    const average = inventoryAutos.length
      ? inventoryAutos.reduce((acc, auto) => acc + auto.precio, 0) /
        inventoryAutos.length
      : 0;

    return {
      total: inventoryAutos.length,
      promos,
      average,
    };
  }, [inventoryAutos]);

  function resetDraft() {
    setForm(createDefaultState(config.defaultCategory));
    setMedia(initialMedia);
  }

  function handleFieldChange(
    key: keyof AutoFormState,
    value: string | number | null,
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleMediaChange(index: number, value: MediaValue) {
    setMedia((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function buildPayload() {
    const payload = new FormData();
    payload.append("marca", form.marca);
    payload.append("modelo", form.modelo);
    payload.append("version", form.version);
    payload.append("anio", String(form.anio));
    payload.append("precio", String(form.precio));
    payload.append(
      "precioPromocional",
      String(form.precioPromocional ?? 0),
    );
    payload.append("promoDescription", form.promoDescription.trim());
    payload.append("moneda", form.moneda);
    payload.append(
      "kilometros",
      String(config.forceZeroKilometers ? 0 : form.kilometros),
    );
    payload.append("color", form.color);
    payload.append("categoria", config.defaultCategory);
    payload.append("descripcion", form.descripcion);

    media.forEach((item, index) => {
      const key = `foto${index + 1}`;
      if (item instanceof File) {
        payload.append(key, item);
        return;
      }

      if (typeof item === "string") {
        payload.append(key, item);
        return;
      }

      payload.append(key, "");
    });

    return payload;
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await createAuto(buildPayload());
      setMessage(config.createSuccess);
      resetDraft();
      setSelectedId(null);
      await loadAutos();
      broadcastCatalogChange(
        form.precioPromocional && form.precioPromocional > 0
          ? "promotion"
          : "create",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo publicar la unidad.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedAuto) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await updateAuto(selectedAuto.id, buildPayload());
      setMessage(config.updateSuccess);
      await loadAutos();
      broadcastCatalogChange(
        form.precioPromocional && form.precioPromocional > 0
          ? "promotion"
          : "update",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo actualizar la unidad.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedAuto || !confirmDelete) return;
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await deleteAuto(selectedAuto.id);
      setMessage(config.deleteSuccess);
      setSelectedId(null);
      setConfirmDelete(false);
      await loadAutos();
      broadcastCatalogChange("delete");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo eliminar la unidad.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage
      eyebrow={config.eyebrow}
      title={config.title}
      description={config.description}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard
          label="Unidades publicadas"
          value={String(metrics.total)}
        />
        <AdminMetricCard
          label="Promociones activas"
          value={String(metrics.promos)}
          tone="warning"
        />
        <AdminMetricCard
          label="Precio promedio"
          value={formatCurrency(metrics.average || 0)}
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
        <AdminPanel
          title={config.inventoryTitle}
          description={config.inventoryDescription}
        >
          <label className="mb-4 block">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={config.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </label>

          <div className="max-h-[68svh] space-y-3 overflow-y-auto pr-1 sm:max-h-[74svh]">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Cargando unidades...
              </div>
            ) : filteredAutos.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                {config.emptyInventoryMessage}
              </div>
            ) : (
              filteredAutos.map((auto) => (
                <button
                  key={auto.id}
                  type="button"
                  onClick={() => setSelectedId(auto.id)}
                  className={`grid w-full grid-cols-[88px_1fr] gap-3 rounded-[1.5rem] border p-3 text-left transition sm:grid-cols-[108px_1fr] sm:gap-4 ${
                    auto.id === selectedId
                      ? "border-cyan-400 bg-cyan-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="relative h-[5.5rem] overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_58%,_#e2e8f0_100%)] sm:h-24">
                    {auto.foto1 ? (
                      <Image
                        src={auto.foto1}
                        alt={`${auto.marca} ${auto.modelo}`}
                        fill
                        className="object-contain p-2"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {auto.categoria}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-950 sm:text-lg">
                      {auto.marca} {auto.modelo}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {auto.anio} - {formatNumber(auto.kilometros)} km
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {formatCurrency(
                        auto.precio,
                        auto.moneda === "U$D" ? "USD" : "ARS",
                      )}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </AdminPanel>

        <AdminPanel
          title={
            mode === "create"
              ? config.createTitle
              : mode === "edit"
                ? config.editTitle
                : config.deleteTitle
          }
          description={
            mode === "delete"
              ? config.deleteDescription
              : "Completa los datos principales y, si corresponde, actualiza las imagenes."
          }
        >
          {mode === "delete" ? (
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                {selectedAuto ? (
                  <>
                    <p className="text-sm text-slate-500">Unidad seleccionada</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {selectedAuto.marca} {selectedAuto.modelo}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Esta accion elimina la unidad del catalogo publico.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    Selecciona una unidad desde el panel izquierdo.
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(event) => setConfirmDelete(event.target.checked)}
                  disabled={!selectedAuto || submitting}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600"
                />
                <span>
                  Confirmo que quiero retirar esta unidad y que dejara de verse
                  en el catalogo publico.
                </span>
              </label>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedAuto || submitting || !confirmDelete}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {submitting ? "Eliminando..." : "Eliminar unidad"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={mode === "create" ? handleCreate : handleUpdate}
              className="space-y-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Marca"
                  value={form.marca}
                  onChange={(value) => handleFieldChange("marca", value)}
                />
                <Field
                  label="Modelo"
                  value={form.modelo}
                  onChange={(value) => handleFieldChange("modelo", value)}
                />
                <Field
                  label="Version"
                  value={form.version}
                  onChange={(value) => handleFieldChange("version", value)}
                />
                <Field
                  label="Color"
                  value={form.color}
                  onChange={(value) => handleFieldChange("color", value)}
                />
                <Field
                  label="Año"
                  type="number"
                  value={String(form.anio)}
                  onChange={(value) => handleFieldChange("anio", Number(value))}
                />
                <Field
                  label="Kilometros"
                  type="number"
                  value={String(config.forceZeroKilometers ? 0 : form.kilometros)}
                  onChange={(value) =>
                    handleFieldChange("kilometros", Number(value))
                  }
                  disabled={config.forceZeroKilometers}
                  helperText={
                    config.forceZeroKilometers
                      ? "Las unidades 0 km se publican siempre con kilometraje en 0."
                      : undefined
                  }
                />
                <Field
                  label="Precio"
                  type="number"
                  value={String(form.precio)}
                  onChange={(value) => handleFieldChange("precio", Number(value))}
                />
                <Field
                  label="Precio promocional"
                  type="number"
                  value={
                    form.precioPromocional != null && form.precioPromocional > 0
                      ? String(form.precioPromocional)
                      : ""
                  }
                  onChange={(value) =>
                    handleFieldChange(
                      "precioPromocional",
                      value ? Number(value) : 0,
                    )
                  }
                />
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-xl">
                    <p className="text-sm font-medium text-slate-800">
                      Promocion destacada
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Puedes cargar un precio promocional y una descripcion breve
                      para remarcar la oferta en el catalogo publico.
                    </p>
                  </div>
                  {form.precioPromocional != null && form.precioPromocional > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange("precioPromocional", 0);
                        handleFieldChange("promoDescription", "");
                      }}
                      className="inline-flex rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700"
                    >
                      Quitar promocion
                    </button>
                  ) : null}
                </div>

                <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
                  Descripcion promocional
                  <textarea
                    value={form.promoDescription}
                    onChange={(event) =>
                      handleFieldChange("promoDescription", event.target.value)
                    }
                    rows={3}
                    placeholder="Ej. Bonificacion lanzamiento, entrega inmediata o financiacion especial."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal"
                  />
                  <span className="block text-xs text-slate-500">
                    Si el precio promocional queda en 0, esta descripcion no se
                    publica.
                  </span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Moneda
                  <select
                    value={form.moneda}
                    onChange={(event) =>
                      handleFieldChange("moneda", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  >
                    <option value="$">Pesos</option>
                    <option value="U$D">Dolares</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Categoria
                  <select
                    value={form.categoria}
                    onChange={(event) =>
                      handleFieldChange("categoria", event.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  >
                    {config.categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Descripcion
                <textarea
                  value={form.descripcion}
                  onChange={(event) =>
                    handleFieldChange("descripcion", event.target.value)
                  }
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                {media.map((item, index) => (
                  <label
                    key={`media-${index}`}
                    className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                      <UploadCloud size={16} />
                      Imagen {index + 1}
                    </div>

                    <div className="relative mb-3 h-36 overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_58%,_#e2e8f0_100%)] sm:h-40">
                      {item ? (
                        <Image
                          src={item instanceof File ? URL.createObjectURL(item) : item}
                          alt={`Foto ${index + 1}`}
                          fill
                          className="object-contain p-3"
                          unoptimized={item instanceof File}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleMediaChange(index, event.target.files?.[0] ?? null)
                      }
                      className="w-full text-sm"
                    />
                    {item ? (
                      <button
                        type="button"
                        onClick={() => handleMediaChange(index, null)}
                        className="mt-3 inline-flex rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        Quitar imagen
                      </button>
                    ) : null}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting || (mode === "edit" && !selectedAuto)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
              >
                {mode === "create" ? (
                  <Plus size={16} />
                ) : (
                  <PencilLine size={16} />
                )}
                {submitting
                  ? mode === "create"
                    ? "Publicando..."
                    : "Guardando..."
                  : mode === "create"
                    ? "Publicar unidad"
                    : "Guardar cambios"}
              </button>
            </form>
          )}
        </AdminPanel>
      </section>
    </AdminPage>
  );
}

export function UsedCarsWorkspace({ mode }: { mode: WorkspaceMode }) {
  return <AutoInventoryWorkspace mode={mode} config={workspaceConfigs.used} />;
}

export function ZeroKmWorkspace({ mode }: { mode: WorkspaceMode }) {
  return (
    <AutoInventoryWorkspace mode={mode} config={workspaceConfigs.zeroKm} />
  );
}

function Field({
  label,
  value,
  type = "text",
  onChange,
  disabled = false,
  helperText,
}: {
  label: string;
  value: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
      {helperText ? <span className="block text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
}
