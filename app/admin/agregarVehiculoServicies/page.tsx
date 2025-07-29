"use client"

import { useState } from "react"
import axios from "axios"

export default function AgregarVehiculo() {
  const [vehiculo, setVehiculo] = useState({
    patente: "",
    marca: "",
    version: "",
    año: 0,
    kilometros: 0,
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehiculo({ ...vehiculo, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post("/api/vehiculos", {
        ...vehiculo,
        año: Number(vehiculo.año),
        kilometros: Number(vehiculo.kilometros),
      })
      setShowSuccess(true)
      setVehiculo({ patente: "", marca: "", version: "", año: 0, kilometros: 0 })
    } catch (err: unknown) {
      console.error("Error al agregar vehículo", err)

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          // Caso patente duplicada
          setErrorMessage("La patente ingresada ya existe en la base de datos.")
        } else if (err.response?.data?.message) {
          // Otros mensajes específicos del backend
          setErrorMessage(err.response.data.message)
        } else {
          setErrorMessage("Hubo un error al agregar el vehículo.")
        }
      } else {
        setErrorMessage("Error inesperado al agregar el vehículo.")
      }

      setShowError(true)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 border rounded shadow relative">
      <h1 className="text-2xl font-semibold mb-4">Agregar Vehículo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="patente"
          value={vehiculo.patente}
          onChange={handleChange}
          placeholder="Patente"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="marca"
          value={vehiculo.marca}
          onChange={handleChange}
          placeholder="Marca"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="version"
          value={vehiculo.version}
          onChange={handleChange}
          placeholder="Versión"
          required
          className="w-full p-2 border rounded"
        />
        <label className="block font-medium">Año</label>
        <input
          type="number"
          name="año"
          value={vehiculo.año}
          onChange={handleChange}
          placeholder="Año"
          required
          className="w-full p-2 border rounded"
        />

        <label className="block font-medium">Kilómetros</label>
        <input
          type="number"
          name="kilometros"
          value={vehiculo.kilometros}
          onChange={handleChange}
          placeholder="Kilómetros"
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Agregar Vehículo
        </button>
      </form>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-black font-bold">¡Vehículo agregado con éxito!</p>
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
            <p className="text-black font-bold">{errorMessage}</p>
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
