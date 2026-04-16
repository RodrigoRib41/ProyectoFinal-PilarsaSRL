import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Toaster } from "sonner";
import ContactoForm from "@/components/cliente/Formulario";
import MapaWrapper from "@/components/cliente/MapaWrapper";

const contactCards = [
  {
    icon: MapPin,
    title: "Sucursal centro",
    description: "3 de Febrero 670, Diamante, Entre Rios",
  },
  {
    icon: MapPin,
    title: "Sucursal Peron",
    description: "Av. Peron y Bv. Quintas y Chacras",
  },
  {
    icon: Phone,
    title: "Telefono",
    description: "343-4982440",
  },
  {
    icon: Mail,
    title: "Email",
    description: "pilarsasrl@gmail.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "3434-694300",
  },
];

export default function ContactoPage() {
  return (
    <div className="space-y-10 px-4 pb-12 md:space-y-12 md:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="surface-dark px-5 py-8 sm:px-7 sm:py-10 md:px-10">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            Contacto comercial
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Un canal mas claro para consultas, ventas, service y seguimiento.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Centralizamos la informacion principal para que el cliente llegue rapido a la
            sucursal correcta y el equipo reciba consultas mejor estructuradas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="surface-card p-5 sm:p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-800">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="surface-card overflow-hidden p-4">
          <MapaWrapper />
        </div>
        <ContactoForm />
      </section>
      <Toaster richColors position="top-right" />
    </div>
  );
}
