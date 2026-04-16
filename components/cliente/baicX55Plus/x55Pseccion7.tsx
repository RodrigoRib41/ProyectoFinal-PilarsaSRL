"use client";

import Image from "next/image";

const items = [
  {
    title: "Control de crucero adaptativo integrado (IACC)",
    image: "/modelos/x55Plus/x55PlusIACC.webp",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    title: "Advertencia de salida de carril (LDW)",
    image: "/modelos/x55Plus/x55PlusLWD.webp",
  },
  {
    title: "Deteccion de punto ciego (BSD)",
    image: "/modelos/x55Plus/x55PlusBSD.webp",
  },
  {
    title: "Advertencia de colision frontal (FCW)",
    image: "/modelos/x55Plus/x55PlusFCW.webp",
  },
  {
    title: "Frenado autonomo de emergencia (AEB)",
    image: "/modelos/x55Plus/x55PlusAEB.webp",
  },
  {
    title: "Control de descenso de pendientes (HDC)",
    image: "/modelos/x55Plus/x55PlusHDC.webp",
  },
  {
    title: "Asistente de luz de carretera (HMA)",
    image: "/modelos/x55Plus/x55PlusHMA.webp",
  },
];

function desktopSpanClass(colSpan?: number, rowSpan?: number) {
  const colClass = colSpan === 2 ? "md:col-span-2" : "md:col-span-1";
  const rowClass = rowSpan === 2 ? "md:row-span-2" : "md:row-span-1";
  return `${colClass} ${rowClass}`;
}

export default function CollageSeguridad() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:hidden">
        {items.map((item) => (
          <article
            key={item.title}
            className="relative overflow-hidden rounded-lg bg-black text-white"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="h-[240px] w-full object-cover transition duration-300 sm:h-[260px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-10">
              <p className="text-base font-semibold drop-shadow-lg sm:text-lg">{item.title}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto hidden max-w-screen-xl grid-cols-4 grid-rows-2 gap-4 p-4 md:grid md:h-[500px] lg:h-[600px]">
        {items.map((item) => (
          <article
            key={item.title}
            className={`relative overflow-hidden rounded-lg bg-black text-white ${desktopSpanClass(
              item.colSpan,
              item.rowSpan,
            )}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={500}
              height={300}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-12">
              <p className="text-lg font-semibold drop-shadow-lg sm:text-xl">{item.title}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
