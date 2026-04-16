import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function ImagenHover() {
  return (
    <div
      className={`${poppins.className} relative group h-[400px] w-full overflow-hidden sm:h-[500px] md:h-[600px] lg:h-[700px]`}
    >
      <Image
        src="/modelos/bj30/BJ30cuartaP.jpg"
        alt="BJ30 caja de cambios"
        fill
        className="object-cover transition duration-700 ease-in-out lg:group-hover:blur-sm"
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute left-4 right-4 top-4 z-10 lg:right-auto">
        <div className="inline-flex rounded-full bg-black/75 px-4 py-2 text-sm font-semibold text-white shadow-md">
          Selector de marchas electronico
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/55 p-4 text-white backdrop-blur-[2px] lg:inset-0 lg:flex lg:items-center lg:justify-center lg:rounded-none lg:bg-black/40 lg:px-8 lg:py-6 lg:text-center lg:opacity-0 lg:backdrop-blur-sm lg:transition-all lg:duration-700 lg:group-hover:opacity-100">
        <p className="text-sm leading-relaxed sm:text-base lg:text-lg xl:text-xl">
          Adopta un diseno inspirado en los propulsores de un avion de combate, con una experiencia mas avanzada y tecnologica.
        </p>
      </div>
    </div>
  );
}
