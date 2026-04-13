import axios from 'axios'
import type { VehiclesResponse } from '../types/vehicle'

const api = axios.create({ baseURL: 'https://dummyjson.com' })

export interface PaginationParams {
  limit?: number
  skip?: number
}

export const fetchVehicles = async (): Promise<VehiclesResponse> => {
  const { data } = await api.get<VehiclesResponse>('/products/category/vehicle', {
    params: { limit: 5, skip: 0 },
  })

  // Repeat cars to simulate a larger dataset for pagination testing
  const repeated = Array.from({ length: 4 }, (_, i) =>
    data.products.map((p) => ({ ...p, id: p.id + i * 100 }))
  ).flat()

  return { ...data, products: repeated, total: repeated.length }
}

// Imagin Studio — free car image CDN, no key required
export const getCarImageUrl = (make: string, model: string): string => {
  const cleanMake = make.toLowerCase().replace(/\s+/g, '-')
  const cleanModel = model.toLowerCase().replace(make.toLowerCase(), '').trim().split(/\s+/)[0]
  return `https://cdn.imagin.studio/getimage?customer=img&make=${cleanMake}&modelFamily=${cleanModel}&paintId=color-white&angle=side`
}
