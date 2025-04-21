"use client";
import Image from "next/image";

export default function CollageSeguridad() {
  const items = [
    {
      title: "Control de Crucero Adaptativo Integrado (IACC)",
      image: "/modelos/x55Plus/x55PlusIACC.webp",
      colSpan: 2,
      rowSpan: 2,
    },
    {
      title: "Advertencia de Salida de Carril (LDW)",
      image: "/modelos/x55Plus/x55PlusLWD.webp",
    },
    {
      title: "Detección de Punto Ciego (BSD)",
      image: "/modelos/x55Plus/x55PlusBSD.webp",
    },
    {
      title: "Advertencia de Colisión Frontal (FCW)",
      image: "/modelos/x55Plus/x55PlusFCW.webp",
    },
    {
      title: "Frenado Autónomo de Emergencia (AEB)",
      image: "/modelos/x55Plus/x55PlusAEB.webp",
    },
    {
      title: "Control de Descenso de Pendientes (HDC)",
      image: "/modelos/x55Plus/x55PlusHDC.webp",
    },
    {
      title: "Asistente de Luz de Carretera (HMA)",
      image: "/modelos/x55Plus/x55PlusHMA.webp",
    },
  ];

  return (
    <>
      {/* 📱 Mobile layout: una sola columna */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative bg-black text-white overflow-hidden rounded-lg"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="w-full h-full object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white font-semibold mt-2 text-lg drop-shadow-lg">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Tablets (md) → 2 columnas, más espaciado */}
      <div className="hidden sm:grid md:hidden grid-cols-2 gap-4 max-w-screen-md mx-auto p-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative bg-black text-white overflow-hidden rounded-lg"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="w-full h-[240px] object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white font-semibold mt-2 text-base drop-shadow-lg">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* 🖥️ Pantallas grandes: el collage original */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 max-w-screen-xl h-[500px] lg:h-[600px] mx-auto p-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`relative bg-black text-white overflow-hidden rounded-lg ${
              item.colSpan ? `col-span-${item.colSpan}` : "col-span-1"
            } ${item.rowSpan ? `row-span-${item.rowSpan}` : "row-span-1"}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="w-full h-full object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white font-semibold mt-2 text-lg sm:text-xl drop-shadow-lg">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
