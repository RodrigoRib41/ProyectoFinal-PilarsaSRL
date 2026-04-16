import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

const especificaciones = [
  { valor: "301 KW", texto: "POTENCIA" },
  { valor: "685 NM", texto: "TORQUE" },
  { valor: "1.5 T&HEV", texto: "MOTOR" },
  { valor: "2 DHT", texto: "TRANSMISION" },
  { valor: "6.9 S", texto: "0 - 100 KM/H" },
];

export default function HeroBaic() {
  return (
    <div
      className={`${poppins.className} relative w-full h-[560px] overflow-hidden sm:h-[500px] md:h-screen md:min-h-[500px]`}
    >
      <Image
        src="/modelos/bj30/BJ30primera.jpg"
        alt="Bj30 primera"
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
