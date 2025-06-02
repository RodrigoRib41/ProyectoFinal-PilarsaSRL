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
      alert("Vehículo agregado correctamente!")
      setVehiculo({ patente: "", marca: "", version: "", año: 0, kilometros: 0 })
    } catch (err) {
      console.error("Error al agregar vehículo", err)
      alert("Error al agregar vehículo")
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 border rounded shadow">
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
    </div>
  )
}
