import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FirstAccessPasswordForm } from "@/components/auth/FirstAccessPasswordForm";
import { authOptions } from "@/lib/auth/options";

export default async function FirstAccessPage() {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username ?? session?.user?.name;

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!session.user.mustChangePassword) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            Seguridad interna
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">
            La primera sesion confirma el acceso. La segunda ya debe ser tuya.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Este paso evita que las contrasenas temporales queden activas mas tiempo del necesario
            y deja cada cuenta con una clave personal desde el primer dia.
          </p>
        </div>

        <FirstAccessPasswordForm username={username ?? "usuario"} />
      </div>
    </div>
  );
}
