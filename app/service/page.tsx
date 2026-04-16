import Image from "next/image";
import { ShieldCheck, TimerReset, Wrench } from "lucide-react";
import { Toaster } from "sonner";
import ContactoForm from "@/components/cliente/Formulario";

const serviceHighlights = [
  {
    icon: Wrench,
    title: "Tecnicos especializados",
    description: "Diagnostico, mantenimiento y seguimiento con procesos mas claros.",
  },
  {
    icon: ShieldCheck,
    title: "Repuestos originales",
    description: "Stock centralizado para asegurar compatibilidad y tiempos de respuesta.",
  },
  {
    icon: TimerReset,
    title: "Turnos programados",
    description: "Agenda operativa preparada para evitar reprocesos y demoras evitables.",
  },
];

export default function Servicios() {
  return (
    <div className="space-y-10 px-4 pb-12 md:space-y-12 md:px-6">
      <section className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card overflow-hidden p-4">
          <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-slate-950 sm:min-h-[380px] md:min-h-[420px]">
            <Image
              src="/serviceFotos/fotoServicio.jpg"
              alt="Servicios Pilarsa"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/75 to-transparent" />
            <div className="relative z-10 flex h-full items-end p-5 text-white sm:p-8">
              <div className="max-w-lg">
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                  Postventa oficial
                </p>
                <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
                  Service, garantia y repuestos en una experiencia mucho mas clara.
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {serviceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-card p-5 sm:p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-amber-100 p-3 text-amber-800">
                  <Icon size={20} />
                </div>
                <h2 className="text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              image: "/serviceFotos/fotoServicio2.jpg",
              title: "Integridad",
              text: "Repuestos originales y flujo operativo para cada orden de trabajo.",
            },
            {
              image: "/serviceFotos/garantiaImagen.png",
              title: "Garantia",
              text: "Cobertura de 7 años o 100.000 km, alineada con los mejores estandares del segmento.",
            },
            {
              image: "/serviceFotos/fotoServicio3.jpg",
              title: "Cuidado",
              text: "Acompanamiento tecnico para sostener el rendimiento del vehiculo a largo plazo.",
            },
          ].map((item) => (
            <article key={item.title} className="surface-card overflow-hidden p-4">
              <div className="relative h-52 overflow-hidden rounded-[1.5rem] bg-slate-100 sm:h-64">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl">
        <ContactoForm />
      </section>
      <Toaster richColors position="top-right" />
    </div>
  );
}
