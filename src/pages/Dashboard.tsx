import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loadVehicles,
  setQuery, setSort, setSelectedMake,
  setPriceRange, setStockFilter, setPage, clearFilters,
} from '../store/vehicleSlice'
import VehicleCard from '../components/VehicleCard'
import VehicleModal from '../components/VehicleModal'
import SearchBar from '../components/SearchBar'
import SortDropdown from '../components/SortDropdown'
import BrandFilter from '../components/BrandFilter'
import PriceFilter from '../components/PriceFilter'
import StockFilter from '../components/StockFilter'
import Pagination from '../components/Pagination'
import useDebounce from '../hooks/useDebounce'
import { useState } from 'react'
import type { Vehicle } from '../types/vehicle'

const LIMIT = 10

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()

  const { items, loading, error, query, sort, selectedMake, priceRange, stockFilter, page } =
    useAppSelector((s) => s.vehicles)

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    dispatch(loadVehicles())
  }, [dispatch])

  const makes = useMemo(
    () => [...new Set(items.map((v) => v.brand).filter(Boolean))] as string[],
    [items]
  )

  const filtered = useMemo(() => {
    let result = items

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
  }, [items, debouncedQuery, sort, selectedMake, priceRange, stockFilter])

  const totalPages = Math.ceil(filtered.length / LIMIT)
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white text-xl shadow-lg">
              🚗
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                AutoDrive
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">Premium Vehicle Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-700 font-bold">{filtered.length} Live</span>
              </div>
            )}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-black text-sm shadow-lg cursor-pointer hover:scale-105 transition-transform">
              H
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12">

        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight mb-3">
            Discover Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600">
              Dream Ride
            </span>
          </h2>
          <p className="text-base text-gray-600 font-medium">
            {filtered.length} premium vehicles • Page {page} of {totalPages || '…'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg">
            <SearchBar value={query} onChange={(v) => dispatch(setQuery(v))} />
          </div>
          <div className="flex flex-wrap gap-3">
            <BrandFilter makes={makes} selected={selectedMake} onChange={(v) => dispatch(setSelectedMake(v))} loading={loading} />
            <PriceFilter value={priceRange} onChange={(v) => dispatch(setPriceRange(v))} />
            <StockFilter value={stockFilter} onChange={(v) => dispatch(setStockFilter(v))} />
            <SortDropdown value={sort} onChange={(v) => dispatch(setSort(v))} />
          </div>
        </div>

        {/* Active Filters */}
        {(selectedMake || priceRange || stockFilter) && (
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="text-sm text-gray-600 font-semibold">Active:</span>
            {selectedMake && (
              <button
                onClick={() => dispatch(setSelectedMake(''))}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:scale-105 transition-all shadow-md"
              >
                {selectedMake} ✕
              </button>
            )}
            {priceRange && (
              <button
                onClick={() => dispatch(setPriceRange(''))}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:scale-105 transition-all shadow-md"
              >
                Price ✕
              </button>
            )}
            {stockFilter && (
              <button
                onClick={() => dispatch(setStockFilter(''))}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:scale-105 transition-all shadow-md"
              >
                {stockFilter === 'in-stock' ? 'In Stock' : 'Out of Stock'} ✕
              </button>
            )}
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-sm text-red-600 font-bold underline underline-offset-2 hover:text-red-700 transition"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Info */}
        {!loading && !error && (
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Showing{' '}
            <span className="text-violet-600 font-black">
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)}
            </span>{' '}
            of <span className="text-violet-600 font-black">{filtered.length}</span>
            {debouncedQuery && (
              <> for <span className="text-cyan-600 font-black">"{debouncedQuery}"</span></>
            )}
          </p>
        )}

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-200 rounded-full" />
              <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <p className="text-base text-gray-600 font-bold animate-pulse">Loading premium vehicles...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-4xl">⚠️</div>
            <p className="text-red-600 text-base font-bold">{error}</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-4xl">🔍</div>
            <p className="text-base text-gray-600 font-bold">No vehicles found</p>
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginated.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => setSelectedVehicle(vehicle)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
        )}
      </main>

      {selectedVehicle && <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />}
    </div>
  )
}

export default Dashboard
