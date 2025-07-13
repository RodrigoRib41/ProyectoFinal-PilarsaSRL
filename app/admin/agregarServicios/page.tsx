"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Vehiculo {
  id: number;
  patente: string;
}

interface Repuesto {
  id: number;
  nombre: string;
  codigo: string;
  cantidadDisponible: number;
}

export default function AgregarService() {
  const [form, setForm] = useState({
    vehiculoId: "",
    nombreCliente: "",
    telefonoCliente: "",
    domicilioCliente: "",
    descripcion: "",
    kilometros: "",
    fechaHoraProgramada: "",
  });

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [repuestosUsados, setRepuestosUsados] = useState<{ repuestoId: number; cantidad: number }[]>([]);
  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroNombreRepuesto, setFiltroNombreRepuesto] = useState("");
  const [filtroCodigoRepuesto, setFiltroCodigoRepuesto] = useState("");

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await axios.get("/api/vehiculos");
        setVehiculos(res.data);
      } catch (err) {
        console.error("Error al cargar vehículos", err);
      }
    };

    const fetchRepuestos = async () => {
      try {
        const res = await axios.get("/api/repuestos");
        setRepuestos(res.data);
      } catch (err) {
        console.error("Error al cargar repuestos", err);
      }
    };

    fetchVehiculos();
    fetchRepuestos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRepuestoChange = (repuestoId: number, cantidad: number) => {
    setRepuestosUsados((prev) => {
      const existente = prev.find((r) => r.repuestoId === repuestoId);
      if (existente) {
        return prev.map((r) =>
          r.repuestoId === repuestoId ? { ...r, cantidad } : r
        );
      } else {
        return [...prev, { repuestoId, cantidad }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const repuestosFiltrados = repuestosUsados.filter((r) => r.cantidad > 0);

    try {
      await axios.post("/api/services", {
        ...form,
        vehiculoId: Number(form.vehiculoId),
        kilometros: Number(form.kilometros),
        repuestosUsados: repuestosFiltrados,
      });

      alert("Service registrado correctamente");

      setForm({
        vehiculoId: "",
        nombreCliente: "",
        telefonoCliente: "",
        domicilioCliente: "",
        descripcion: "",
        kilometros: "",
        fechaHoraProgramada: "",
      });
      setRepuestosUsados([]);
    } catch (err) {
      alert("Error al registrar service");
      console.error(err);
    }
  };

  const vehiculosFiltrados = vehiculos.filter((v) =>
    v.patente.toLowerCase().includes(filtroPatente.toLowerCase())
  );

  const repuestosFiltrados = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtroNombreRepuesto.toLowerCase()) &&
    r.codigo.toLowerCase().includes(filtroCodigoRepuesto.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Agregar Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Buscar patente..."
          value={filtroPatente}
          onChange={(e) => setFiltroPatente(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />

        <select
          name="vehiculoId"
          value={form.vehiculoId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccionar Vehículo (Patente)</option>
          {vehiculosFiltrados.map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.patente}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="nombreCliente"
          placeholder="Nombre del Cliente"
          value={form.nombreCliente}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="telefonoCliente"
          placeholder="Teléfono"
          value={form.telefonoCliente}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="domicilioCliente"
          placeholder="Domicilio"
          value={form.domicilioCliente}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción del Service"
          value={form.descripcion}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded h-32"
        />
        <input
          type="number"
          name="kilometros"
          placeholder="Kilómetros"
          value={form.kilometros}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <label className="block font-medium">Fecha y hora programada</label>
        <input
          type="datetime-local"
          name="fechaHoraProgramada"
          value={form.fechaHoraProgramada}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Sección de repuestos */}
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-4">Repuestos a utilizar</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={filtroNombreRepuesto}
              onChange={(e) => setFiltroNombreRepuesto(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Filtrar por código"
              value={filtroCodigoRepuesto}
              onChange={(e) => setFiltroCodigoRepuesto(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {repuestosFiltrados.map((r) => (
            <div key={r.id} className="flex items-center gap-4 mb-2">
              <label className="w-1/2">
                {r.nombre} ({r.codigo}) - Stock: {r.cantidadDisponible}
              </label>
              <input
                type="number"
                min={0}
                max={r.cantidadDisponible}
                className="w-24 border rounded p-1"
                onChange={(e) =>
                  handleRepuestoChange(r.id, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Guardar Service
        </button>
      </form>
    </div>
  );
}
