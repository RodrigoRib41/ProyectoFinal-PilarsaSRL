import type { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { AppError } from "@/lib/core/api-errors";
import { env } from "@/lib/core/env";
import type { UserRole } from "@/lib/domain/contracts";

export async function requireApiRoles(req: NextApiRequest, roles: UserRole[]) {
  const token = await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
  });

  if (!token) {
    throw new AppError("Debes iniciar sesion para acceder a este recurso.", 401);
  }

  const role = token.role as UserRole | undefined;

  if (!role || !roles.includes(role)) {
    throw new AppError("No tienes permisos para acceder a este recurso.", 403);
  }

  return role;
}
