"use client";

import clsx from "clsx";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const imagenes = {
  negro: "/modelos/bj30/BJ30negra.webp",
  blanco: "/modelos/bj30/BJ30blanca.webp",
  verdeagua: "/modelos/bj30/BJ30verde.webp",
  gris: "/modelos/bj30/BJ30gris.webp",
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
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">BJ30</h1>
        <h2 className="mb-4 text-lg leading-tight sm:text-xl md:text-2xl">
          Un todo terreno moderno, hibrido y muy confortable.
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-start">
          <button
            type="button"
            aria-label="Ver BJ30 en color verde agua"
            className="h-11 w-11 rounded-full"
            style={{ backgroundColor: "#96B7A0", boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
            onClick={() => handleColorChange("verdeagua")}
          />
          <button
            type="button"
            aria-label="Ver BJ30 en color blanco"
            className="h-11 w-11 rounded-full border"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
            onClick={() => handleColorChange("blanco")}
          />
          <button
            type="button"
            aria-label="Ver BJ30 en color gris"
            className="h-11 w-11 rounded-full"
            style={{ backgroundColor: "#46484C", boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
            onClick={() => handleColorChange("gris")}
          />
          <button
            type="button"
            aria-label="Ver BJ30 en color negro"
            className="h-11 w-11 rounded-full"
            style={{ backgroundColor: "#000000", boxShadow: "0 0 6px rgba(0,0,0,0.2)" }}
            onClick={() => handleColorChange("negro")}
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
          alt={`BAIC BJ30 color ${color}`}
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
