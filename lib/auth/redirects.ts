type PostLoginOptions = {
  role?: string;
  mustChangePassword?: boolean;
  isRootAdmin?: boolean;
};

export function getPostLoginDestination({
  role,
  mustChangePassword,
  isRootAdmin,
}: PostLoginOptions) {
  if (mustChangePassword) {
    return "/auth/primer-acceso";
  }

  if (isRootAdmin) {
    return "/admin";
  }

  switch (role) {
    case "STOCK":
      return "/admin";
    case "SERVICES":
      return "/admin/agregarServicios";
    case "FINANZAS":
      return "/admin/balance";
    case "SUPERADMIN":
      return "/admin";
    default:
      return "/admin";
  }
}
