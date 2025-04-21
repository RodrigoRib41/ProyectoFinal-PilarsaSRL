"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] lg:h-[800px] md:h-[600px] md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/u5PLUS/U5primera.jpg" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC U5"
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
            <h1 className="text-base md:text-4xl font-semibold mb-2">
                Exterior elegante, interior espacioso
            </h1>
            <p className="text-sm md:text-2xl">
                Dimensiones (largo x ancho x alto): 4.660 x 1.820 x 1.480 mm
                Distancia entre ejes: 2.670 mm
            </p>
      </div>
    </div>
  );
}