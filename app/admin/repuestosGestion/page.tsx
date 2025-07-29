"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Repuesto {
  id: number;
  nombre: string;
  codigo: string;
  cantidadDisponible: number;
  descripcion?: string;
}

export default function GestionRepuestos() {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [nuevoRepuesto, setNuevoRepuesto] = useState<Partial<Repuesto>>({});
  const [editedRepuesto, setEditedRepuesto] = useState<Partial<Repuesto>>({});
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCodigo, setFiltroCodigo] = useState("");

  // Estados para modales
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [repuestoToDelete, setRepuestoToDelete] = useState<number | null>(null);

  const fetchRepuestos = async () => {
    try {
      const res = await axios.get("/api/repuestos");
      setRepuestos(res.data);
    } catch (err) {
      console.error("Error al obtener repuestos", err);
      setMensaje("Error al cargar los repuestos");
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, []);

  const handleNuevoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoRepuesto({ ...nuevoRepuesto, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedRepuesto({ ...editedRepuesto, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    try {
      await axios.post("/api/repuestos", nuevoRepuesto);
      setNuevoRepuesto({});
      setMensaje("Repuesto agregado con éxito");
      setShowSuccess(true);
      fetchRepuestos();
    } catch (err) {
      console.error("Error al agregar repuesto", err);
      setMensaje("Error al agregar repuesto");
      setShowError(true);
    }
  };

  const handleEditClick = (r: Repuesto) => {
    setEditMode(r.id);
    setEditedRepuesto(r);
  };

  const handleSave = async (id: number) => {
    try {
      await axios.put(`/api/repuestos/${id}`, editedRepuesto);
      setEditMode(null);
      setMensaje("Repuesto modificado con éxito");
      setShowSuccess(true);
      fetchRepuestos();
    } catch (err) {
      console.error("Error al modificar repuesto", err);
      setMensaje("Error al modificar repuesto");
      setShowError(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setRepuestoToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (repuestoToDelete !== null) {
      try {
        await axios.delete(`/api/repuestos/${repuestoToDelete}`);
        setMensaje("Repuesto eliminado con éxito");
        setShowSuccess(true);
        fetchRepuestos();
      } catch (err) {
        console.error("Error al eliminar repuesto", err);
        setMensaje("Error al eliminar repuesto");
        setShowError(true);
      } finally {
        setShowConfirm(false);
        setRepuestoToDelete(null);
      }
    }
  };

  const repuestosFiltrados = repuestos.filter((r) =>
    r.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
    r.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestión de Repuestos</h1>

      {/* Agregar repuesto */}
      <div className="mb-6 border p-4 rounded bg-gray-100">
        <h2 className="text-lg font-medium mb-2">Agregar nuevo repuesto</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="nombre"
            value={nuevoRepuesto.nombre || ""}
            onChange={handleNuevoChange}
            placeholder="Nombre"
            className="border p-2 rounded"
          />
          <input
            name="codigo"
            value={nuevoRepuesto.codigo || ""}
            onChange={handleNuevoChange}
            placeholder="Código"
            className="border p-2 rounded"
          />
          <input
            name="cantidadDisponible"
            type="number"
            value={nuevoRepuesto.cantidadDisponible || ""}
            onChange={handleNuevoChange}
            placeholder="Cantidad"
            className="border p-2 rounded"
          />
          <textarea
            name="descripcion"
            value={nuevoRepuesto.descripcion || ""}
            onChange={handleNuevoChange}
            placeholder="Descripción (opcional)"
            className="border p-2 rounded col-span-2"
          />
        </div>
        <button
          onClick={handleAgregar}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Buscar por código"
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Tabla de repuestos */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Código</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestosFiltrados.map((r) => (
            <tr key={r.id}>
              {editMode === r.id ? (
                <>
                  <td className="border p-2">
                    <input
                      name="nombre"
                      value={editedRepuesto.nombre || ""}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="codigo"
                      value={editedRepuesto.codigo || ""}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="cantidadDisponible"
                      type="number"
                      value={editedRepuesto.cantidadDisponible || ""}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      name="descripcion"
                      value={editedRepuesto.descripcion || ""}
                      onChange={handleEditChange}
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="border p-2 space-y-1">
                    <button
                      onClick={() => handleSave(r.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded block w-full"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-400 text-white px-2 py-1 rounded block w-full"
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2">{r.nombre}</td>
                  <td className="border p-2">{r.codigo}</td>
                  <td className="border p-2">{r.cantidadDisponible}</td>
                  <td className="border p-2">{r.descripcion}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEditClick(r)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(r.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
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

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">
              ¿Seguro que querés eliminar este repuesto?
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
