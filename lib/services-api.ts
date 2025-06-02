import { Service } from '@prisma/client'

export const getServices = async (): Promise<Service[]> => {
  const res = await fetch('/api/services')
  return res.json()
}

export const createService = async (data: Omit<Service, 'id'>): Promise<Service> => {
  const res = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
  const res = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteService = async (id: number): Promise<Service> => {
  const res = await fetch(`/api/services/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

export const getServiceById = async (id: number): Promise<Service> => {
  const res = await fetch(`/api/services/${id}`)
  return res.json()
}

/** 🚗 Obtener todos los services de un vehículo por su ID */
export const getServicesByVehiculoId = async (vehiculoId: number): Promise<Service[]> => {
  const res = await fetch(`/api/services?vehiculoId=${vehiculoId}`)
  return res.json()
}
