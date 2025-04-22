'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  kilometros: number;
}

export default function EliminarAuto() {
  const [busqueda, setBusqueda] = useState('');
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);

  // 🔹 Cargar autos desde la API al inicio
  useEffect(() => {
    axios.get('/api/autos')
      .then(res => setAutos(res.data))
      .catch(err => console.error('Error cargando autos:', err));
  }, []);

  const handleBuscar = () => {
    const resultado = autos.filter(auto =>
      auto.marca.toLowerCase().includes(busqueda.toLowerCase())
    );
    setAutosFiltrados(resultado);
    setAutoSeleccionado(null);
  };

  const handleEliminar = async (e: FormEvent) => {
    e.preventDefault();
    if (!autoSeleccionado) return;

    try {
      await axios.delete(`/api/autos/${autoSeleccionado.id}`);
      alert('Auto eliminado correctamente');

      // 🔄 Refrescar autos
      const res = await axios.get('/api/autos');
      setAutos(res.data);
      setBusqueda('');
      setAutosFiltrados([]);
      setAutoSeleccionado(null);
    } catch (err) {
      console.error('Error eliminando auto:', err);
      alert('Ocurrió un error al eliminar el auto');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Eliminar Auto Usado</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por marca..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleBuscar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
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
        <form onSubmit={handleEliminar} className="mt-6 bg-white p-4 border rounded shadow space-y-4">
          <p className="text-red-600 font-semibold">
            ¿Estás seguro de que querés eliminar el auto seleccionado?
          </p>
          <p>
            <strong>Marca:</strong> {autoSeleccionado.marca} <br />
            <strong>Modelo:</strong> {autoSeleccionado.modelo} <br />
            <strong>Año:</strong> {autoSeleccionado.año}<br />
            <strong>Kilómetros:</strong> {autoSeleccionado.kilometros}
          </p>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Eliminar Auto
          </button>
        </form>
      )}
    </div>
  );
}
