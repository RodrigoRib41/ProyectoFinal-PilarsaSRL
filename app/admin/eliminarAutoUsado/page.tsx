'use client';

import { useState, FormEvent } from 'react';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  kilometros: number;
}

export default function EliminarAuto() {
  // Esto simula la lista de autos que tendrías desde la DB
  const autosDeEjemplo: Auto[] = [
    { id: 1, marca: 'Toyota', modelo: 'Corolla', año: 2018, kilometros: 85000 },
    { id: 2, marca: 'Ford', modelo: 'Focus', año: 2016,kilometros: 115000 },
    { id: 3, marca: 'Toyota', modelo: 'Hilux', año: 2020, kilometros: 150000 },
    { id: 4, marca: 'Chevrolet', modelo: 'Onix', año: 2019, kilometros: 15000 },
  ];

  const [busqueda, setBusqueda] = useState('');
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autoSeleccionado, setAutoSeleccionado] = useState<Auto | null>(null);

  const handleBuscar = () => {
    const resultado = autosDeEjemplo.filter(auto =>
      auto.marca.toLowerCase().includes(busqueda.toLowerCase())
    );
    setAutosFiltrados(resultado);
    setAutoSeleccionado(null);
  };

  const handleEliminar = (e: FormEvent) => {
    e.preventDefault();
    if (autoSeleccionado) {
      console.log('Auto eliminado:', autoSeleccionado);
      // Acá iría el DELETE al backend
      setAutoSeleccionado(null);
      setBusqueda('');
      setAutosFiltrados([]);
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
                {auto.marca} {auto.modelo} ({auto.año}) ({auto.kilometros})
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
            <strong>Kilometros:</strong> {autoSeleccionado.kilometros}
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
