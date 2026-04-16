import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import Sidebar from "@/components/admin/Sidebar";
import { authOptions } from "@/lib/auth/options";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_40%,_#e2e8f0_40%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] overflow-x-clip">
        <Sidebar isSuperAdmin={isSuperAdmin} />
        <main className="min-w-0 flex-1">
          <div className="min-h-screen px-3 pb-8 pt-20 sm:px-4 md:px-8 md:pb-10 md:pt-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
