"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface RepuestoUsado {
  cantidad: number;
  repuesto: {
    nombre: string;
    codigo: string;
  };
}

interface Service {
  id: number;
  vehiculo: { patente: string };
  nombreCliente: string;
  telefonoCliente: string;
  domicilioCliente: string;
  descripcion: string;
  kilometros: number;
  fecha: string;
  fechaHoraProgramada: string;
  estado: string;
  repuestosUsados?: RepuestoUsado[];
}

export default function ListarYModificarServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editedService, setEditedService] = useState<Partial<Service>>({});
  const [patenteFilter, setPatenteFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Estados para modales
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error al obtener services", err);
      setMensaje("Error al cargar los services");
      setShowError(true);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedService({ ...editedService, [e.target.name]: e.target.value });
  };

  const handleEditClick = (service: Service) => {
    setEditMode(service.id);
    setEditedService({
      ...service,
      fechaHoraProgramada: service.fechaHoraProgramada?.slice(0, 16) || "",
    });
  };

  const handleSave = async (id: number) => {
    try {
      await axios.put(`/api/services/${id}`, editedService);
      setMensaje("Service modificado con éxito");
      setShowSuccess(true);
      setEditMode(null);
      fetchServices();
    } catch (err) {
      console.error("Error al modificar service", err);
      setMensaje("Error al modificar el service");
      setShowError(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setServiceToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete !== null) {
      try {
        await axios.delete(`/api/services/${serviceToDelete}`);
        setMensaje("Service eliminado con éxito");
        setShowSuccess(true);
        fetchServices();
      } catch (err) {
        console.error("Error al eliminar service", err);
        setMensaje("Error al eliminar el service");
        setShowError(true);
      } finally {
        setShowConfirm(false);
        setServiceToDelete(null);
      }
    }
  };

  const filteredServices = services.filter((s) =>
    s.vehiculo.patente.toLowerCase().includes(patenteFilter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Listado de Services</h1>

      <div className="mb-4 flex items-center space-x-2">
        <label className="font-medium">Filtrar por patente:</label>
        <input
          type="text"
          value={patenteFilter}
          onChange={(e) => setPatenteFilter(e.target.value)}
          placeholder="Ej: ABC123"
          className="border p-2 rounded w-48"
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Patente</th>
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Domicilio</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Km</th>
            <th className="p-2 border">Programado</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((s) => (
            <React.Fragment key={s.id}>
              <tr>
                <td className="border p-2">{s.vehiculo.patente}</td>

                {editMode === s.id ? (
                  <>
                    <td className="border p-2">
                      <input
                        name="nombreCliente"
                        value={editedService.nombreCliente}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="telefonoCliente"
                        value={editedService.telefonoCliente}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="domicilioCliente"
                        value={editedService.domicilioCliente}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <textarea
                        name="descripcion"
                        value={editedService.descripcion}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="kilometros"
                        type="number"
                        value={editedService.kilometros}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="fechaHoraProgramada"
                        type="datetime-local"
                        value={editedService.fechaHoraProgramada}
                        onChange={handleEditChange}
                        className="border p-1 rounded"
                      />
                    </td>
                    <td className="border p-2">{s.estado}</td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{s.nombreCliente}</td>
                    <td className="border p-2">{s.telefonoCliente}</td>
                    <td className="border p-2">{s.domicilioCliente}</td>
                    <td className="border p-2">{s.descripcion}</td>
                    <td className="border p-2">{s.kilometros} km</td>
                    <td className="border p-2">{new Date(s.fechaHoraProgramada).toLocaleString()}</td>
                    <td className="border p-2">{s.estado}</td>
                  </>
                )}

                <td className="border p-2 space-x-2">
                  {editMode === s.id ? (
                    <>
                      <button
                        onClick={() => handleSave(s.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(s)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                      {s.repuestosUsados && s.repuestosUsados.length > 0 && (
                        <button
                          onClick={() =>
                            setExpandedRow(expandedRow === s.id ? null : s.id)
                          }
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          {expandedRow === s.id ? "Ocultar" : "Ver repuestos"}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>

              {expandedRow === s.id && Array.isArray(s.repuestosUsados) && s.repuestosUsados.length > 0 && (
                <tr className="bg-gray-50">
                  <td colSpan={9} className="p-2 border text-sm text-gray-700">
                    <strong>Repuestos usados:</strong>
                    <ul className="list-disc ml-6 mt-1">
                      {s.repuestosUsados.map((ru, index) => (
                        <li key={index}>
                          {ru.repuesto.nombre} ({ru.repuesto.codigo}) -{" "}
                          {ru.cantidad} unidad{ru.cantidad > 1 ? "es" : ""}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">{mensaje}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowError(false)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">
              ¿Seguro que querés eliminar este service?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white p-2 rounded"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
