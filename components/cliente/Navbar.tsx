"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const autos = [
  { id: 1, nombre: "X35", img: "/modelosAgua/aguax35.png" },
  { id: 2, nombre: "X55 II", img: "/modelosAgua/aguax55II.png" },
  { id: 3, nombre: "X55 PLUS", img: "/modelosAgua/ax55plus.webp" },
  { id: 4, nombre: "BJ30", img: "/modelosAgua/abj30.png" },
  { id: 5, nombre: "U5 PLUS", img: "/modelosAgua/aguau5plus.png" },
  { id: 6, nombre: "EU5", img: "/modelosAgua/aguaeu5.png" },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  let dropdownTimeout: NodeJS.Timeout;


  // ✅ Agrega un delay antes de cerrar el dropdown
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // ⏳ 200ms de espera antes de cerrar
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      {/* Navbar */}
      <div className="container mx-auto flex justify-between items-center p-4 relative">
        {/* Logo */}
        <Link href="/cliente" className="flex items-center">
          <Image src="/logoVarios/logoPilarsa.png" alt="Logo" width={100} height={30} />
        </Link>

        {/* Menú en Desktop */}
        <nav className={`${poppins.className} hidden lg:flex space-x-6`}>
          <Link href="/cliente" className="text-xl hover:text-blue-600">Inicio</Link>

          {/* Modelos con Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-xl font-bold cursor-pointer hover:text-blue-600">
              Modelos
            </span>
            {/* Espacio invisible para evitar cortes al bajar */}
            <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
          </div>

          <Link href="/cliente/usados" className="text-xl hover:text-blue-600">Usados</Link>
          <Link href="/cliente/service" className="text-xl hover:text-blue-600">Services</Link>
          <Link href="/cliente/contacto" className="text-xl hover:text-blue-600">Contacto</Link>
        </nav>
        {/* Botón para abrir menú móvil */}
        <div className="lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Dropdown de Modelos - Se mantiene abierto mientras estés sobre él */}
      {isDropdownOpen && (
        <div
          className="absolute left-0 top-full w-full bg-white shadow-lg p-6 grid grid-cols-6 gap-6 border-t border-gray-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {autos.map((auto) => (
            <Link key={auto.id} href={`/cliente/modelo/baic${auto.nombre.replace(/\s+/g, "")}`} className="block text-center w-full">
             <Image 
              src={auto.img.trim()} 
              alt={auto.nombre} 
              width={180} 
              height={100} 
              className="w-full h-auto max-h-24 object-contain rounded-md p-1 transition-transform duration-300 hover:scale-110"
            />
              <p className="text-lg font-semibold mt-2">{auto.nombre}</p>
            </Link>
          ))}
        </div>
      )}
       {/* 📱 Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute left-0 top-full w-full bg-white shadow-lg p-4 flex flex-col items-center space-y-4">
          <Link href="/cliente" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-blue-600">Inicio</Link>
          <button
            className="text-xl font-bold hover:text-blue-600"
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
          >
            Modelos {isMobileDropdownOpen ? "▲" : "▼"}
          </button>

          {/* Dropdown de Modelos en Móvil */}
          {isMobileDropdownOpen && (
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-3">
              {autos.map((auto) => (
                <Link key={auto.id} href={`/cliente/modelo/baic${auto.nombre.replace(/\s+/g, "")}`} onClick={() => setIsMobileMenuOpen(false)} className="block text-center w-full">
                  <Image 
                    src={auto.img.trim()} 
                    alt={auto.nombre} 
                    width={150} 
                    height={80} 
                    className="w-full h-auto max-h-24 object-contain rounded-md p-1"
                  />
                  <p className="text-lg font-semibold mt-2">{auto.nombre}</p>
                </Link>
              ))}
            </div>
          )}

          <Link href="/cliente/usados" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-blue-600">Usados</Link>
          <Link href="/cliente/service" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-blue-600">Services</Link>
          <Link href="/cliente/contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold hover:text-blue-600">Contacto</Link>
        </div>
      )}
    </header>
  );
}