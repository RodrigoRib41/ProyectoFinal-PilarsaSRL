import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] }); 

export default function ImagenHover() {
  return (
    <div className={`${poppins.className} relative group w-full h-[400px] sm:h-[600px] md:h-[700px] overflow-hidden`}>
      {/* Imagen de fondo */}
      <Image
        src="/modelos/x55Plus/X55PlusButacas.webp" // Reemplazá con tu ruta
        alt="Diseño X55 Plus"
        fill
        className="object-cover transition duration-700 ease-in-out group-hover:blur-sm"
      />

      {/* Capa oscura opcional */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Título arriba a la derecha */}
      <div className="absolute top-4 left-4 bg-black text-white text-sm font-semibold px-4 py-2 rounded-md shadow-md z-10">
        Asientos Ergonómicos
      </div>

      {/* Subtítulo centrado que aparece al hacer hover */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-center transition-all duration-700 opacity-0 group-hover:opacity-100">
        <div className="flex flex-col items-center">
          <p className="mt-2 text-lg sm:text-xl">Incluyendo un asiento premium para cada pasajero, ofrecen una experiencia de lujo, adaptándose al cuerpo y reduciendo la fatiga muscular.</p>
        </div>
      </div>
    </div>
  );
}