import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = [
  // STOCK
  {
    path: "/admin/agregarAutoUsado",
    allowedRoles: ["STOCK", "SUPERADMIN"],
  },
  {
    path: "/admin/eliminarAutoUsado",
    allowedRoles: ["STOCK", "SUPERADMIN"],
  },
  {
    path: "/admin/modificarAutoUsado",
    allowedRoles: ["STOCK", "SUPERADMIN"],
  },

  // SERVICES
  {
    path: "/admin/agregarServicios",
    allowedRoles: ["SERVICES", "SUPERADMIN"],
  },
  {
    path: "/admin/agregarVehiculoServicies",
    allowedRoles: ["SERVICES", "SUPERADMIN"],
  },
  {
    path: "/admin/listarYmodificarServicies",
    allowedRoles: ["SERVICES", "SUPERADMIN"],
  },
  {
    path: "/admin/modificarVehiculo",
    allowedRoles: ["SERVICES", "SUPERADMIN"],
  },

  // FINANZAS
  {
    path: "/admin/compras",
    allowedRoles: ["FINANZAS", "SUPERADMIN"],
  },
  {
    path: "/admin/ventas",
    allowedRoles: ["FINANZAS", "SUPERADMIN"],
  },
  {
    path: "/admin/balance",
    allowedRoles: ["FINANZAS", "SUPERADMIN"],
  },

  // Panel general de administración
  {
    path: "/admin",
    allowedRoles: ["FINANZAS","SERVICES","STOCK","SUPERADMIN"],
  },
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userRole = req.nextauth.token?.role as string;

    const matchedRoute = protectedRoutes.find((route) =>
      pathname.startsWith(route.path)
    );

    if (matchedRoute) {
      if (!matchedRoute.allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
