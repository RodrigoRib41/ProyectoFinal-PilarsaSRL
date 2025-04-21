"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const items = [
  {
    src: "/modelos/x55Plus/x55PlusDisenio.jpg",
    label: "Diseño",
    description:
      "El modelado de este vehículo se adhiere perfectamente al lenguaje que caracteriza a la marca y que es mundialmente conocido como “Capital Beauty”.",
  },
  {
    src: "/modelos/x55Plus/x55PlusFaros.jpg",
    label: "Faros Traseros",
    description:
      "El diseño se enmarca dentro del concepto Digital Matrix, delineando lo que la marca define como “Kylin Wing”.",
  },
  {
    src: "/modelos/x55Plus/x55PlusLlantas.jpg",
    label: "Llantas",
    description:
      "Su tamaño de 19 pulgadas está acompañado de un exclusivo diseño que combina líneas delgadas y delicadas, con detalles en color negro brillante, proporcionando gran personalidad.",
  },
  {
    src: "/modelos/x55Plus/x55PlusTrasero.jpg",
    label: "Perfil Lateral",
    description:
      "El diseño de escape cuádruple y bilateral resalta la dinámica y la potencia del X55 Plus.",
  },
];

export default function GaleriaInteractiva() {
  return (
    <section className={`${poppins.className} w-full px-4 py-12 grid grid-cols-2 grid-rows-2 gap-6 lg:grid-cols-4 lg:grid-rows-1`}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group overflow-hidden rounded-xl shadow-lg"
        >
          <Image
            src={item.src}
            alt={item.label}
            width={700}
            height={500}
            className="object-cover w-full h-[280px] sm:h-[300px] md:h-[340px] lg:h-[400px] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Título siempre visible */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-md text-sm md:text-base font-semibold z-10">
            {item.label}
          </div>

          {/* Descripción con hover */}
          {item.description && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-center px-4">
              <p className="text-white text-sm md:text-base">
                {item.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
