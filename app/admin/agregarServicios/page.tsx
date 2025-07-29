"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Vehiculo {
  id: number;
  patente: string;
  kilometros: number;
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
    fechaHoraProgramada: "",
  });

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [repuestosUsados, setRepuestosUsados] = useState<{ repuestoId: number; cantidad: number }[]>([]);
  const [filtroNombreRepuesto, setFiltroNombreRepuesto] = useState("");
  const [filtroCodigoRepuesto, setFiltroCodigoRepuesto] = useState("");

  // Estados de modales
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await axios.get("/api/vehiculos");
        setVehiculos(res.data);
      } catch (err) {
        console.error("Error al cargar vehículos", err);
        setMensaje("Error al cargar vehículos");
        setShowError(true);
      }
    };

    const fetchRepuestos = async () => {
      try {
        const res = await axios.get("/api/repuestos");
        setRepuestos(res.data);
      } catch (err) {
        console.error("Error al cargar repuestos", err);
        setMensaje("Error al cargar repuestos");
        setShowError(true);
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

    const vehiculoSeleccionado = vehiculos.find(v => v.id === Number(form.vehiculoId));
    if (!vehiculoSeleccionado) {
      setMensaje("Debe seleccionar un vehículo válido.");
      setShowError(true);
      return;
    }

    const repuestosFiltrados = repuestosUsados.filter((r) => r.cantidad > 0);

    try {
      await axios.post("/api/services", {
        ...form,
        vehiculoId: Number(form.vehiculoId),
        kilometros: vehiculoSeleccionado.kilometros, // se pasa automáticamente
        repuestosUsados: repuestosFiltrados,
      });

      setMensaje("Service registrado correctamente.");
      setShowSuccess(true);

      setForm({
        vehiculoId: "",
        nombreCliente: "",
        telefonoCliente: "",
        domicilioCliente: "",
        descripcion: "",
        fechaHoraProgramada: "",
      });
      setRepuestosUsados([]);
    } catch (err) {
      console.error("Error al registrar service", err);
      setMensaje("Error al registrar el service.");
      setShowError(true);
    }
  };

  const repuestosFiltrados = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtroNombreRepuesto.toLowerCase()) &&
    r.codigo.toLowerCase().includes(filtroCodigoRepuesto.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Agregar Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          name="vehiculoId"
          value={form.vehiculoId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccionar Vehículo (Patente)</option>
          {vehiculos.map((vehiculo) => (
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

      {/* Modal éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="mt-4">
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal error */}
      {showError && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="mt-4">
              <button
                onClick={() => setShowError(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
