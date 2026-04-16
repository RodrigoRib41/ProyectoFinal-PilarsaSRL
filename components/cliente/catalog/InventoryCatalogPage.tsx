"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Filter, Search, Sparkles } from "lucide-react";
import { getAutos } from "@/lib/api/admin";
import { subscribeCatalogChanges } from "@/lib/browser/catalog-sync";
import {
  getInventoryDetailHref,
  matchesInventoryModule,
  type InventoryModule,
} from "@/lib/autos/inventory";
import type { AutoDTO } from "@/lib/domain/contracts";
import { formatCurrency, formatNumber } from "@/lib/format";

type InventoryCatalogPageProps = {
  module: InventoryModule;
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  detailBasePath?: string;
  getDetailHref?: (auto: AutoDTO) => string;
  enableModelFilter?: boolean;
  enableYearFilter?: boolean;
  forceZeroKilometers?: boolean;
  defaultPromosOnly?: boolean;
  lockPromosOnly?: boolean;
};

export function InventoryCatalogPage({
  module,
  eyebrow,
  title,
  description,
  emptyMessage,
  detailBasePath,
  getDetailHref,
  enableModelFilter = false,
  enableYearFilter = false,
  forceZeroKilometers = false,
  defaultPromosOnly = false,
  lockPromosOnly = false,
}: InventoryCatalogPageProps) {
  const [autos, setAutos] = useState<AutoDTO[]>([]);
  const [query, setQuery] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [soloPromos, setSoloPromos] = useState(defaultPromosOnly);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAutos(options?: { silent?: boolean }) {
      if (!options?.silent && mounted) {
        setLoading(true);
      }

      try {
        const data = await getAutos();
        if (mounted) {
          setAutos(data);
        }
      } finally {
        if (!options?.silent && mounted) {
          setLoading(false);
        }
      }
    }

    loadAutos()
      .catch(() => undefined)
      .finally(() => undefined);

    const unsubscribe = subscribeCatalogChanges(() => {
      if (!mounted) {
        return;
      }

      loadAutos({ silent: true }).catch(() => undefined);
    });
    const interval = window.setInterval(() => {
      if (!mounted) {
        return;
      }

      loadAutos({ silent: true }).catch(() => undefined);
    }, 15000);

    return () => {
      mounted = false;
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  const scopedAutos = useMemo(
    () => autos.filter((auto) => matchesInventoryModule(auto.categoria, module)),
    [autos, module],
  );

  const marcas = useMemo(
    () =>
      [...new Set(scopedAutos.map((auto) => auto.marca))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [scopedAutos],
  );

  const modelos = useMemo(() => {
    return [
      ...new Set(
        scopedAutos
          .filter((auto) => (marca ? auto.marca === marca : true))
          .map((auto) => auto.modelo),
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [scopedAutos, marca]);

  const anios = useMemo(() => {
    return [
      ...new Set(
        scopedAutos
          .filter((auto) => (marca ? auto.marca === marca : true))
          .filter((auto) => (modelo ? auto.modelo === modelo : true))
          .map((auto) => auto.anio),
      ),
    ].sort((a, b) => b - a);
  }, [scopedAutos, marca, modelo]);

  useEffect(() => {
    if (modelo && !modelos.includes(modelo)) {
      setModelo("");
    }
  }, [modelo, modelos]);

  useEffect(() => {
    if (anio && !anios.some((current) => String(current) === anio)) {
      setAnio("");
    }
  }, [anio, anios]);

  const autosFiltrados = useMemo(() => {
    return scopedAutos.filter((auto) => {
      const matchesQuery = `${auto.marca} ${auto.modelo} ${auto.version}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesMarca = marca ? auto.marca === marca : true;
      const matchesModelo = modelo ? auto.modelo === modelo : true;
      const matchesAnio = anio ? auto.anio === Number(anio) : true;
      const matchesPromo = soloPromos ? (auto.precioPromocional ?? 0) > 0 : true;
      return matchesQuery && matchesMarca && matchesModelo && matchesAnio && matchesPromo;
    });
  }, [scopedAutos, anio, marca, modelo, query, soloPromos]);

  const resolveDetailHref = (auto: AutoDTO) => {
    if (getDetailHref) {
      return getDetailHref(auto);
    }

    if (detailBasePath) {
      return `${detailBasePath}/${auto.id}`;
    }

    return getInventoryDetailHref(auto.categoria, auto.id);
  };

  return (
    <div className="space-y-8 px-4 pb-12 md:space-y-10 md:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="surface-dark px-5 py-8 sm:px-7 sm:py-10 md:px-10">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="surface-card p-4 sm:p-5">
          <div
            className={
              enableModelFilter || enableYearFilter
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.15fr_0.8fr_0.8fr_0.7fr_auto]"
                : "grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_auto]"
            }
          >
            <label className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por marca, modelo o version"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm"
              />
            </label>

            <label className="relative">
              <Filter
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={marca}
                onChange={(event) => setMarca(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm"
              >
                <option value="">Todas las marcas</option>
                {marcas.map((current) => (
                  <option key={current} value={current}>
                    {current}
                  </option>
                ))}
              </select>
            </label>

            {enableModelFilter ? (
              <label className="relative">
                <Filter
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={modelo}
                  onChange={(event) => setModelo(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm"
                >
                  <option value="">Todos los modelos</option>
                  {modelos.map((current) => (
                    <option key={current} value={current}>
                      {current}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {enableYearFilter ? (
              <label className="relative">
                <Filter
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={anio}
                  onChange={(event) => setAnio(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm"
                >
                  <option value="">Todos los años</option>
                  {anios.map((current) => (
                    <option key={current} value={String(current)}>
                      {current}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {lockPromosOnly ? (
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950">
                <Sparkles size={16} />
                Solo promociones activas
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSoloPromos((value) => !value)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:w-auto ${
                  soloPromos
                    ? "bg-amber-400 text-slate-950"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                <Sparkles size={16} />
                {soloPromos ? "Viendo promociones" : "Solo promociones"}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        {loading ? (
          <div className="surface-card p-8 text-center text-slate-500">
            Cargando catalogo...
          </div>
        ) : autosFiltrados.length === 0 ? (
          <div className="surface-card p-8 text-center text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {autosFiltrados.map((auto) => (
              <article
                key={auto.id}
                className={`surface-card overflow-hidden p-4 transition hover:-translate-y-1 sm:p-5 ${
                  auto.precioPromocional && auto.precioPromocional > 0
                    ? "ring-1 ring-amber-300/70"
                    : ""
                }`}
              >
                <div className="relative h-56 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_58%,_#e2e8f0_100%)]">
                  {auto.foto1 ? (
                    <Image
                      src={auto.foto1}
                      alt={`${auto.marca} ${auto.modelo}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {auto.categoria}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      {auto.marca} {auto.modelo}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{auto.version}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right text-sm text-slate-600">
                    <p>{auto.anio}</p>
                    <p>{formatNumber(forceZeroKilometers ? 0 : auto.kilometros)} km</p>
                  </div>
                </div>

                <div className="mt-5">
                  {(auto.precioPromocional ?? 0) > 0 ? (
                    <>
                      <div className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                        {auto.promoDescription || "Promocion activa"}
                      </div>
                      <p className="text-sm text-slate-400 line-through">
                        {formatCurrency(
                          auto.precio,
                          auto.moneda === "U$D" ? "USD" : "ARS",
                        )}
                      </p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {formatCurrency(
                          auto.precioPromocional ?? 0,
                          auto.moneda === "U$D" ? "USD" : "ARS",
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-semibold text-slate-950">
                      {formatCurrency(
                        auto.precio,
                        auto.moneda === "U$D" ? "USD" : "ARS",
                      )}
                    </p>
                  )}
                </div>

                <Link
                  href={resolveDetailHref(auto)}
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:w-auto"
                >
                  Ver detalle
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
