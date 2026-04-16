import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="surface-dark w-full p-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-rose-300/80">
            Acceso denegado
          </p>
          <h1 className="text-4xl font-semibold">No tenes permisos para esta seccion.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            El middleware detecto que tu rol actual no coincide con las politicas de acceso
            definidas para este modulo.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Volver al panel
          </Link>
        </div>
      </div>
    </div>
  );
}
