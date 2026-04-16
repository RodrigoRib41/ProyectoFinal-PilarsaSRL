import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CarFront, ShieldCheck, Wrench } from "lucide-react";
import { modelLinks } from "@/lib/site-config";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Respaldo oficial BAIC",
    description: "Asesoramiento comercial y postventa con foco en continuidad operativa.",
  },
  {
    icon: Wrench,
    title: "Service con trazabilidad",
    description: "Turnos, repuestos y seguimiento integrados en un flujo mas ordenado.",
  },
  {
    icon: CarFront,
    title: "0 km y usados bien separados",
    description:
      "Dos recorridos publicos distintos para encontrar unidades nuevas o seminuevas con menos ruido.",
  },
];

export default function Home() {
  return (
    <div className="space-y-12 px-4 pb-12 md:space-y-16 md:px-6">
      <section className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-dark overflow-hidden px-5 py-8 sm:px-7 sm:py-10 md:px-10">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            Pilarsa SRL
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
            Experiencia comercial y postventa para una marca que quiere crecer en serio.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Reordenamos el recorrido del cliente y la operacion interna para que el sitio
            se vea mejor, comunique mejor y soporte una administracion mucho mas consistente.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/0km"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 sm:w-auto"
            >
              Ver 0 km disponibles
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/usados"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white sm:w-auto"
            >
              Ver usados seleccionados
            </Link>
            <Link
              href="/promociones"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 sm:w-auto"
            >
              Ver promociones activas
            </Link>
            <Link
              href="/service"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white sm:w-auto"
            >
              Conocer postventa
            </Link>
          </div>
        </div>

        <div className="surface-card overflow-hidden p-4">
          <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,_rgba(8,47,73,0.96),_rgba(14,116,144,0.9)),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_35%)] p-5 text-white sm:min-h-[380px] sm:p-6 md:min-h-[420px]">
            <div className="relative z-10 max-w-sm">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                <BadgeCheck size={14} />
                BAIC official point
              </p>
              <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-3xl">
                Una presencia digital con mas claridad, mas marca y mejor conversion.
              </h2>
            </div>
            <div className="absolute inset-x-0 bottom-0">
              <Image
                src="/homePilarsaSection/fotoMecanicoGen.webp"
                alt="Pilarsa"
                width={900}
                height={560}
                className="h-[260px] w-full object-cover object-center opacity-85 mix-blend-screen"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Modelos</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              El lineup BAIC con una lectura mas limpia
            </h2>
          </div>
          <Link href="/contacto" className="text-sm font-semibold text-slate-700 hover:text-cyan-700">
            Pedir asesoramiento
          </Link>
        </div>
        <div className="grid grid-auto-fit gap-5">
          {modelLinks.map((model) => (
            <Link
              key={model.href}
              href={model.href}
              className="surface-card group p-5 transition hover:-translate-y-1"
            >
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <Image
                  src={model.image}
                  alt={model.label}
                  width={280}
                  height={150}
                  className="mx-auto h-32 w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Modelo</p>
                  <h3 className="text-xl font-semibold text-slate-950">{model.label}</h3>
                </div>
                <ArrowRight size={18} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-700" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="surface-card p-5 sm:p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-800">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
