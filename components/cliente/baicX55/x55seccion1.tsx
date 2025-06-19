"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import clsx from "clsx";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  rojo: "/modelos/x55/x55Rojo.png",
  blanco: "/modelos/x55/x55Blanco.png",
  amarillo: "/modelos/x55/x55Amarillo.png",
  grisClaro: "/modelos/x55/x55Gris.png",
  grisOscuro: "/modelos/x55/x55GrisOscuro.png",
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
        <h1 className="text-5xl md:text-6xl font-bold mb-4">X55 II</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">La SUV que llego para cambiarlo todo.</h2>
        <p className="text-base md:text-lg leading-relaxed">
          Diseño vanguardista, conducción confortable y multiples sistemas avanzados al conductor (ADAS). Configuracion inteligente.
        </p>

        {/* Círculos de color */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
          <button className="w-10 h-10 rounded-full bg-red-600" onClick={() => handleColorChange("rojo")} />
          <button className="w-10 h-10 rounded-full bg-yellow-400" onClick={() => handleColorChange("amarillo")} />
          <button className="w-10 h-10 rounded-full bg-gray-700" onClick={() => handleColorChange("grisOscuro")} />
          <button className="w-10 h-10 rounded-full bg-gray-300" onClick={() => handleColorChange("grisClaro")} />
          <button className="w-10 h-10 rounded-full bg-white border" onClick={() => handleColorChange("blanco")} />
        </div>

        {/* Botón */}
        <Link href="/contacto">
          <button className="mt-10 px-8 py-3 border rounded-full font-semibold text-lg hover:bg-black hover:text-white transition">
            CONTACTANOS
          </button>
        </Link>
      </div>

      {/* Imagen con fade */}
      <div className="flex justify-center w-full">
        <Image
          src={imagenes[color]}
          alt={`BAIC X55 color ${color}`}
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
