"use client"

import { useEffect, useState } from "react"
import axios from "axios"

type Vehiculo = {
  id: number
  patente: string
  marca: string
  version: string
  año: number
  kilometros: number
}

export default function ListarVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [form, setForm] = useState({
    patente: "",
    marca: "",
    version: "",
    año: 0,
    kilometros: 0
  })
  const [patenteFilter, setPatenteFilter] = useState("")

  // Estados para modales
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<number | null>(null)

  const obtenerVehiculos = async () => {
    try {
      const res = await axios.get("/api/vehiculos")
      setVehiculos(res.data)
    } catch (err) {
      console.error("Error al obtener vehículos", err)
      setMensaje("Error al cargar los vehículos")
      setShowError(true)
    }
  }

  useEffect(() => {
    obtenerVehiculos()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const solicitarConfirmacion = (id: number) => {
    setVehiculoAEliminar(id)
    setShowConfirm(true)
  }

  const confirmarEliminar = async () => {
    if (!vehiculoAEliminar) return

    try {
      await axios.delete(`/api/vehiculos/${vehiculoAEliminar}`)
      setMensaje("Vehículo eliminado con éxito")
      setShowSuccess(true)
      obtenerVehiculos()
    } catch (err) {
      console.error("Error al eliminar vehículo", err)
      setMensaje("Hubo un error al eliminar el vehículo")
      setShowError(true)
    } finally {
      setShowConfirm(false)
      setVehiculoAEliminar(null)
    }
  }

  const handleEditar = (vehiculo: Vehiculo) => {
    setEditando(vehiculo.id)
    setForm({
      patente: vehiculo.patente,
      marca: vehiculo.marca,
      version: vehiculo.version,
      año: vehiculo.año,
      kilometros: vehiculo.kilometros
    })
  }

  const handleGuardar = async (id: number) => {
    try {
      await axios.put(`/api/vehiculos/${id}`, {
        ...form,
        año: Number(form.año),
        kilometros: Number(form.kilometros)
      })
      setEditando(null)
      setMensaje("Vehículo modificado con éxito")
      setShowSuccess(true)
      obtenerVehiculos()
    } catch (err) {
      console.error("Error al modificar vehículo", err)
      setMensaje("Hubo un error al modificar el vehículo")
      setShowError(true)
    }
  }

  const filteredVehiculos = vehiculos.filter((v) =>
    v.patente.toLowerCase().includes(patenteFilter.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lista de Vehículos</h1>

      <div className="mb-6 flex items-center space-x-2">
        <label className="font-medium">Filtrar por patente:</label>
        <input
          type="text"
          value={patenteFilter}
          onChange={(e) => setPatenteFilter(e.target.value)}
          placeholder="Ej: ABC123"
          className="border p-2 rounded w-48"
        />
      </div>

      {filteredVehiculos.map((v) => (
        <div key={v.id} className="border p-4 mb-4 rounded flex flex-col gap-2">

          {editando === v.id ? (
            <>
              <input
                type="text"
                name="patente"
                value={form.patente}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="version"
                value={form.version}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="año"
                value={form.año}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="kilometros"
                value={form.kilometros}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <button
                onClick={() => handleGuardar(v.id)}
                className="bg-green-500 text-white py-1 rounded hover:bg-green-600"
              >
                Guardar
              </button>
            </>
          ) : (
            <>
              <p><strong>Patente:</strong> {v.patente}</p>
              <p><strong>Marca:</strong> {v.marca}</p>
              <p><strong>Versión:</strong> {v.version}</p>
              <p><strong>Año:</strong> {v.año}</p>
              <p><strong>Kilómetros:</strong> {v.kilometros}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(v)}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                >
                  Modificar
                </button>
                <button
                  onClick={() => solicitarConfirmacion(v.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">¿Estás seguro de que deseas eliminar este vehículo?</p>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={confirmarEliminar}
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

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
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
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
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
    </div>
  )
}
