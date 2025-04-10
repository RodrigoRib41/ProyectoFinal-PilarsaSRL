"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import clsx from "clsx";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  rojo: "/modelos/x35/x35roja.png",
  blanco: "/modelos/x35/x35blanca.png",
  azul: "/modelos/x35/x35azul.png",
  vino: "/modelos/x35/x35bronce.png",
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
    }, 200); // duración del fade-out
  };

  return (
    <div className={`${poppins.className} flex flex-col md:flex-row items-center justify-center gap-16 px-8 md:px-20 py-16 md:py-28`}>
      
      {/* Texto */}
      <div className="flex flex-col items-center text-center max-w-xl w-full mx-auto">
        <h1 className="text-4xl sm:text-7xl font-bold">X35</h1>
        <h2 className="text-lg sm:text-2xl mt-2">La nueva tendencia de SUV.</h2>
        <p className="mt-4 text-sm sm:text-lg">
          Experiencia de conducción segura, <br />
          agradable y de alta calidad.
        </p>

        {/* Círculos de color */}
        <div className="flex space-x-4 mt-6 justify-center md:justify-start">
          <button className="w-8 h-8 rounded-full bg-red-600" onClick={() => handleColorChange("rojo")} />
          <button className="w-8 h-8 rounded-full bg-white border" onClick={() => handleColorChange("blanco")} />
          <button className="w-8 h-8 rounded-full bg-blue-600" onClick={() => handleColorChange("azul")} />
          <button className="w-8 h-8 rounded-full bg-[#430000]" onClick={() => handleColorChange("vino")} />
        </div>

        {/* Botón */}
        <Link href="/cliente/contacto">
        <button className="mt-8 px-6 py-2 border rounded-full font-semibold hover:bg-black hover:text-white transition">
          CONTACTANOS
        </button>
        </Link>
      </div>

      {/* Imagen con fade */}
      <div className="flex justify-center w-full">
        <Image
          src={imagenes[color]}
          alt={`BAIC X35 color ${color}`}
          width={700}
          height={400}
          className={clsx(
            "w-full max-w-[400px] md:max-w-[1000px] h-auto transition-opacity duration-500",
            isFading ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
      
    </div>
    
  );
}
