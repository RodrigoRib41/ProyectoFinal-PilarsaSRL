"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const autosUsados = [
  {
    id: 1,
    marca: "Volkswagen",
    modelo: "T.CROSS 1.6 CONF",
    precio: "$25.000.000",
    imagenes: ["/usados/tcross1.jpg", "/usados/tcross2.jpg", "/usados/tcross3.jpg"]
  },
  {
    id: 2,
    marca: "Volkswagen",
    modelo: "SURAN 1.6 HIGH",
    precio: "$17.000.000",
    imagenes: ["/usados/suran1.jpg", "/usados/suran2.jpg"]
  },
  {
    id: 3,
    marca: "Toyota",
    modelo: "YARIS XLS 5P MT6",
    precio: "$19.500.000",
    imagenes: ["/usados/yaris-xls1.jpg", "/usados/yaris-xls2.jpg"]
  },
  {
    id: 4,
    marca: "Toyota",
    modelo: "YARIS S 5P MT6",
    precio: "$21.000.000",
    imagenes: ["/usados/yaris-s1.jpg", "/usados/yaris-s2.jpg"]
  },
  {
    id: 5,
    marca: "Baic",
    modelo: "X55 PLUS",
    precio: "$41.000.000",
    imagenes: ["/x55plusSLIDER.jpg", "/usados/yaris-s2.jpg"]
  },
  {
    id: 6,
    marca: "Baic",
    modelo: "X55 II AT",
    precio: "$41.000.000",
    imagenes: ["/pruebaUsados/x55prueba.jpg", "/pruebaUsados/x55prueba2.jpg","/pruebaUsados/x55prueba3.jpg"]
  }
];

export default function Usados() {
  return (
    <div className={`${poppins.className} container mx-auto px-4`}>
      <h2 className="text-2xl font-bold text-center my-6">USADOS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {autosUsados.map((auto) => (
          <Link key={auto.id} href={`/cliente/usados/${auto.id}`} passHref>
            <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
              {/* Imagen del auto */}
              <div className="relative w-full aspect-square bg-gray-100">
                <Image
                  src={auto.imagenes[0]}
                  alt={auto.modelo}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-t-lg"
                />
              </div>
              {/* Información del auto */}
              <div className="p-4">
                <p className="text-lg font-bold">{auto.marca}</p>
                <p className="text-gray-700">{auto.modelo}</p>
                <p className="text-black font-semibold mt-2">{auto.precio}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}