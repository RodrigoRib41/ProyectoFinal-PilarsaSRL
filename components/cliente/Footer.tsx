import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { socialLinks } from "@/lib/site-config";

const socialIcons: Record<(typeof socialLinks)[number]["key"], LucideIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: MessageCircle,
};

export default function Footer() {
  return (
    <footer className="mt-20 px-4 pb-8 md:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.8fr_0.8fr] md:px-10">
          <div>
            <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <Image
                src="/logoVarios/logoPilarsaagua.png"
                alt="Pilarsa"
                width={150}
                height={50}
              />
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Venta de unidades BAIC, stock 0 km, usados seleccionados y
              postventa oficial con seguimiento operativo para cada cliente.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Navegacion
            </p>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-slate-300 hover:text-white">
                Inicio
              </Link>
              <Link href="/0km" className="block text-sm text-slate-300 hover:text-white">
                Catalogo 0 km
              </Link>
              <Link href="/usados" className="block text-sm text-slate-300 hover:text-white">
                Catalogo de usados
              </Link>
              <Link
                href="/promociones"
                className="block text-sm text-slate-300 hover:text-white"
              >
                Promociones activas
              </Link>
              <Link href="/service" className="block text-sm text-slate-300 hover:text-white">
                Service y repuestos
              </Link>
              <Link href="/contacto" className="block text-sm text-slate-300 hover:text-white">
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Contacto
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-cyan-300" />
                Ruta operativa y atencion comercial en Entre Rios.
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-cyan-300" />
                343-4982440
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {socialLinks.map((item) => {
                  const Icon = socialIcons[item.key];

                  if (!item.href) {
                    return (
                      <div key={item.key} className="text-center">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
                          <Icon size={18} />
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-300">{item.label}</p>
                        <p className="mt-1 text-[11px] text-rose-300">{item.unavailableMessage}</p>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      aria-label={
                        item.key === "whatsapp"
                          ? "Abrir chat directo de WhatsApp"
                          : `Abrir ${item.label} en una nueva pestana`
                      }
                      className="text-center"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-white">
                        <Icon size={18} />
                      </span>
                      <span className="mt-2 block text-xs font-medium text-slate-300">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
