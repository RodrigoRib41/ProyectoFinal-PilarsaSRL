"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/x35/x35segunda.jpg" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC X35"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />

      {/* Contenido encima */}
      <div
       className={`${poppins.className} absolute top-4 left-10 text-left max-w-xs md:max-w-sm z-20 text-white`}
      >
            <h1 className="text-base md:text-4xl font-semibold mb-2">
                FAROS OJOS DE HALCÓN BIÓNICOS
            </h1>
            <p className="text-sm md:text-2xl">
                205 LED de alta calidad y diseño.
            </p>
      </div>
    </div>
  );
}