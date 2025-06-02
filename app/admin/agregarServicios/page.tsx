"use client"

import { useEffect, useState } from "react"
import axios from "axios"

interface Vehiculo {
  id: number
  patente: string
}

export default function AgregarService() {
  const [form, setForm] = useState({
    vehiculoId: "",
    nombreCliente: "",
    telefonoCliente: "",
    domicilioCliente: "",
    descripcion: "",
    kilometros: "",
    fechaHoraProgramada: ""
  })

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post("/api/services", {
        ...form,
        vehiculoId: Number(form.vehiculoId),
        kilometros: Number(form.kilometros)
      })
      alert("Service registrado correctamente")
      setForm({
        vehiculoId: "",
        nombreCliente: "",
        telefonoCliente: "",
        domicilioCliente: "",
        descripcion: "",
        kilometros: "",
        fechaHoraProgramada: ""
      })
    } catch (err) {
      alert("Error al registrar service")
      console.error(err)
    }
  }

  const fetchVehiculos = async () => {
    try {
      const res = await axios.get("/api/vehiculos")
      setVehiculos(res.data)
    } catch (err) {
      console.error("Error al cargar vehículos", err)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

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

        <input type="text" name="nombreCliente" placeholder="Nombre del Cliente" value={form.nombreCliente} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="telefonoCliente" placeholder="Teléfono" value={form.telefonoCliente} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="text" name="domicilioCliente" placeholder="Domicilio" value={form.domicilioCliente} onChange={handleChange} required className="w-full border p-2 rounded" />
        <textarea name="descripcion" placeholder="Descripción del Service" value={form.descripcion} onChange={handleChange} required className="w-full border p-2 rounded h-32" />
        <input type="number" name="kilometros" placeholder="Kilómetros" value={form.kilometros} onChange={handleChange} required className="w-full border p-2 rounded" />

        <label className="block font-medium">Fecha y hora programada</label>
        <input
          type="datetime-local"
          name="fechaHoraProgramada"
          value={form.fechaHoraProgramada}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Guardar Service</button>
      </form>
    </div>
  )
}
