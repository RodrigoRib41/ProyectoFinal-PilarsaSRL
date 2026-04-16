"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { adminNavigation } from "@/lib/site-config";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Sidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sections = useMemo(
    () =>
      adminNavigation
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.superAdminOnly || isSuperAdmin),
        }))
        .filter((section) => section.items.length > 0),
    [isSuperAdmin],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-slate-950 text-white shadow-2xl sm:left-4 sm:top-4 md:hidden"
        aria-label="Abrir menu administrativo"
        aria-expanded={open}
      >
        <Menu size={20} />
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menu"
        />
      ) : null}

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-slate-100 shadow-[0_32px_120px_rgba(15,23,42,0.45)] transition-transform duration-300 md:relative md:w-[17rem] md:max-w-none md:translate-x-0 lg:w-[18rem]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Pilarsa
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
              <Image
                src="/logoVarios/logoPilarsa.png"
                alt="Pilarsa"
                width={42}
                height={42}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Control Center
              </p>
              <p className="text-lg font-semibold">Pilarsa Admin</p>
            </div>
          </Link>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              <ShieldCheck size={14} />
              Sesion activa
            </div>
            <p className="text-sm font-semibold">Panel protegido</p>
            <p className="mt-1 text-sm text-slate-400">
              Acceso controlado por NextAuth y middleware.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 md:py-5">
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
            <LayoutDashboard size={16} />
            Operacion diaria centralizada
          </div>

          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cx(
                          "group flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition",
                          active
                            ? "bg-white text-slate-950 shadow-lg"
                            : "text-slate-300 hover:bg-white/6 hover:text-white",
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          className={cx(
                            "h-2.5 w-2.5 rounded-full transition",
                            active ? "bg-cyan-500" : "bg-slate-700 group-hover:bg-slate-500",
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}
