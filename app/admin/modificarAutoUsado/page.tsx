'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  version: string;
  año: number;
  kilometros: number;
}

export default function ModificarAuto() {
  const autosDeEjemplo: Auto[] = [
    { id: 1, marca: 'Toyota', modelo: 'Corolla', version: 'XEI', año: 2018, kilometros: 60000 },
    { id: 2, marca: 'Ford', modelo: 'Focus', version: 'Titanium', año: 2016, kilometros: 75000 },
    { id: 3, marca: 'Toyota', modelo: 'Hilux', version: 'SRV', año: 2020, kilometros: 40000 },
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!autoSeleccionado) return;
    const { name, value } = e.target;
    setAutoSeleccionado({
      ...autoSeleccionado,
      [name]: name === 'año' || name === 'kilometros' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (autoSeleccionado) {
      console.log('Auto actualizado:', autoSeleccionado);
      // Acá se enviaría el PUT o PATCH al backend
      alert('Auto modificado (simulado)');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Modificar Auto Usado</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por marca..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {autosFiltrados.length > 0 && (
        <ul className="space-y-1 mb-6">
          {autosFiltrados.map(auto => (
            <li
              key={auto.id}
              className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                autoSeleccionado?.id === auto.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => setAutoSeleccionado(auto)}
            >
              {auto.marca} {auto.modelo} {auto.version} ({auto.año}) - {auto.kilometros} km
            </li>
          ))}
        </ul>
      )}

      {autoSeleccionado && (
        <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="marca"
              value={autoSeleccionado.marca}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Marca"
              required
            />
            <input
              type="text"
              name="version"
              value={autoSeleccionado.version}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Versión"
              required
            />
            <input
              type="number"
              name="año"
              value={autoSeleccionado.año}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Año"
              required
              min={1900}
            />
            <input
              type="number"
              name="kilometros"
              value={autoSeleccionado.kilometros}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Kilómetros"
              required
              min={0}
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </form>
      )}
    </div>
  );
}
