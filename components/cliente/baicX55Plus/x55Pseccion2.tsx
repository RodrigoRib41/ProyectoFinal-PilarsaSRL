import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const especificaciones = [
  { valor: "180 HP", texto: "POTENCIA" },
  { valor: "305 NM", texto: "TORQUE" },
  { valor: "9.87 S", texto: "0 - 100 KM/H" },
  { valor: "1.498 CC", texto: "MOTOR" },
  { valor: "2.888 MM", texto: "DISTANCIA ENTRE EJES" },
];

export default function HeroBaic() {
  return (
    <div
      className={`${poppins.className} relative w-full h-[560px] overflow-hidden sm:h-[500px] md:h-screen md:min-h-[500px]`}
    >
      <Image
        src="/modelos/x55Plus/X55PlusSegunda.jpg"
        alt="Especificaciones X55 Plus"
        fill
        className="object-cover"
        quality={100}
        priority
      />

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-x-0 bottom-4 px-4 sm:bottom-6">
        <div className="flex gap-3 overflow-x-auto pb-2 text-white sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible md:grid-cols-5 md:gap-6">
          {especificaciones.map((item) => (
            <div
              key={item.texto}
              className="min-w-[148px] rounded-2xl bg-black/35 px-4 py-3 text-center backdrop-blur-[2px] sm:min-w-0"
            >
              <p className="text-lg font-bold sm:text-xl md:text-2xl">{item.valor}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] sm:text-xs md:text-sm">
                {item.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
