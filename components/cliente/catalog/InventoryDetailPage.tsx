"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAutoById } from "@/lib/api/admin";
import { subscribeCatalogChanges } from "@/lib/browser/catalog-sync";
import {
  matchesInventoryModule,
  type InventoryModule,
} from "@/lib/autos/inventory";
import type { AutoDTO } from "@/lib/domain/contracts";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

type InventoryDetailPageProps = {
  module: InventoryModule;
  listingHref: string;
  listingLabel: string;
  forceZeroKilometers?: boolean;
};

export function InventoryDetailPage({
  module,
  listingHref,
  listingLabel,
  forceZeroKilometers = false,
}: InventoryDetailPageProps) {
  const params = useParams<{ id: string }>();
  const [auto, setAuto] = useState<AutoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const rawId = params?.id;
    const id = Number(rawId);

    if (!rawId || Number.isNaN(id)) {
      setLoading(false);
      setAuto(null);
      return () => {
        mounted = false;
      };
    }

    async function loadAuto(options?: { silent?: boolean }) {
      if (!options?.silent && mounted) {
        setLoading(true);
      }

      try {
        const data = await getAutoById(id);
        if (!mounted) {
          return;
        }

        if (matchesInventoryModule(data.categoria, module)) {
          setAuto(data);
          return;
        }

        setAuto(null);
      } catch {
        if (mounted) {
          setAuto(null);
        }
      } finally {
        if (mounted && !options?.silent) {
          setLoading(false);
        }
      }
    }

    loadAuto().catch(() => undefined);

    const unsubscribe = subscribeCatalogChanges(() => {
      if (!mounted) {
        return;
      }

      loadAuto({ silent: true }).catch(() => undefined);
    });
    const interval = window.setInterval(() => {
      if (!mounted) {
        return;
      }

      loadAuto({ silent: true }).catch(() => undefined);
    }, 15000);

    return () => {
      mounted = false;
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [module, params?.id]);

  useEffect(() => {
    setImageIndex(0);
  }, [auto?.id]);

  const fotos = useMemo(() => auto?.fotos ?? [], [auto?.fotos]);

  if (loading) {
    return (
      <div className="px-4 py-16 text-center text-slate-500">
        Cargando unidad...
      </div>
    );
  }

  if (!auto) {
    return (
      <div className="px-4 py-16 text-center text-slate-500">
        No encontramos esta unidad.
      </div>
    );
  }

  const nextImage = () => setImageIndex((current) => (current + 1) % fotos.length);
  const previousImage = () =>
    setImageIndex((current) => (current - 1 + fotos.length) % fotos.length);

  return (
    <div className="space-y-6 px-4 pb-12 md:space-y-8 md:px-6">
      <section className="mx-auto max-w-7xl">
        <Link
          href={listingHref}
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
        >
          {listingLabel}
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card overflow-hidden p-3 sm:p-4">
          <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f8fafc_60%,_#e2e8f0_100%)] sm:h-[360px] lg:h-[420px]">
            {fotos.length > 0 ? (
              <>
                <Image
                  src={fotos[imageIndex]}
                  alt={`${auto.marca} ${auto.modelo}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-5 md:p-7"
                />
                {fotos.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white sm:left-4 sm:h-11 sm:w-11"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white sm:right-4 sm:h-11 sm:w-11"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                ) : null}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Sin imagenes disponibles
              </div>
            )}
          </div>

          {fotos.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 pr-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
              {fotos.map((foto, index) => (
                <button
                  type="button"
                  key={foto}
                  onClick={() => setImageIndex(index)}
                  className={`relative h-24 min-w-24 shrink-0 overflow-hidden rounded-2xl border bg-white sm:min-w-0 ${
                    index === imageIndex ? "border-cyan-500" : "border-slate-200"
                  }`}
                >
                  <Image
                    src={foto}
                    alt={`Vista ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="surface-card p-5 sm:p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            {auto.categoria}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
            {auto.marca} {auto.modelo}
          </h1>
          <p className="mt-2 text-base text-slate-500">{auto.version}</p>

          <div className="mt-6 rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white">
            {(auto.precioPromocional ?? 0) > 0 ? (
              <>
                <div className="mb-3 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
                  {auto.promoDescription || "Promocion activa"}
                </div>
                <p className="text-sm text-slate-400 line-through">
                  {formatCurrency(
                    auto.precio,
                    auto.moneda === "U$D" ? "USD" : "ARS",
                  )}
                </p>
                <p className="mt-1 text-3xl font-semibold text-emerald-300">
                  {formatCurrency(
                    auto.precioPromocional ?? 0,
                    auto.moneda === "U$D" ? "USD" : "ARS",
                  )}
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold">
                {formatCurrency(
                  auto.precio,
                  auto.moneda === "U$D" ? "USD" : "ARS",
                )}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-300">
              Publicado el {formatDate(auto.createdAt)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Spec label="Año" value={String(auto.anio)} />
            <Spec
              label="Kilometros"
              value={`${formatNumber(forceZeroKilometers ? 0 : auto.kilometros)} km`}
            />
            <Spec label="Color" value={auto.color} />
            <Spec label="Moneda" value={auto.moneda} />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-950">Descripcion</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {auto.descripcion}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="inline-flex w-full justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 sm:w-auto"
            >
              Me interesa esta unidad
            </Link>
            <Link
              href="/service"
              className="inline-flex w-full justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 sm:w-auto"
            >
              Ver postventa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
