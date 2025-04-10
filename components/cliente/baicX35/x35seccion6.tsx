"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/x35/x35quinta.png" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC X35"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />

      {/* Contenido encima */}
      <div className={`${poppins.className} absolute z-20 text-white p-4 md:p-10 max-w-none`}>
        <h1 className="text-base md:text-4xl font-semibold mb-2">
            SEGURIDAD Y ASISTENCIA A LA CONDUCCIÓN
        </h1>
        <ul className="text-sm md:text-2xl space-y-1">
            <li>› ABS + EBD (Anti-lock Braking System + Electronic Brake Distribution)</li>
            <li>› EBA (Electronic Brake Assistant)</li>
            <li>› ESP (Electronic Stability Program)</li>
            <li>› TCS (Traction Control System)</li>
            <li>› HHC (Hill Hold Assist)</li>
         </ul>
        </div>
    </div>
  );
}