'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import axios from 'axios';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  año: number;
  precio: number;
  moneda: string;
  kilometros: number;
  color: string;
  categoria: string;
  descripcion: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  foto4?: string;
}

interface ListadoAutosProps {
  autos: Auto[];
  autoSeleccionado: Auto | null;
  setAutoSeleccionado: (auto: Auto) => void;
}

function ListadoAutos({ autos, autoSeleccionado, setAutoSeleccionado }: ListadoAutosProps) {
  return (
    <div className="max-h-64 overflow-y-auto border rounded mb-4">
      {autos.length === 0 ? (
        <p className="text-center text-gray-500 p-2">No se encontraron autos con esos filtros.</p>
      ) : (
        <table className="min-w-full text-sm text-left table-fixed">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b w-1/4">Marca</th>
              <th className="px-4 py-2 border-b w-1/4">Modelo</th>
              <th className="px-4 py-2 border-b w-1/4">Año</th>
              <th className="px-4 py-2 border-b w-1/4">Kilómetros</th>
            </tr>
          </thead>
          <tbody>
            {autos.map((auto) => (
              <tr
                key={auto.id}
                className={`cursor-pointer hover:bg-gray-100 ${autoSeleccionado?.id === auto.id ? 'bg-red-100' : ''}`}
                onClick={() => setAutoSeleccionado(auto)}
              >
                <td className="px-4 py-2 border-b">{auto.marca}</td>
                <td className="px-4 py-2 border-b">{auto.modelo}</td>
                <td className="px-4 py-2 border-b">{auto.año}</td>
                <td className="px-4 py-2 border-b">{auto.kilometros.toLocaleString()} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function EliminarAuto() {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('');
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string>('');
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | string>('');
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>([]);
  const [añosDisponibles, setAñosDisponibles] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const detalleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('/api/autos')
      .then(res => {
        const autosData = res.data as Auto[];
        setAutos(autosData);

        const marcas = [...new Set(autosData.map(auto => auto.marca))];
        setMarcasDisponibles(marcas);

        const modelos = [...new Set(autosData.map(auto => auto.modelo))];
        setModelosDisponibles(modelos);

        const años = [...new Set(autosData.map(auto => auto.año))].sort((a, b) => b - a);
        setAñosDisponibles(años);
      })
      .catch(err => console.error('Error cargando autos:', err));
  }, []);

  useEffect(() => {
    let filtrados = autos;

    if (marcaSeleccionada) {
      filtrados = filtrados.filter(auto =>
        auto.marca.toLowerCase().includes(marcaSeleccionada.toLowerCase())
      );
    }

    if (modeloSeleccionado) {
      filtrados = filtrados.filter(auto =>
        auto.modelo.toLowerCase().includes(modeloSeleccionado.toLowerCase())
      );
    }

    if (añoSeleccionado) {
      filtrados = filtrados.filter(auto =>
        auto.año === (typeof añoSeleccionado === 'number' ? añoSeleccionado : parseInt(añoSeleccionado))
      );
    }

    setAutosFiltrados(filtrados);
    setAutoSeleccionado(null);
  }, [marcaSeleccionada, modeloSeleccionado, añoSeleccionado, autos]);

  useEffect(() => {
    if (autoSeleccionado && detalleRef.current) {
      detalleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoSeleccionado]);

  const handleEliminar = async (e: FormEvent) => {
    e.preventDefault();
    if (!autoSeleccionado) return;

    try {
      await axios.delete(`/api/autos/${autoSeleccionado.id}`);
      setShowSuccess(true);

      const res = await axios.get('/api/autos');
      setAutos(res.data);
      setMarcaSeleccionada('');
      setModeloSeleccionado('');
      setAñoSeleccionado('');
      setAutosFiltrados([]);
      setAutoSeleccionado(null);
    } catch (err) {
      console.error('Error eliminando auto:', err);
      setShowError(true);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Eliminar Auto Usado</h1>
<h2 className="font-semibold mb-2">Buscar Auto</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={marcaSeleccionada}
          onChange={e => setMarcaSeleccionada(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona una marca...</option>
          {marcasDisponibles.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>

        <select
          value={modeloSeleccionado}
          onChange={e => setModeloSeleccionado(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona un modelo...</option>
          {modelosDisponibles.map(modelo => (
            <option key={modelo} value={modelo}>{modelo}</option>
          ))}
        </select>

        <select
          value={añoSeleccionado}
          onChange={e => setAñoSeleccionado(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona un año...</option>
          {añosDisponibles.map(año => (
            <option key={año} value={año}>{año}</option>
          ))}
        </select>
      </div>
 <h2 className="font-semibold mb-2">Resultados</h2>
      <ListadoAutos
        autos={autosFiltrados}
        autoSeleccionado={autoSeleccionado}
        setAutoSeleccionado={setAutoSeleccionado}
      />

      {autoSeleccionado && (
        
        <div ref={detalleRef} className="mt-6 bg-white p-4 border rounded shadow space-y-4 max-w-[635px]">
          <h3 className="text-xl font-semibold mb-4">Detalles del Auto</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Marca:</strong> {autoSeleccionado.marca}</div>
              <div><strong>Modelo:</strong> {autoSeleccionado.modelo}</div>
              <div><strong>Versión:</strong> {autoSeleccionado.version}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><strong>Año:</strong> {autoSeleccionado.año}</div>
              <div><strong>Precio:</strong> {autoSeleccionado.precio} {autoSeleccionado.moneda}</div>
              <div><strong>Kilómetros:</strong> {autoSeleccionado.kilometros} km</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div><strong>Color:</strong> {autoSeleccionado.color}</div>
              <div><strong>Categoría:</strong> {autoSeleccionado.categoria}</div>
              <div><strong>Descripción:</strong> {autoSeleccionado.descripcion}</div>
            </div>
          </div>

          <div className="flex flex-row space-x-2 justify-start mt-4">
            {[autoSeleccionado.foto1, autoSeleccionado.foto2, autoSeleccionado.foto3, autoSeleccionado.foto4]
              .filter(Boolean)
              .map((foto, index) => (
                <img key={index} src={foto!} alt={`Foto ${index + 1}`} className="w-36 h-36 object-cover" />
              ))}
          </div>

          <form onSubmit={handleEliminar} className="mt-6 space-y-4">
            <p className="text-red-600 font-semibold">
              ¿Estás seguro de que querés eliminar el auto seleccionado?
            </p>
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Eliminar Auto
            </button>
          </form>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">¡Vehículo eliminado con éxito!</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowSuccess(false)} className="bg-green-500 text-white p-2 rounded mt-4">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">Hubo un error al eliminar el vehículo</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowError(false)} className="bg-red-500 text-white p-2 rounded mt-4">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
