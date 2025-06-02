"use client"

import { useEffect, useState } from "react"
import axios from "axios"

interface Service {
  id: number
  vehiculo: { patente: string }
  nombreCliente: string
  telefonoCliente: string
  domicilioCliente: string
  descripcion: string
  kilometros: number
  fecha: string
  fechaHoraProgramada: string
  estado: string
}

export default function ListarYModificarServices() {
  const [services, setServices] = useState<Service[]>([])
  const [editMode, setEditMode] = useState<number | null>(null)
  const [editedService, setEditedService] = useState<Partial<Service>>({})
  const [patenteFilter, setPatenteFilter] = useState("")

  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/services")
      setServices(res.data)
    } catch (err) {
      console.error("Error al obtener services", err)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedService({ ...editedService, [e.target.name]: e.target.value })
  }

  const handleEditClick = (service: Service) => {
    setEditMode(service.id)
    setEditedService({
      ...service,
      fechaHoraProgramada: service.fechaHoraProgramada?.slice(0, 16) || "",
    })
  }

  const handleSave = async (id: number) => {
    try {
      await axios.put(`/api/services/${id}`, editedService)
      alert("Service modificado")
      setEditMode(null)
      fetchServices()
    } catch (err) {
      console.error("Error al modificar service", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que querés eliminar este service?")) {
      try {
        await axios.delete(`/api/services/${id}`)
        alert("Service eliminado")
        fetchServices()
      } catch (err) {
        console.error("Error al eliminar service", err)
      }
    }
  }

  const filteredServices = services.filter((s) =>
    s.vehiculo.patente.toLowerCase().includes(patenteFilter.toLowerCase())
  )

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
            <tr key={s.id}>
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
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
