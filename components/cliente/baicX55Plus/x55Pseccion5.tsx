"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const items = [
  {
    src: "/modelos/x55Plus/x55PlusTecho.webp",
    label: "Techo solar panoramico",
    description:
      "Con un tamano lider en su clase de 1320 x 850 mm, ofrece una experiencia visual inmersiva y cinematografica.",
  },
  {
    src: "/modelos/x55Plus/x55PlusAltavoces.webp",
    label: "Altavoces flotantes",
    description:
      "Con un diseno futurista, ofrecen una experiencia de sonido que desafia la gravedad.",
  },
  {
    src: "/modelos/x55Plus/x55PlusIluminacion.webp",
    label: "Iluminacion ambiental",
    description:
      "Con 64 colores y funciones de bienvenida, genera una experiencia integrada para todos los pasajeros.",
  },
  {
    src: "/modelos/x55Plus/x55PlusPanel.webp",
    label: "Panel texturizado en negro",
    description:
      "Este elemento distintivo crea una estetica moderna y audaz, elevando la sensacion general del vehiculo.",
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
            className="h-[280px] w-full object-cover transition-transform duration-300 lg:group-hover:scale-105 sm:h-[300px] md:h-[340px] lg:h-[350px]"
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
