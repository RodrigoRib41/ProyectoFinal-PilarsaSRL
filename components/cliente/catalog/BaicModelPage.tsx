"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Check,
  CirclePlay,
  ExternalLink,
  Gauge,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { BaicModelPageContent } from "@/lib/baic-model-pages";
import { modelLinks } from "@/lib/site-config";

type BaicModelPageProps = {
  model: BaicModelPageContent;
};

const highlightIcons: LucideIcon[] = [Sparkles, Gauge, ShieldCheck];

export function BaicModelPage({ model }: BaicModelPageProps) {
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedGallery = model.gallery[selectedGalleryIndex] ?? {
    src: model.heroImage,
    alt: model.heroAlt,
  };
  const selectedColor = model.colors[selectedColorIndex] ?? {
    name: model.name,
    image: model.heroImage,
  };
  const relatedModels = modelLinks.filter(
    (current) => current.href !== `/modelo/${model.slug}`,
  );

  return (
    <div className="space-y-12 px-4 pb-16 md:space-y-14 md:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="surface-card overflow-hidden p-3 md:p-4">
          <div
            className="relative overflow-hidden rounded-[1.75rem] px-5 py-7 text-white sm:px-6 sm:py-8 md:px-10 md:py-10"
            style={{ backgroundImage: model.heroBackground }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.1),rgba(15,23,42,0.35))]" />
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/70">
                  {model.eyebrow}
                </p>
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
                  BAIC {model.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  {model.headline}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  {model.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
                  >
                    Quiero asesoramiento
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={model.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
                  >
                    {model.officialLabel}
                    <ExternalLink size={16} />
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {model.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 inline-flex max-w-2xl items-start gap-3 rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-4 text-sm leading-6 text-slate-200">
                  <BadgeCheck
                    size={18}
                    className="mt-1 shrink-0"
                    style={{ color: model.heroAccent }}
                  />
                  <p>{model.sourceNote}</p>
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute inset-x-8 bottom-8 top-10 rounded-full blur-3xl"
                  style={{ backgroundColor: model.heroAccent, opacity: 0.28 }}
                />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
                  <div className="rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_rgba(255,255,255,0.03)_70%)] p-4">
                    <Image
                      src={model.heroImage}
                      alt={model.heroAlt}
                      width={1200}
                      height={760}
                      priority
                      className="mx-auto h-auto w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Lectura rapida"
          title={`Por que la ${model.name} se siente distinta`}
          description="Reordenamos lo mejor de cada modelo en una pagina mas clara: presencia, experiencia a bordo y los puntos que mas importan antes de decidir."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {model.highlightCards.map((card, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];

            return (
              <article key={card.title} className="surface-card p-6">
                <div
                  className="mb-4 inline-flex rounded-2xl p-3"
                  style={{
                    backgroundColor: `${model.heroAccent}18`,
                    color: model.heroAccent,
                  }}
                >
                  <Icon size={20} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6">
        <SectionHeader
          eyebrow="Experiencia"
          title="Lo que vale la pena ver en detalle"
          description="Cada bloque combina imagenes locales, datos oficiales y una lectura mas editorial para que la pagina se sienta mas cuidada y mas util."
        />
        {model.features.map((feature, index) => (
          <article key={feature.title} className="surface-card overflow-hidden p-3">
            <div
              className={`grid items-center gap-6 rounded-[1.6rem] bg-slate-50/80 p-4 lg:p-5 ${
                index % 2 === 1 ? "lg:grid-cols-[0.95fr_1.05fr]" : "lg:grid-cols-[1.05fr_0.95fr]"
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative min-h-[240px] overflow-hidden rounded-[1.5rem] bg-slate-950 sm:min-h-[280px]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p
                  className="text-xs uppercase tracking-[0.3em]"
                  style={{ color: model.heroAccent }}
                >
                  Capitulo {index + 1}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                  {feature.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                  {feature.description}
                </p>
                <div className="mt-5 space-y-3">
                  {feature.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <span
                        className="mt-1 inline-flex rounded-full p-1"
                        style={{
                          backgroundColor: `${model.heroAccent}20`,
                          color: model.heroAccent,
                        }}
                      >
                        <Check size={14} />
                      </span>
                      <p className="text-sm leading-7 text-slate-700">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {model.videoSrc ? (
        <section className="mx-auto max-w-7xl">
          <div className="surface-dark p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="inline-flex rounded-2xl p-3"
                style={{
                  backgroundColor: `${model.heroAccent}1f`,
                  color: model.heroAccent,
                }}
              >
                <CirclePlay size={20} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                  Video
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  BAIC {model.name} en movimiento
                </h2>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/40">
              <video
                controls
                playsInline
                preload="metadata"
                poster={model.videoPoster}
                className="aspect-video h-full w-full object-cover"
              >
                <source src={model.videoSrc} type="video/webm" />
                Tu navegador no puede reproducir este video.
              </video>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-dark p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="inline-flex rounded-2xl p-3"
              style={{
                backgroundColor: `${model.heroAccent}1f`,
                color: model.heroAccent,
              }}
            >
              <CarFront size={20} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">
                Galeria
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Mirada rapida del modelo
              </h2>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(255,255,255,0.02)_75%)] sm:min-h-[340px]">
            <Image
              src={selectedGallery.src}
              alt={selectedGallery.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {model.gallery.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setSelectedGalleryIndex(index)}
                aria-pressed={index === selectedGalleryIndex}
                className={`relative overflow-hidden rounded-[1.25rem] border ${
                  index === selectedGalleryIndex
                    ? "border-white/80"
                    : "border-white/10"
                }`}
              >
                <div className="relative aspect-[4/3] bg-white/5">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex rounded-2xl p-3"
                style={{
                  backgroundColor: `${model.heroAccent}18`,
                  color: model.heroAccent,
                }}
              >
                <Gauge size={20} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Ficha resumida
                </p>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Datos para comparar mejor
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {model.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {spec.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card overflow-hidden p-3">
            <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex rounded-2xl p-3"
                  style={{
                    backgroundColor: `${model.heroAccent}18`,
                    color: model.heroAccent,
                  }}
                >
                  <Palette size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Colores
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {selectedColor.name}
                  </h2>
                </div>
              </div>

              <div className="relative mt-5 min-h-[220px] overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white sm:min-h-[250px]">
                <Image
                  src={selectedColor.image}
                  alt={`BAIC ${model.name} color ${selectedColor.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain p-5"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {model.colors.map((color, index) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(index)}
                    aria-pressed={index === selectedColorIndex}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      index === selectedColorIndex
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-xs uppercase tracking-[0.35em]"
              style={{ color: model.heroAccent }}
            >
              Gama BAIC
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Segui explorando otros modelos
            </h2>
          </div>
          <Link
            href="/0km"
            className="text-sm font-semibold text-slate-700 transition hover:text-cyan-700"
          >
            Ver stock 0 km
          </Link>
        </div>

        <div className="grid grid-auto-fit gap-5">
          {relatedModels.map((current) => (
            <Link
              key={current.href}
              href={current.href}
              className="surface-card group overflow-hidden p-4 transition hover:-translate-y-1"
            >
              <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4">
                <Image
                  src={current.image}
                  alt={current.label}
                  width={340}
                  height={180}
                  className="mx-auto h-32 w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Modelo BAIC
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                    {current.label}
                  </h3>
                </div>
                <ArrowRight
                  size={18}
                  className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-700"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="surface-card overflow-hidden p-3 md:p-4">
          <div
            className="rounded-[1.75rem] px-6 py-8 text-white md:px-10 md:py-10"
            style={{
              backgroundImage: `linear-gradient(135deg, ${model.heroAccent}22, rgba(15, 23, 42, 0.04)), linear-gradient(135deg, #0f172a 0%, #111827 100%)`,
            }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Siguiente paso
            </p>
            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
                  Si la BAIC {model.name} te cierra, coordinemos una consulta con mas contexto y disponibilidad real.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                  Podemos ayudarte a revisar versiones, equipamiento y opciones comerciales sin que tengas que saltar entre paginas dispersas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 sm:w-auto"
                >
                  Hablar con un asesor
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={model.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
                >
                  Abrir ficha oficial
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
        {description}
      </p>
    </div>
  );
}
