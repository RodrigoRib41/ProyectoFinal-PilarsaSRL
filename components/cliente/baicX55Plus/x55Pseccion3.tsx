"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const items = [
  {
    src: "/modelos/x55Plus/x55PlusDisenio.jpg",
    label: "Diseno",
    description:
      "El modelado del vehiculo sigue el lenguaje visual de la marca y su identidad Capital Beauty.",
  },
  {
    src: "/modelos/x55Plus/x55PlusFaros.jpg",
    label: "Faros traseros",
    description:
      "El diseno se enmarca dentro del concepto Digital Matrix y define el estilo Kylin Wing.",
  },
  {
    src: "/modelos/x55Plus/x55PlusLlantas.jpg",
    label: "Llantas",
    description:
      "Las llantas de 19 pulgadas combinan lineas delgadas y detalles en negro brillante para una presencia mas deportiva.",
  },
  {
    src: "/modelos/x55Plus/x55PlusTrasero.jpg",
    label: "Perfil lateral",
    description:
      "El escape cuadruple bilateral resalta la dinamica y la potencia visual del X55 Plus.",
  },
];

export default function GaleriaInteractiva() {
  return (
    <section
      className={`${poppins.className} grid w-full grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4`}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="relative group overflow-hidden rounded-xl shadow-lg"
        >
          <Image
            src={item.src}
            alt={item.label}
            width={700}
            height={500}
            className="h-[280px] w-full object-cover transition-transform duration-300 lg:group-hover:scale-105 sm:h-[300px] md:h-[340px] lg:h-[400px]"
          />

          <div className="absolute left-2 top-2 z-10 rounded-md bg-black/70 px-3 py-1 text-sm font-semibold text-white md:text-base">
            {item.label}
          </div>

          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/55 p-4 text-left text-white backdrop-blur-[2px] lg:inset-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:bg-black/40 lg:px-4 lg:text-center lg:opacity-0 lg:backdrop-blur-sm lg:transition-opacity lg:duration-300 lg:group-hover:opacity-100">
            <p className="text-sm leading-relaxed md:text-base">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
