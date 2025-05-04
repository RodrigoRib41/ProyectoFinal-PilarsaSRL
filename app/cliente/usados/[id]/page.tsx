"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  moneda: string;
  año: number;
  color: string;
  kilometros: number;
  version: string;
  descripcion: string;
  categoria: string;
  createdAt: string;
  foto1?: string | null;
  foto2?: string | null;
  foto3?: string | null;
  foto4?: string | null;
}

export default function AutoDetalle() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [auto, setAuto] = useState<Auto | null>(null);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    axios.get(`/api/autos/${id}`)
      .then(res => {
        const data = res.data as Auto;

        // Construir array de imágenes válidas (no null)
        const imgs = [data.foto1, data.foto2, data.foto3, data.foto4].filter(
          (url): url is string => !!url
        );

        setAuto(data);
        setImagenes(imgs);
      })
      .catch(() => {
        setAuto(null);
      });
  }, [id]);

  if (!auto) {
    return <p className="text-center text-gray-500">Auto no encontrado</p>;
  }

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % imagenes.length);
  };

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
      <div className="relative w-full  h-[400px]">
        {imagenes.length > 0 ? (
          <>
          <div className="relative w-full h-full rounded-lg overflow-hidden object-cover">
            <Image
              src={imagenes[imagenActual]}
              alt={auto.modelo}
              width={600}
              height={400}
              className="rounded-lg mx-auto"
            />
            </div>
            <button
              onClick={anteriorImagen}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={siguienteImagen}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            <div className="flex gap-2 mt-4 justify-center ">
              {imagenes.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Vista ${index + 1}`}
                  width={100}
                  height={80}
                  className={`rounded-lg cursor-pointer border-2 object-cover ${
                    index === imagenActual ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setImagenActual(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">Sin imágenes disponibles</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold">{auto.marca}</h2>
        <h3 className="text-xl text-gray-700">{auto.modelo}</h3>
        <p className="text-lg font-semibold text-black mt-2">
          {auto.moneda} {auto.precio.toLocaleString()}
        </p>

        <Link href="/cliente/contacto">
          <button className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-200">
            ME INTERESA
          </button>
        </Link>

        <p className="mt-4 text-gray-500">
          Categoría: <span className="text-blue-500">{auto.categoria}</span>
        </p>

        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Información adicional</h4>
          <ul className="space-y-2">
            <li><span className="font-semibold">Año:</span> {auto.año}</li>
            <li><span className="font-semibold">Color:</span> {auto.color}</li>
            <li><span className="font-semibold">Kilómetros:</span> {auto.kilometros.toLocaleString()}</li>
            <li><span className="font-semibold">Versión:</span> {auto.version}</li>
            <li><span className="font-semibold">Publicado:</span> {new Date(auto.createdAt).toLocaleDateString()}</li>
          </ul>
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Descripción</h4>
          <p className="text-gray-700">{auto.descripcion}</p>
        </div>
      </div>
    </div>
  );
}
