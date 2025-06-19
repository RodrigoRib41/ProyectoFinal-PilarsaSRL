"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import clsx from "clsx";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  negro: "/modelos/bj30/BJ30negra.webp",
  blanco: "/modelos/bj30/BJ30blanca.webp",
  verdeagua: "/modelos/bj30/BJ30verde.webp",
  gris: "/modelos/bj30/BJ30gris.webp",
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
        <h1 className="text-5xl md:text-6xl font-bold mb-4">BJ30</h1>
        <h2 className="text-xl md:text-2xl mb-4">Un todo terreno moderno, híbrido y muy confortable.</h2>
        

        {/* Círculos de color */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
            <button className="w-10 h-10 rounded-full" style={{ backgroundColor: '#96B7A0', boxShadow: '0 0 6px rgba(0,0,0,0.2)' }} onClick={() => handleColorChange("verdeagua")} />
            <button className="w-10 h-10 rounded-full border" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 0 6px rgba(0,0,0,0.2)' }} onClick={() => handleColorChange("blanco")} />
            <button className="w-10 h-10 rounded-full" style={{ backgroundColor: '#46484C', boxShadow: '0 0 6px rgba(0,0,0,0.2)' }} onClick={() => handleColorChange("gris")} />
            <button className="w-10 h-10 rounded-full" style={{ backgroundColor: '#000000', boxShadow: '0 0 6px rgba(0,0,0,0.2)' }} onClick={() => handleColorChange("negro")} />
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
