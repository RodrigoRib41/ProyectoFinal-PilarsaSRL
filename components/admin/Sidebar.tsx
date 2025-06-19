"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Image
            src="/logoVarios/logoPilarsa.png"
            alt="Logo"
            width={52}
            height={35}
          />
          <span>Pilarsa Admin</span>
        </div>

        {/* Autos Section */}
        <div className="mb-6">
          <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">STOCK</h3>
          <nav className="space-y-1">
            <Link href="/admin/agregarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
              Agregar Auto Usado
            </Link>
            <Link href="/admin/eliminarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
              Eliminar Auto Usado
            </Link>
            <Link href="/admin/modificarAutoUsado" className="block hover:bg-gray-700 p-2 rounded">
              Modificar Auto Usado
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-600 my-4"></div>

        {/* Services Section */}
        <div className="mb-6">
          <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">SERVICES</h3>
          <nav className="space-y-1">
            <Link href="/admin/agregarServicios" className="block hover:bg-gray-700 p-2 rounded">
              Agregar Services
            </Link>
            <Link href="/admin/listarYmodificarServicies" className="block hover:bg-gray-700 p-2 rounded">
              Modificar Services
            </Link>
            <Link href="/admin/agregarVehiculoServicies" className="block hover:bg-gray-700 p-2 rounded">
              Agregar Vehículo
            </Link>
            <Link href="/admin/modificarVehiculo" className="block hover:bg-gray-700 p-2 rounded">
              Modificar Vehículo
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-600 my-4"></div>

        {/* Finanzas Section */}
        <div>
          <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">BALANCE</h3>
          <nav className="space-y-1">
            <Link href="/admin/ventas" className="block hover:bg-gray-700 p-2 rounded">
              Ingreso (Ventas)
            </Link>
            <Link href="/admin/compras" className="block hover:bg-gray-700 p-2 rounded">
              Egreso (Compras)
            </Link>
            <Link href="/admin/balance" className="block hover:bg-gray-700 p-2 rounded">
              Balance
            </Link>
          </nav>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
