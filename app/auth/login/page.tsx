"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { getPostLoginDestination } from "@/lib/auth/redirects";

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    setPasswordUpdated(new URLSearchParams(window.location.search).get("updated") === "1");
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      setError("Usuario o contrasena incorrectos.");
      return;
    }

    const session = await getSession();
    const destination = getPostLoginDestination({
      role: session?.user?.role,
      mustChangePassword: session?.user?.mustChangePassword,
      isRootAdmin: session?.user?.isRootAdmin,
    });

    router.push(destination);
    router.refresh();
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            Acceso interno
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">
            Operacion mas clara, permisos mas seguros y un panel pensado para escalar.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            El ingreso administrativo centraliza stock, postventa y finanzas con una
            experiencia visual coherente y flujos mas confiables.
          </p>
        </div>

        <div className="surface-card mx-auto w-full max-w-md overflow-hidden">
          <div className="bg-slate-950 px-8 py-6 text-white">
            <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3">
              <Image
                src="/logoVarios/logoPilarsaagua.png"
                alt="Pilarsa"
                width={150}
                height={56}
                priority
              />
            </div>
            <h2 className="text-2xl font-semibold">Ingreso al panel</h2>
            <p className="mt-2 text-sm text-slate-300">
              Usa tus credenciales internas para continuar.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 px-8 py-8">
            {passwordUpdated ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                La contrasena se actualizo. Ingresa nuevamente con tu nueva clave.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Usuario
              </label>
              <input
                type="text"
                {...register("username", { required: "Ingresa tu usuario." })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="Usuario"
              />
              {errors.username ? (
                <p className="mt-2 text-sm text-rose-600">{errors.username.message}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Contrasena
              </label>
              <input
                type="password"
                {...register("password", { required: "Ingresa tu contrasena." })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                placeholder="******"
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
