import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, BarChart3, CarFront, ReceiptText, UserCog, Wrench } from "lucide-react";
import { authOptions } from "@/lib/auth/options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  const cards = [
    {
      title: "Stock de usados",
      description: "Publica, corrige y retira seminuevos en un flujo dedicado.",
      href: "/admin/agregarAutoUsado",
      icon: CarFront,
      accent: "from-sky-500/20 to-cyan-400/10",
    },
    {
      title: "Stock 0 km",
      description: "Gestiona unidades nuevas con un modulo separado del catalogo usado.",
      href: "/admin/agregarAuto0km",
      icon: CarFront,
      accent: "from-indigo-500/20 to-blue-400/10",
    },
    {
      title: "Servicios",
      description: "Programa turnos, controla repuestos y mantiene el historial operativo.",
      href: "/admin/agregarServicios",
      icon: Wrench,
      accent: "from-amber-500/20 to-orange-400/10",
    },
    {
      title: "Finanzas",
      description: "Registra compras y ventas con impacto directo sobre el balance.",
      href: "/admin/balance",
      icon: ReceiptText,
      accent: "from-emerald-500/20 to-lime-400/10",
    },
    ...(isSuperAdmin
      ? [
          {
            title: "Usuarios internos",
            description: "Gestiona accesos internos, contrasenas iniciales y estado de cuentas.",
            href: "/admin/usuarios",
            icon: UserCog,
            accent: "from-fuchsia-500/20 to-violet-400/10",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 px-4 py-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.35)] sm:px-6 sm:py-8 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Plataforma operativa
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Una base administrativa mas consistente para crecer sin volver a improvisar.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              El panel ahora puede apoyarse en APIs tipadas, validaciones unificadas y
              una capa de dominio que desacopla el frontend del esquema heredado.
            </p>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-2 inline-flex rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                <BarChart3 size={18} />
              </div>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-slate-400">frentes operativos unificados</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-2xl font-semibold">100%</p>
              <p className="text-sm text-slate-400">APIs normalizadas y listas para evolucionar</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-2xl font-semibold">1</p>
              <p className="text-sm text-slate-400">shell visual para toda la operacion</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_90px_rgba(15,23,42,0.14)]"
            >
              <div
                className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${card.accent} p-3 text-slate-900`}
              >
                <Icon size={22} />
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                Entrar al modulo
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
