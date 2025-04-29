'use client';

import { useState, useEffect, FormEvent } from 'react';
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

export default function EliminarAuto() {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>(''); // Estado para la marca seleccionada
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | string>(''); // Estado para el año seleccionado
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);
  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [añosDisponibles, setAñosDisponibles] = useState<number[]>([]);

  // Modales de éxito y error
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // 🔹 Cargar autos y marcas disponibles desde la API al inicio
  useEffect(() => {
    axios.get('/api/autos')
      .then(res => {
        const autosData = res.data as Auto[]; // Asegúrate de que la respuesta es un array de autos
        setAutos(autosData);

        // Obtener marcas y años únicos
        const marcas = [...new Set(autosData.map(auto => auto.marca))];
        setMarcasDisponibles(marcas);

        const años = [...new Set(autosData.map(auto => auto.año))].sort((a, b) => b - a); // Ordenar los años
        setAñosDisponibles(años);
      })
      .catch(err => console.error('Error cargando autos:', err));
  }, []);

  // 🔹 Filtrar autos por marca y/o año
  useEffect(() => {
    let autosFiltrados = autos;

    if (marcaSeleccionada) {
      autosFiltrados = autosFiltrados.filter(auto =>
        auto.marca.toLowerCase().includes(marcaSeleccionada.toLowerCase())
      );
    }

    if (añoSeleccionado) {
      autosFiltrados = autosFiltrados.filter(auto =>
        auto.año === (typeof añoSeleccionado === 'number' ? añoSeleccionado : parseInt(añoSeleccionado))
      );
    }

    setAutosFiltrados(autosFiltrados);
    setAutoSeleccionado(null); // Reseteamos la selección al cambiar el filtro
  }, [marcaSeleccionada, añoSeleccionado, autos]);

  const handleEliminar = async (e: FormEvent) => {
    e.preventDefault();
    if (!autoSeleccionado) return;

    try {
      await axios.delete(`/api/autos/${autoSeleccionado.id}`);
      setShowSuccess(true); // Mostrar el modal de éxito

      // 🔄 Refrescar autos
      const res = await axios.get('/api/autos');
      setAutos(res.data);
      setMarcaSeleccionada(''); // Reseteamos el filtro de marca
      setAñoSeleccionado(''); // Reseteamos el filtro de año
      setAutosFiltrados([]);
      setAutoSeleccionado(null);
    } catch (err) {
      console.error('Error eliminando auto:', err);
      setShowError(true); // Mostrar el modal de error
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Eliminar Auto Usado</h1>

      <div className="mb-4">
        {/* Desplegable para seleccionar la marca */}
        <select
          value={marcaSeleccionada}
          onChange={e => setMarcaSeleccionada(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Selecciona una marca...</option>
          {marcasDisponibles.map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>

        {/* Desplegable para seleccionar el año */}
        <select
          value={añoSeleccionado}
          onChange={e => setAñoSeleccionado(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona un año...</option>
          {añosDisponibles.map((año) => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </select>
      </div>

      {autosFiltrados.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Resultados:</p>
          <ul className="space-y-1">
            {autosFiltrados.map(auto => (
              <li
                key={auto.id}
                className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  autoSeleccionado?.id === auto.id ? 'bg-red-100' : ''
                }`}
                onClick={() => setAutoSeleccionado(auto)}
              >
                {auto.marca} {auto.modelo} ({auto.año}) ({auto.kilometros} km)
              </li>
            ))}
          </ul>
        </div>
      )}

      {autoSeleccionado && (
        <div className="mt-6 bg-white p-4 border rounded shadow space-y-4 max-w-[635px]">
          <h3 className="text-xl font-semibold mb-4">Detalles del Auto</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Primera fila: Marca, Modelo, Versión */}
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Marca:</strong> {autoSeleccionado.marca}</div>
              <div><strong>Modelo:</strong> {autoSeleccionado.modelo}</div>
              <div><strong>Versión:</strong> {autoSeleccionado.version}</div>
            </div>

            {/* Segunda fila: Año, Precio, Kilómetros */}
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Año:</strong> {autoSeleccionado.año}</div>
              <div><strong>Precio:</strong> {autoSeleccionado.precio} {autoSeleccionado.moneda}</div>
              <div><strong>Kilómetros:</strong> {autoSeleccionado.kilometros} km</div>
            </div>

            {/* Tercera fila: Color, Categoría, Descripción */}
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Color:</strong> {autoSeleccionado.color}</div>
              <div><strong>Categoría:</strong> {autoSeleccionado.categoria}</div>
              <div><strong>Descripción:</strong> {autoSeleccionado.descripcion}</div>
            </div>
          </div>

          {/* Imágenes del auto en fila */}
          <div className="flex flex-row space-x-2 justify-start mt-4">
            {autoSeleccionado.foto1 && (
              <img src={autoSeleccionado.foto1} alt="Foto 1" className="w-36 h-36 object-cover" />
            )}
            {autoSeleccionado.foto2 && (
              <img src={autoSeleccionado.foto2} alt="Foto 2" className="w-36 h-36 object-cover" />
            )}
            {autoSeleccionado.foto3 && (
              <img src={autoSeleccionado.foto3} alt="Foto 3" className="w-36 h-36 object-cover" />
            )}
            {autoSeleccionado.foto4 && (
              <img src={autoSeleccionado.foto4} alt="Foto 4" className="w-36 h-36 object-cover" />
            )}
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

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">¡Vehiculo eliminado con éxito!</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowSuccess(false)} className="bg-green-500 text-white p-2 rounded mt-4">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showError && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">Hubo un error al eliminar el vehiculo</p>
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
