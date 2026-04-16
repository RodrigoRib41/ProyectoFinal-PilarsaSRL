"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { modelLinks, publicNavItems } from "@/lib/site-config";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      setDropdownOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 py-2.5 sm:px-3 sm:py-3 md:px-5">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/60 bg-white/80 px-3.5 py-3 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:rounded-[1.75rem] sm:px-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950/5 p-2 ring-1 ring-slate-950/5">
              <Image
                src="/logoVarios/logoPilarsa.png"
                alt="Pilarsa"
                width={84}
                height={30}
                className="h-auto w-[84px] sm:w-[92px]"
              />
            </div>
            <div className="hidden md:block">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">
                Concesionario oficial
              </p>
              <p className="text-sm font-medium text-slate-600">BAIC y postventa integral</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 lg:flex">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-950 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((value) => !value)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                <Sparkles size={15} />
                Modelos BAIC
              </button>

              {dropdownOpen ? (
                <div className="absolute right-0 top-full pt-3">
                  <div className="w-[640px] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.14)]">
                    <div className="grid grid-cols-3 gap-3">
                      {modelLinks.map((model) => (
                        <Link
                          key={model.href}
                          href={model.href}
                          onClick={() => setDropdownOpen(false)}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50"
                        >
                          <Image
                            src={model.image}
                            alt={model.label}
                            width={180}
                            height={100}
                            className="mx-auto h-20 w-full object-contain"
                          />
                          <p className="mt-3 text-center text-sm font-semibold text-slate-800">
                            {model.label}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white lg:hidden"
            aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Cerrar menu"
            className="fixed inset-0 top-[4.75rem] -z-10 bg-slate-950/25 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div
          className={cx(
            "overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden",
            mobileOpen ? "max-h-[70svh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="mt-4 max-h-[calc(70svh-1rem)] space-y-3 overflow-y-auto border-t border-slate-200 pt-4">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <div className="rounded-[1.5rem] border border-slate-200 p-3">
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-slate-500">
                Modelos destacados
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {modelLinks.map((model) => (
                  <Link
                    key={model.href}
                    href={model.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-slate-50 p-3"
                  >
                    <Image
                      src={model.image}
                      alt={model.label}
                      width={160}
                      height={90}
                      className="mx-auto h-16 w-full object-contain"
                    />
                    <p className="mt-2 text-center text-sm font-semibold">{model.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
