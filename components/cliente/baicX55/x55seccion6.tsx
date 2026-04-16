"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/x55/x55sexta.jpg" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC X35"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />

      {/* Contenido encima */}
      <div
          className={`${poppins.className} absolute left-4 right-4 top-4 z-20 max-w-none rounded-2xl bg-black/45 p-3 text-white backdrop-blur-[2px] sm:right-auto sm:max-w-[70%] sm:p-4 lg:left-10 lg:right-auto lg:max-w-[50%] lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}
        >
          <h1 className="text-base md:text-4xl font-semibold mb-2 text-left">
            MÚLTIPLES SENSORES Y ASISTENCIA A LA CONDUCCIÓN
          </h1>
          <ul className="text-sm md:text-2xl space-y-1">
            <li>› Control Crucero Adaptativo e Inteligente</li>
            <li>› Estacionamiento Autónomo</li>
            <li>›  Imagen 3D Panorámica de 360°</li>
            <li>›  Frenado de Emergencia Autónomo</li>
            <li>›  Asistencia autónoma en Embotellamientos</li>
         </ul>
      </div>
    </div>
  );
}
