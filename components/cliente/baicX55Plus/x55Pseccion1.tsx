"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import clsx from "clsx";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  rojo: "/modelos/x55Plus/x55PlusRoja.webp",
  azul: "/modelos/x55Plus/x55PlusAzul.webp",
  negra: "/modelos/x55Plus/x55PlusNegra.webp",
  gris: "/modelos/x55Plus/x55PlusGris.webp",
  plata: "/modelos/x55Plus/x55PlusPlata.webp",
  blanco: "/modelos/x55Plus/x55PlusBlanca.webp",
};

export default function BaicX35Hero() {
  const [color, setColor] = useState<keyof typeof imagenes>("blanco");
  const [isFading, setIsFading] = useState(false);

  const handleColorChange = (nuevoColor: keyof typeof imagenes) => {
    if (nuevoColor === color) return;
    setIsFading(true);
    setTimeout(() => {
      setColor(nuevoColor);
      setIsFading(false);
    }, 200);
  };

  return (
    <div className={`${poppins.className} flex flex-col md:flex-row items-center justify-center gap-16 px-8 md:px-20 py-16 md:py-28`}>
      
      {/* Texto */}
      <div className="flex flex-col items-center text-center max-w-xl w-full mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">X55 PLUS</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">La SUV que llego para cambiarlo todo.</h2>
        <p className="text-base md:text-lg leading-relaxed">
          Diseño vanguardista, conducción confortable y multiples sistemas avanzados al conductor (ADAS). Configuracion inteligente.
        </p>

        {/* Círculos de color */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            <button className="w-10 h-10 rounded-full bg-white border" onClick={() => handleColorChange("blanco")} />
            <button className="w-10 h-10 rounded-full bg-gray-200" onClick={() => handleColorChange("plata")} />
            <button className="w-10 h-10 rounded-full bg-gray-700" onClick={() => handleColorChange("gris")} />
            <button className="w-10 h-10 rounded-full bg-blue-700" onClick={() => handleColorChange("azul")} />
            <button className="w-10 h-10 rounded-full bg-red-600" onClick={() => handleColorChange("rojo")} />
            <button className="w-10 h-10 rounded-full bg-black" onClick={() => handleColorChange("negra")} />
        </div>

        {/* Botón */}
        <Link href="/cliente/contacto">
          <button className="mt-10 px-8 py-3 border rounded-full font-semibold text-lg hover:bg-black hover:text-white transition">
            CONTACTANOS
          </button>
        </Link>
      </div>

      {/* Imagen con fade */}
      <div className="flex justify-center w-full">
        <Image
          src={imagenes[color]}
          alt={`BAIC X35 color ${color}`}
          width={800}
          height={500}
          className={clsx(
            "w-full max-w-[400px] md:max-w-[1000px] h-auto transition-opacity duration-500",
            isFading ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
    </div>
  );
}