"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/x55/x55quinta.webp" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC X35"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />

      {/* Contenido encima */}
      <div
          className={`${poppins.className} absolute left-4 right-4 top-4 z-20 max-w-none rounded-2xl bg-black/45 p-3 text-left text-white backdrop-blur-[2px] sm:left-auto sm:right-6 sm:max-w-[70%] sm:p-4 sm:text-right lg:right-10 lg:max-w-[50%] lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}
        >
          <h1 className="text-base md:text-4xl font-semibold mb-2 text-right">
            Motor Magic Core 1.5 TGV
          </h1>
          <ul className="text-sm md:text-2xl space-y-1">
            <li>› Potencia Máxima: 183 HP</li>
            <li>› Máximo par: 305 Nm </li>
            <li>› Aceleración de 0-100 Km: 7.84 s</li>
         </ul>
      </div>
    </div>
  );
}
