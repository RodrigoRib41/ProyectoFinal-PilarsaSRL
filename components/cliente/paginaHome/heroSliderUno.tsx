"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const images = [
  { src: "/bj30SLIDER.png", model: "/logoVarios/logobj30SLIDER.webp", link: "/bj30" },
  { src: "/x55plusSLIDER.jpg", model: "/logoVarios/logox55PLUSSLIDER.png", link: "/x55plus" },
  { src: "/u5plusSLIDER.jpg", model: "/logoVarios/logoU5plusSLIDER.webp", link: "/u5plus" }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[35vh] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden">

      {/* Fondo con imágenes del slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={images[index].src}
            alt={`Slider ${index + 1}`}
            fill
            className="w-full h-full object-cover"
            quality={100}
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className={`${poppins.className} absolute bottom-5 right-5 md:bottom-10 md:right-20 flex flex-col items-center scale-100 md:scale-85`}>
        {/* Imagen PNG encima del botón */}
        <div className="w-32 h-32 md:w-48 md:h-48 relative mb-[-20px] md:mb-[-30px]">
          <Image
            src={images[index].model}
            alt="Icono"
            fill
            className="object-contain"
            quality={100}
          />
        </div>

        {/* Botón "Descubrilo" con área de clic más grande */}
        <Link 
          href={images[index].link} 
          className="block w-full min-w-[120px] md:min-w-[160px] text-center px-6 py-2 md:px-12 md:py-4 text-sm md:text-lg transition bg-gray-500/60 text-white rounded-full hover:bg-white hover:text-gray-800 hover:shadow-lg cursor-pointer"
        >
          DESCUBRILO
        </Link>
      </div>


    </div>
    

    
  );
}
