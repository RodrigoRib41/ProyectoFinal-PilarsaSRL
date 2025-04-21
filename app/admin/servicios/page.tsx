'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Vehiculo {
  id: number;
  patente: string;
  marca: string;
  version: string;
  año: number;
  kilometros: number;
}

interface Service {
  id: number;
  fecha: string;
  descripcion: string;
  kilometros: number;
}

export default function RegistrarService() {
  const [patente, setPatente] = useState('');
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [nuevoVehiculo, setNuevoVehiculo] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState({ descripcion: '', kilometros: 0 });

  const handleBuscar = () => {
    // Acá simularías una búsqueda en la DB
    const encontrado = false; // Simula que no se encontró

    if (encontrado) {
      // setVehiculo(...) si existiera
    } else {
      setNuevoVehiculo(true);
    }
  };

  const handleNuevoVehiculoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehiculo(prev => ({
      ...(prev ?? { id: 0, patente, marca: '', version: '', año: 0, kilometros: 0 }),
      [name]: name === 'año' || name === 'kilometros' ? Number(value) : value,
    }));
  };

  const handleServiceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceData(prev => ({
      ...prev,
      [name]: name === 'kilometros' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (nuevoVehiculo && vehiculo) {
      console.log('Registrar nuevo vehículo y agregar primer service:', vehiculo, serviceData);
    } else if (vehiculo) {
      console.log('Agregar nuevo service a vehículo existente:', vehiculo, serviceData);
    }

    // Acá iría el POST a la API o server action
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Registrar Service</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={patente}
          onChange={e => setPatente(e.target.value.toUpperCase())}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {nuevoVehiculo && (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p className="font-semibold mb-2">Vehículo no encontrado. Ingresá los datos para registrarlo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="marca" placeholder="Marca" className="border p-2 rounded" onChange={handleNuevoVehiculoChange} />
            <input name="version" placeholder="Versión" className="border p-2 rounded" onChange={handleNuevoVehiculoChange} />
            <input name="año" type="number" placeholder="Año" className="border p-2 rounded" onChange={handleNuevoVehiculoChange} />
            <input name="kilometros" type="number" placeholder="Kilómetros" className="border p-2 rounded" onChange={handleNuevoVehiculoChange} />
          </div>
        </div>
      )}

      {(nuevoVehiculo || vehiculo) && (
        <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Registrar nuevo service</h2>
          <input
            name="kilometros"
            type="number"
            placeholder="Kilómetros del service"
            value={serviceData.kilometros}
            onChange={handleServiceChange}
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del trabajo"
            value={serviceData.descripcion}
            onChange={handleServiceChange}
            className="border p-2 rounded w-full"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Guardar Service
          </button>
        </form>
      )}
    </div>
  );
}
