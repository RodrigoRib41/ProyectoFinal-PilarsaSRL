import { Vehiculo } from '@prisma/client'

export const getVehiculos = async (): Promise<Vehiculo[]> => {
  const res = await fetch('/api/vehiculos')
  return res.json()
}

export const createVehiculo = async (data: Omit<Vehiculo, 'id'>): Promise<Vehiculo> => {
  const res = await fetch('/api/vehiculos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const updateVehiculo = async (id: number, data: Partial<Vehiculo>): Promise<Vehiculo> => {
  const res = await fetch(`/api/vehiculos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteVehiculo = async (id: number): Promise<Vehiculo> => {
  const res = await fetch(`/api/vehiculos/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

export const getVehiculoById = async (id: number): Promise<Vehiculo> => {
  const res = await fetch(`/api/vehiculos/${id}`)
  return res.json()
}
