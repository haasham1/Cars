export interface Vehicle {
  id: number
  title: string
  brand?: string
  category: string
  price: number
  rating: number
  stock: number
  thumbnail: string
  description: string
  availabilityStatus: string
  tags: string[]
  discountPercentage: number
}

export interface VehiclesResponse {
  products: Vehicle[]
  total: number
  skip: number
  limit: number
}
