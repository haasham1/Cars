import React, { useEffect } from 'react'
import type { Vehicle } from '../types/vehicle'
import { getCarImageUrl } from '../services/api'

interface Props {
  vehicle: Vehicle
  onClose: () => void
}

const VehicleModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const carImage = vehicle.brand ? getCarImageUrl(vehicle.brand, vehicle.title) : vehicle.thumbnail
  const inStock = vehicle.availabilityStatus === 'In Stock'
  const hasDiscount = vehicle.discountPercentage > 0
  const discountedPrice = vehicle.price * (1 - vehicle.discountPercentage / 100)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white dark:bg-[#1a1a2e] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative h-80 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 overflow-hidden">
          <img src={carImage} alt={vehicle.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-cyan-400 text-black text-xs font-black px-3 py-1 rounded-full">
              -{Math.round(vehicle.discountPercentage)}% OFF
            </span>
          )}
          <span
            className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
              inStock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {vehicle.availabilityStatus}
          </span>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest">
                {vehicle.brand ?? vehicle.category}
              </span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{vehicle.title}</h2>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 px-3 py-1.5 rounded-full">
              <span className="text-amber-500 text-lg">★</span>
              <span className="text-sm text-amber-600 dark:text-amber-400 font-bold">{vehicle.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-white/60 text-base leading-relaxed mb-6">{vehicle.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400">
              ${discountedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 dark:text-white/30 line-through">
                ${vehicle.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-white/40 mb-1">Stock</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{vehicle.stock} units</p>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-white/40 mb-1">Category</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{vehicle.category}</p>
            </div>
          </div>

          {/* Tags */}
          {vehicle.tags && vehicle.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 dark:text-white/40 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {vehicle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-semibold rounded-full border border-violet-200 dark:border-violet-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleModal
