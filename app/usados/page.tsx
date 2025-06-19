'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import axios from 'axios';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  precioPromocional?: number;
  moneda: string;
  año: number;
  kilometros: number;
  foto1?: string;
}


export default function AutosUsados() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [añosDisponibles, setAñosDisponibles] = useState<number[]>([]);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(0);
  const [kmMin, setKmMin] = useState<number>(0);
  const [kmMax, setKmMax] = useState<number>(0);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('');
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | string>('');
  const [precioFiltro, setPrecioFiltro] = useState([0, 0]);
  const [kmFiltro, setKmFiltro] = useState([0, 0]);
  const [mostrarPromociones, setMostrarPromociones] = useState(false);


  // 🔹 Cargar autos al inicio
  useEffect(() => {
    axios.get('/api/autos')
      .then(res => {
        const autosData = res.data as Auto[];
        setAutos(autosData);

        // Obtener marcas y años únicas
        const marcas = [...new Set(autosData.map(auto => auto.marca))];
        setMarcasDisponibles(marcas);

        const años = [...new Set(autosData.map(auto => auto.año))].sort((a, b) => b - a);
        setAñosDisponibles(años);

        // Establecer los valores máximos y mínimos de precio y kilometros
        const precios = autosData.map(auto => auto.precio);
        const kilometros = autosData.map(auto => auto.kilometros);

        setPrecioMin(Math.min(...precios));
        setPrecioMax(Math.max(...precios));
        setKmMin(Math.min(...kilometros));
        setKmMax(Math.max(...kilometros));

        setAutosFiltrados(autosData); // Mostrar todos al principio
        setPrecioFiltro([Math.min(...precios), Math.max(...precios)]);
        setKmFiltro([Math.min(...kilometros), Math.max(...kilometros)]);
      })
      .catch(err => console.error('Error cargando autos:', err));
  }, []);

  // 🔹 Filtrar autos cuando cambia marca, año, precio o kilometros
  useEffect(() => {
    let filtrados = autos;

    if (marcaSeleccionada) {
      filtrados = filtrados.filter(auto =>
        auto.marca.toLowerCase().includes(marcaSeleccionada.toLowerCase())
      );
    }

    if (añoSeleccionado) {
      filtrados = filtrados.filter(auto =>
        auto.año === (typeof añoSeleccionado === 'number' ? añoSeleccionado : parseInt(añoSeleccionado))
      );
    }

    if (precioFiltro) {
      filtrados = filtrados.filter(auto =>
        auto.precio >= precioFiltro[0] && auto.precio <= precioFiltro[1]
      );
    }

    if (kmFiltro) {
      filtrados = filtrados.filter(auto =>
        auto.kilometros >= kmFiltro[0] && auto.kilometros <= kmFiltro[1]
      );
    }
    if (mostrarPromociones) {
      filtrados = filtrados.filter(auto => auto.precioPromocional && auto.precioPromocional > 0);
    }


    setAutosFiltrados(filtrados);
  }, [marcaSeleccionada, añoSeleccionado, autos, precioFiltro, kmFiltro, mostrarPromociones]);

  return (
    <div className={`${poppins.className} p-6`}>
      <h1 className="text-2xl font-bold mb-6">Autos Usados</h1>

      {/* 🔹 Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <h2 className="text-xl w-full md:w-auto">Filtros:</h2>
        <div className="flex gap-4 w-full flex-wrap">
          {/* Filtro de Marca */}
          <select
            value={marcaSeleccionada}
            onChange={(e) => setMarcaSeleccionada(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">Selecciona una marca...</option>
            {marcasDisponibles.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>

          {/* Filtro de Año */}
          <select
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="">Selecciona un año...</option>
            {añosDisponibles.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>

          {/* Filtro de Precio */}
          <div className="w-full sm:w-32 md:w-40 lg:w-48">
            <h3 className="text-sm">Precio</h3>
            <input
              type="range"
              min={precioMin}
              max={precioMax}
              value={precioFiltro[0]}
              onChange={(e) =>
                setPrecioFiltro([parseInt(e.target.value), precioFiltro[1]])
              }
              className="w-full"
            />
            <input
              type="range"
              min={precioMin}
              max={precioMax}
              value={precioFiltro[1]}
              onChange={(e) =>
                setPrecioFiltro([precioFiltro[0], parseInt(e.target.value)])
              }
              className="w-full"
            />
            <p>
              Rango de precio: {precioFiltro[0]} - {precioFiltro[1]}
            </p>
          </div>

          {/* Filtro de Kilómetros */}
          <div className="w-full sm:w-32 md:w-40 lg:w-48">
            <h3 className="text-sm">Kilómetros</h3>
            <input
              type="range"
              min={kmMin}
              max={kmMax}
              value={kmFiltro[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                if (newMin <= kmFiltro[1]) {
                  setKmFiltro([newMin, kmFiltro[1]]);
                }
              }}
              className="w-full"
            />
            <input
              type="range"
              min={kmMin}
              max={kmMax}
              value={kmFiltro[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                if (newMax >= kmFiltro[0]) {
                  setKmFiltro([kmFiltro[0], newMax]);
                }
              }}
              className="w-full"
            />
            <p>
              Rango de kilómetros: {kmFiltro[0]} - {kmFiltro[1]}
            </p>
          </div>
        </div>
        <button
          onClick={() => setMostrarPromociones(!mostrarPromociones)}
          className={`border px-4 py-2 rounded ${
            mostrarPromociones ? 'bg-green-600 text-white' : 'bg-white text-black border-gray-400'
          } hover:shadow`}
        >
          {mostrarPromociones ? 'Ver todos' : 'Ver solo promociones'}
        </button>
        
      </div>

      {/* 🔹 Lista de autos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-4">
      {autosFiltrados.map((auto) => (
          <div
            key={auto.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition w-[390px] mx-auto"
            
          >
            {auto.foto1 ? (
              <Image
                src={auto.foto1}
                alt={`${auto.marca} ${auto.modelo}`}
                width={400}
                height={300}
                className="w-full h-48 object-contain bg-black"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span>Sin imagen</span>
              </div>
            )}

            <h2 className="text-lg font-semibold">{auto.marca} {auto.modelo}</h2>
            <p className="text-black">Año: {auto.año} &nbsp; Kilómetros: {auto.kilometros}</p>

          {auto.precioPromocional && auto.precioPromocional > 0 ? (
            <div>
              <p className="text-black line-through text-base">
                {auto.moneda} {auto.precio}
              </p>
              <p className="text-red-600 font-bold text-lg">
                {auto.moneda} {auto.precioPromocional}
              </p>
            </div>
          ) : (
            <p className="text-black font-bold">
              {auto.moneda} {auto.precio}
            </p>
          )}

            <Link
              href={`/cliente/usados/${auto.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
