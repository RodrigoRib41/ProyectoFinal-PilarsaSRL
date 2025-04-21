"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function HeroBaic() {
  return (
    <div className="relative w-full h-[35vh] lg:h-[800px] md:h-[600px] md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/u5PLUS/U5sexta.jpeg" // ← asegurate que esta ruta esté bien en /public
        alt="Hero BAIC U5"
        fill
        className="object-cover"
        quality={100}
        priority
        sizes="100vw"
      />

      {/* Contenido encima */}
      <div
       className={`${poppins.className} absolute top-4 left-10 max-w-[50%] z-20 text-black`}
      >
            <h1 className="text-base md:text-4xl font-semibold mb-2">
                Cómodos asientos multifuncionales
            </h1>
            <p className="text-sm md:text-2xl">
                Tapizados en ecocuero con espuma engrosada y alargada.
                Asientos integrados de gravedad cero.
            </p>
      </div>
    </div>
  );
}