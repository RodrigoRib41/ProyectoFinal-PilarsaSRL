import type { Session } from "next-auth";
import { AppError } from "@/lib/core/api-errors";

export function assertSuperAdminSession(session: Session | null) {
  if (session?.user?.role !== "SUPERADMIN") {
    throw new AppError("Solo los usuarios con rol SUPERADMIN pueden administrar cuentas internas.", 403);
  }

  return {
    username: session.user?.username ?? session.user?.name ?? "superadmin",
  };
}
