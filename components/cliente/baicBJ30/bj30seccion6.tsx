"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const items = [
  {
    src: "/modelos/bj30/BJ30quinta1.webp",
    label: "Panel de instrumentos integrado",
    description:
      "Combinación de doble pantalla de 10.25 pulgadas + 14.6 pulgadas.",
  },
  {
    src: "/modelos/bj30/BJ30quinta2.jpg",
    label: "Sistema de control todoterreno ATS",
    description:
      "Puede optimizar automáticamente los diversos sistemas de control del vehículo, permitiendo que se adapte a diferentes tipos de terrenos.",
  },
];

export default function GaleriaInteractiva() {
  return (
    <section
      className={`${poppins.className} w-full px-4 py-12 grid gap-6 grid-cols-1 md:grid-cols-2`}
    >
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
            className="object-cover w-full h-[300px] sm:h-[400px] md:h-[400px] lg:h-[550px] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Título visible */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-md text-sm md:text-base font-semibold z-10">
            {item.label}
          </div>

          {/* Descripción al hacer hover */}
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
