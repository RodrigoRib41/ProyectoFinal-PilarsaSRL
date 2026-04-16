"use client";

import clsx from "clsx";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  rojo: "/modelos/x55Plus/x55PlusRoja.webp",
  azul: "/modelos/x55Plus/x55PlusAzul.webp",
  negra: "/modelos/x55Plus/x55PlusNegra.webp",
  gris: "/modelos/x55Plus/x55PlusGris.webp",
  plata: "/modelos/x55Plus/x55PlusPlata.webp",
  blanco: "/modelos/x55Plus/x55PlusBlanca.webp",
};

export default function BaicX35Hero() {
  const [color, setColor] = useState<keyof typeof imagenes>("blanco");
  const [isFading, setIsFading] = useState(false);

  const handleColorChange = (nuevoColor: keyof typeof imagenes) => {
    if (nuevoColor === color) return;
    setIsFading(true);
    setTimeout(() => {
      setColor(nuevoColor);
      setIsFading(false);
    }, 200);
  };

  return (
    <div
      className={`${poppins.className} flex flex-col items-center justify-center gap-10 px-5 py-12 sm:px-8 md:flex-row md:gap-16 md:px-20 md:py-28`}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">X55 PLUS</h1>
        <h2 className="mb-4 text-lg font-semibold leading-tight sm:text-xl md:text-2xl">
          La SUV que llego para cambiarlo todo.
        </h2>
        <p className="text-sm leading-relaxed sm:text-base md:text-lg">
          Diseno vanguardista, conduccion confortable y multiples sistemas avanzados al conductor (ADAS). Configuracion inteligente.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-start">
          <button
            type="button"
            aria-label="Ver X55 Plus en color blanco"
            className="h-11 w-11 rounded-full border bg-white"
            onClick={() => handleColorChange("blanco")}
          />
          <button
            type="button"
            aria-label="Ver X55 Plus en color plata"
            className="h-11 w-11 rounded-full bg-gray-200"
            onClick={() => handleColorChange("plata")}
          />
          <button
            type="button"
            aria-label="Ver X55 Plus en color gris"
            className="h-11 w-11 rounded-full bg-gray-700"
            onClick={() => handleColorChange("gris")}
          />
          <button
            type="button"
            aria-label="Ver X55 Plus en color azul"
            className="h-11 w-11 rounded-full bg-blue-700"
            onClick={() => handleColorChange("azul")}
          />
          <button
            type="button"
            aria-label="Ver X55 Plus en color rojo"
            className="h-11 w-11 rounded-full bg-red-600"
            onClick={() => handleColorChange("rojo")}
          />
          <button
            type="button"
            aria-label="Ver X55 Plus en color negro"
            className="h-11 w-11 rounded-full bg-black"
            onClick={() => handleColorChange("negra")}
          />
        </div>

        <Link
          href="/contacto"
          className="mt-10 inline-flex w-full items-center justify-center rounded-full border px-8 py-3 text-base font-semibold transition hover:bg-black hover:text-white sm:w-auto sm:text-lg"
        >
          CONTACTANOS
        </Link>
      </div>

      <div className="flex w-full justify-center">
        <Image
          src={imagenes[color]}
          alt={`BAIC X55 Plus color ${color}`}
          width={800}
          height={500}
          className={clsx(
            "h-auto w-full max-w-[400px] transition-opacity duration-500 md:max-w-[1000px]",
            isFading ? "opacity-0" : "opacity-100",
          )}
        />
      </div>
    </div>
  );
}
