"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const modelos = [
  { nombre: "BJ30", img: "/modelosAgua/abj30.png", link: "/modelo/baicBJ30" },
  { nombre: "X55 Plus", img: "/modelosAgua/ax55plus.webp", link: "/modelo/baicX55PLUS" },
  { nombre: "U5 Plus", img: "/modelosAgua/aguau5plus.png", link: "/modelo/baicU5PLUS" },
  { nombre: "X55 II", img: "/modelosAgua/aguax55II.png", link: "/modelo/baicX55II" },
  { nombre: "X35", img: "/modelosAgua/aguax35.png", link: "/modelo/baicX35" },
  { nombre: "EU5", img: "/modelosAgua/aguaeu5.png", link: "/modelo/baicEU5" },
];

export default function ModelosSection() {
  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 lg:px-12 text-center">
      <h2 className={`${poppins.className} text-2xl sm:text-3xl md:text-4xl font-bold mb-6`}>
        Descubrí tu próximo BAIC
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-center">
        {modelos.map((modelo, index) => (
          <Link key={index} href={modelo.link} className="group flex flex-col items-center cursor-pointer">
            <div className="relative w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] overflow-visible">
              <Image
                src={modelo.img}
                alt={modelo.nombre}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className={`${poppins.className} mt-2 text-sm sm:text-base md:text-lg font-semibold`}>
              {modelo.nombre}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
