import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchVehicles } from '../services/api'
import useDebounce from '../hooks/useDebounce'
import type { Vehicle } from '../types/vehicle'
import type { SortOption } from '../types/sort'

const LIMIT = 10

interface VehicleContextType {
  // Data
  paginated: Vehicle[]
  filtered: Vehicle[]
  makes: string[]
  loading: boolean
  error: string | null
  // Pagination
  page: number
  totalPages: number
  setPage: (page: number) => void
  // Filters
  query: string
  setQuery: (q: string) => void
  sort: SortOption
  setSort: (s: SortOption) => void
  selectedMake: string
  setSelectedMake: (m: string) => void
  priceRange: string
  setPriceRange: (p: string) => void
  stockFilter: string
  setStockFilter: (s: string) => void
  clearFilters: () => void
  // Modal
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (v: Vehicle | null) => void
}

const VehicleContext = createContext<VehicleContextType | null>(null)

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [makes, setMakes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('price_asc')
  const [selectedMake, setSelectedMake] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [page, setPage] = useState(1)

  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    setLoading(true)
    fetchVehicles()
      .then((res) => {
        setAllVehicles(res.products)
        const uniqueMakes = [...new Set(res.products.map((v) => v.brand).filter(Boolean))] as string[]
        setMakes(uniqueMakes)
      })
      .catch(() => setError('Failed to load vehicles. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery, sort, selectedMake, priceRange, stockFilter])

  const filtered = useMemo(() => {
    let result = allVehicles

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase()
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.brand ?? '').toLowerCase().includes(q)
      )
    }

    if (selectedMake) {
      result = result.filter(
        (v) => (v.brand ?? '').toLowerCase() === selectedMake.toLowerCase()
      )
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter((v) => v.price >= min && v.price <= max)
    }

    if (stockFilter === 'in-stock') {
      result = result.filter((v) => v.availabilityStatus === 'In Stock')
    } else if (stockFilter === 'out-of-stock') {
      result = result.filter((v) => v.availabilityStatus !== 'In Stock')
    }

    return [...result].sort((a, b) =>
      sort === 'price_asc' ? a.price - b.price : a.title.localeCompare(b.title)
    )
  }, [allVehicles, debouncedQuery, sort, selectedMake, priceRange, stockFilter])

  const totalPages = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const clearFilters = () => {
    setQuery('')
    setSelectedMake('')
    setPriceRange('')
    setStockFilter('')
  }

  return (
    <VehicleContext.Provider value={{
      paginated, filtered, makes, loading, error,
      page, totalPages, setPage,
      query, setQuery,
      sort, setSort,
      selectedMake, setSelectedMake,
      priceRange, setPriceRange,
      stockFilter, setStockFilter,
      clearFilters,
      selectedVehicle, setSelectedVehicle,
    }}>
      {children}
    </VehicleContext.Provider>
  )
}

export const useVehicles = (): VehicleContextType => {
  const ctx = useContext(VehicleContext)
  if (!ctx) throw new Error('useVehicles must be used inside VehicleProvider')
  return ctx
}
