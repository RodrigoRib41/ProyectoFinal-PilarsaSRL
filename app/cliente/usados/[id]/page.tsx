"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importa iconos de flechas

const autosUsados = [
  {
    id: 1,
    marca: "Volkswagen",
    modelo: "T.CROSS 1.6 CONF",
    precio: "$25.000.000",
    imagenes: ["/usados/tcross1.jpg", "/usados/tcross2.jpg", "/usados/tcross3.jpg"],
    anio: 2021,
    color: "Gris",
    kilometros: 32000,
    version: "Comfortline",
  },
  {
    id: 2,
    marca: "Toyota",
    modelo: "ETIOS XLS 5P MT",
    precio: "$14.500.000",
    imagenes: ["/usados/etios1.jpg", "/usados/etios2.jpg", "/usados/etios3.jpg"],
    anio: 2014,
    color: "Blanco",
    kilometros: 110000,
    version: "XLS 5P MT",
  },
  {
    id: 6,
    marca: "BAIC",
    modelo: "X55 II",
    precio: "$45.000.000",
    imagenes: ["/pruebaUsados/X55prueba.jpg", "/pruebaUsados/X55prueba2.jpg", "/pruebaUsados/X55prueba3.jpg"],
    anio: 2023,
    color: "Gris",
    kilometros: 20000,
    version: "Luxury",
  },
];

export default function AutoDetalle() {
  const { id } = useParams();
  const auto = autosUsados.find((car) => car.id === Number(id));

  const [imagenActual, setImagenActual] = useState(0);

  if (!auto) {
    return <p className="text-center text-gray-500">Auto no encontrado</p>;
  }

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % auto.imagenes.length);
  };

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev - 1 + auto.imagenes.length) % auto.imagenes.length);
  };

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Imagen principal con flechas */}
      <div className="relative w-full">
        <Image
          src={auto.imagenes[imagenActual]}
          alt={auto.modelo}
          width={600}
          height={400}
          className="rounded-lg mx-auto"
        />
        
        {/* Botón izquierdo */}
        <button
          onClick={anteriorImagen}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Botón derecho */}
        <button
          onClick={siguienteImagen}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
        >
          <ChevronRight size={24} />
        </button>

        {/* Miniaturas */}
        <div className="flex gap-2 mt-4 justify-center">
          {auto.imagenes.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Vista ${index + 1}`}
              width={100}
              height={80}
              className={`rounded-lg cursor-pointer border-2 ${
                index === imagenActual ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setImagenActual(index)}
            />
          ))}
        </div>
      </div>

      {/* Información del auto */}
      <div>
        <h2 className="text-2xl font-bold">{auto.marca}</h2>
        <h3 className="text-xl text-gray-700">{auto.modelo}</h3>
        <p className="text-lg font-semibold text-black mt-2">{auto.precio}</p>
         
        <Link href="/cliente/contacto">
            <button className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-200">
                ME INTERESA
            </button>
        </Link>
            
       
        
        <p className="mt-4 text-gray-500">Categoría: <span className="text-blue-500">Usados</span></p>

        {/* Información adicional */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Información adicional</h4>
          <ul className="space-y-2">
            <li><span className="font-semibold">Año:</span> {auto.anio}</li>
            <li><span className="font-semibold">Color:</span> {auto.color}</li>
            <li><span className="font-semibold">Kilómetros:</span> {auto.kilometros.toLocaleString()}</li>
            <li><span className="font-semibold">Versión:</span> {auto.version}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
