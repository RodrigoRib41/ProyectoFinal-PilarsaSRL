"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { KeyRound, LogIn, ShieldCheck } from "lucide-react";
import { completeFirstAccessPassword } from "@/lib/api/auth";

type FormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialState: FormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function FirstAccessPasswordForm({ username }: { username: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.newPassword.length < 6) {
      setError("La nueva contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("La confirmacion no coincide con la nueva contrasena.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("La nueva contrasena debe ser distinta de la inicial.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await completeFirstAccessPassword(form);
      setSuccess(response.message);
      setForm(initialState);

      setTimeout(() => {
        void signOut({ callbackUrl: "/auth/login?updated=1" });
      }, 900);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar la contrasena.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.14)]">
      <div className="rounded-t-[2rem] bg-slate-950 px-6 py-6 text-white sm:px-8">
        <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3">
          <ShieldCheck size={22} />
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Primer acceso</p>
        <h1 className="mt-3 text-2xl font-semibold">Define tu contrasena personal</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Iniciaste sesion con una contrasena temporal. Antes de entrar al panel, el usuario{" "}
          <span className="font-semibold text-white">{username}</span> debe crear su clave definitiva.
        </p>
      </div>

      <form className="space-y-5 px-6 py-6 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Contrasena inicial
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, currentPassword: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            placeholder="La clave con la que acabas de ingresar"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nueva contrasena</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, newPassword: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            placeholder="Minimo 6 caracteres"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirmar nueva contrasena
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            placeholder="Repite la nueva contrasena"
            required
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Al guardar, cerraremos esta sesion para que vuelvas a ingresar con la nueva contrasena.
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60"
        >
          {submitting ? <KeyRound size={16} /> : <LogIn size={16} />}
          {submitting ? "Guardando nueva contrasena..." : "Guardar y volver a ingresar"}
        </button>
      </form>
    </div>
  );
}
