"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Cerrar si clickean fuera del sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburguesa (arriba a la derecha en mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Backdrop oscuro al abrir menú en mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-56 bg-gray-800 text-white p-4 flex flex-col justify-between z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:w-56 md:min-h-screen`}
      >
        <div>
          {/* Cerrar botón (solo visible en mobile) */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <div className="flex items-center space-x-2">
              <Image src="/logoVarios/logoPilarsa.png" alt="Logo" width={42} height={30} />
              <span className="text-lg font-semibold">Pilarsa Admin</span>
            </div>
            <button onClick={closeSidebar} className="text-white">
              <X size={24} />
            </button>
          </div>

          {/* Logo (visible solo en desktop) */}
          <div className="hidden md:flex items-center text-2xl font-bold mb-6 space-x-2">
            <Image src="/logoVarios/logoPilarsa.png" alt="Logo" width={42} height={30} />
            <span>Pilarsa Admin</span>
          </div>

          {/* STOCK */}
          <div className="mb-6">
            <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">STOCK</h3>
            <nav className="space-y-1">
              <SidebarLink href="/admin/agregarAutoUsado" label="Agregar Auto Usado" onClick={closeSidebar} />
              <SidebarLink href="/admin/eliminarAutoUsado" label="Eliminar Auto Usado" onClick={closeSidebar} />
              <SidebarLink href="/admin/modificarAutoUsado" label="Modificar Auto Usado" onClick={closeSidebar} />
            </nav>
          </div>

          <div className="border-t border-gray-600 my-4"></div>

          {/* SERVICES */}
          <div className="mb-6">
            <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">SERVICES</h3>
            <nav className="space-y-1">
              <SidebarLink href="/admin/agregarServicios" label="Agregar Services" onClick={closeSidebar} />
              <SidebarLink href="/admin/listarYmodificarServicies" label="Modificar Services" onClick={closeSidebar} />
              <SidebarLink href="/admin/agregarVehiculoServicies" label="Agregar Vehículo" onClick={closeSidebar} />
              <SidebarLink href="/admin/modificarVehiculo" label="Modificar Vehículo" onClick={closeSidebar} />
              <SidebarLink href="/admin/repuestosGestion" label="Repuestos" onClick={closeSidebar} />
            </nav>
          </div>

          <div className="border-t border-gray-600 my-4"></div>

          {/* BALANCE */}
          <div>
            <h3 className="text-sm uppercase font-semibold text-gray-400 mb-2">BALANCE</h3>
            <nav className="space-y-1">
              <SidebarLink href="/admin/ventas" label="Ingreso (Ventas)" onClick={closeSidebar} />
              <SidebarLink href="/admin/compras" label="Egreso (Compras)" onClick={closeSidebar} />
              <SidebarLink href="/admin/balance" label="Balance" onClick={closeSidebar} />
            </nav>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            closeSidebar();
            signOut({ callbackUrl: "/auth/login" });
          }}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded"
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} className="block hover:bg-gray-700 p-2 rounded" onClick={onClick}>
      {label}
    </Link>
  );
}
