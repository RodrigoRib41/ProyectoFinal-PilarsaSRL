import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });


const especificaciones = [
  { valor: "180 HP", texto: "POTENCIA" },
  { valor: "305 NM", texto: "TORQUE" },
  { valor: "9.87 S", texto: "0 – 100 KM/H" },
  { valor: "1.498 CC", texto: "MOTOR" },
  { valor: "2.888 MM", texto: "DISTANCIA ENTRE EJES" },
];


export default function HeroBaic() {
  return (
    <div className={`${poppins.className} relative w-full h-[500px] md:h-screen md:min-h-[500px] sm:min-h-[calc(80vh-60px)] overflow-hidden`}>
      {/* Imagen de fondo fija */}
      <Image
        src="/modelos/x55Plus/X55PlusSegunda.jpg" // ← asegurate que esta ruta esté bien en /public
        alt="Especificaciones X55 Plus"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      {/* Contenido encima */}
      <div className="absolute inset-0 bg-black/40" /> {/* oscurece la imagen */}
      <div className="absolute bottom-6 w-full flex flex-col items-center">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-white text-center px-4">
          {especificaciones.map((item, idx) => (
            <div key={idx}>
              <p className="text-xl md:text-2xl font-bold">{item.valor}</p>
              <p className="text-xs md:text-sm tracking-widest">
                {item.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


