"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const items = [
  {
    src: "/modelos/x55Plus/x55PlusTecho.webp",
    label: "Techo Solar Panorámico",
    description:
      "Con un tamaño líder en su clase de 1320 x 850 mm, ofrece una experiencia visual inmersiva y cinematográfica.",
  },
  {
    src: "/modelos/x55Plus/x55PlusAltavoces.webp",
    label: "Altavoces Flotantes",
    description:
      "Con un diseño futurista, ofrecen una experiencia de sonido que desafía la gravedad.",
  },
  {
    src: "/modelos/x55Plus/x55PlusIluminacion.webp",
    label: "Iluminación Ambiental",
    description:
      "Con 64 colores y funciones de bienvenida, proporciona una experiencia integrada para todos los pasajeros.",
  },
  {
    src: "/modelos/x55Plus/x55PlusPanel.webp",
    label: "Panel Texturizado en Negro",
    description:
      "Este elemento distintivo crea una estética moderna y audaz, elevando la sensación general del vehículo.",
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
            className="object-cover w-full h-[280px] sm:h-[300px] md:h-[340px] lg:h-[350px] transition-transform duration-300 group-hover:scale-105"
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
