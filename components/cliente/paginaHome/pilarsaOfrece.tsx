"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const servicios = [
  { 
    nombre: "Financiacion a tu medida", 
    descripcion: "Trabajamos con los mejores bancos y nos encargamos de todos los tramites.",
    img: "/homePilarsaSection/paraFinanciarHome.png", 
    link: "/usados" 
  },
  { 
    nombre: "Servicio posventa", 
    descripcion: "Mantenimiento para tu Baic.",
    img: "/homePilarsaSection/fotoMecanicoGen.webp", 
    link: "/service" 
  },
  { 
    nombre: "Usados", 
    descripcion: "Encontra el tuyo entre nuestras ofertas.",
    img: "/homePilarsaSection/paraUsadoHome.jpg", 
    link: "/usados" 
  },
];

export default function PilarsaOfrece() {
  return (
    <div className={`py-12 px-4 sm:px-6 md:px-12 lg:px-20 text-center ${poppins.className}`}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
        En Pilarsa vas a encontrar
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {servicios.map((servicio, index) => (
          <a key={index} href={servicio.link} className="group block">
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
              <Image
                src={servicio.img}
                alt={servicio.nombre}
                layout="fill"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-lg font-semibold">{servicio.nombre}</p>
            <p className="mt-1 text-sm text-gray-600">{servicio.descripcion}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
