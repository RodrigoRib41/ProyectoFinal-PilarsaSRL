import Image from 'next/image';
import ContactoForm from "@/components/cliente/Formulario";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Servicios() {
  return (
    <div className={`${poppins.className} container mx-auto px-4 py-8`}>
      {/* Encabezado con Imagen de Fondo */}
      <div className="relative w-full h-80 md:h-96 mb-8">
        <Image
          src="/serviceFotos/fotoServicio.jpg"  // Cambia la ruta a tu imagen
          alt="Nuestros Servicios"
          layout="fill"
          objectFit="cover"
          className="rounded-lg opacity-80"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold text-center">
            Nuestros Servicios Postventa
          </h1>
        </div>
      </div>

      {/* Descripción de Servicios */}
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Servicios de Alta Calidad</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          BAIC ofrece una gama completa de servicios postventa para garantizar que tu vehículo siga funcionando como nuevo. Desde mantenimiento regular hasta la instalación de repuestos originales.
        </p>
        <div className="flex justify-center">
          <Image
            src="/logoVarios/logoBAIC.png"  // Cambia la ruta a tu ícono o imagen
            alt="Icono Servicio"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      </div>

        {/* Galería de Servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {/* Servicio 1 */}
        <div className="text-center">
            <div className="relative w-full h-90"> {/* Contenedor con altura fija */}
            <Image
                src="/serviceFotos/fotoServicio2.jpg"
                alt="Servicio 1"
                layout="fill"   // Hace que la imagen llene el contenedor
                objectFit="cover"  // Asegura que la imagen cubra todo el espacio sin deformarse
                className="mx-auto rounded-lg shadow-lg"
            />
            </div>
            <p className="mt-2 font-semibold text-lg">Integridad</p>
            <p className="mt-1 text-base text-gray-600">Repuestos originales para todas sus unidades.</p>
        </div>
        
        {/* Servicio 2 */}
        <div className="text-center">
            <div className="relative w-full h-90"> {/* Contenedor con altura fija */}
            <Image
                src="/serviceFotos/garantiaImagen.png"
                alt="Servicio 2"
                layout="fill"   // Hace que la imagen llene el contenedor
                objectFit="contain"  // Asegura que la imagen cubra todo el espacio sin deformarse
                className="mx-auto rounded-lg shadow-lg"
            />
            </div>
            <p className="mt-2 font-semibold text-lg">Garantía</p>
            <p className="mt-1 text-base text-gray-600">BAIC ofrece en la Argentina una garantía de 7 años o 100.000km, inédita en el país y que equipara a las mejores garantías que se ofrecen hoy en Europa.</p>
        </div>
        
        {/* Servicio 3 */}
        <div className="text-center">
            <div className="relative w-full h-90"> {/* Contenedor con altura fija */}
            <Image
                src="/serviceFotos/fotoServicio3.jpg"
                alt="Servicio 3"
                layout="fill"   // Hace que la imagen llene el contenedor
                objectFit="cover"  // Asegura que la imagen cubra todo el espacio sin deformarse
                className="mx-auto rounded-lg shadow-lg"
            />
            </div>
            <p className="mt-2 font-semibold text-lg">Cuidado</p>
            <p className="mt-1 text-base text-gray-600">Nuestros técnicos especialistas te brindarán asistencia en todas tus consultas para garantizar el rendimiento óptimo de tu modelo BAIC.</p>
        </div>
        </div>
        <ContactoForm />
    </div>
  );
}
