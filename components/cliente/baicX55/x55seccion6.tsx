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
          className={`${poppins.className} absolute top-4 left-10 max-w-[50%] z-20 text-white`}
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