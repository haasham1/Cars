import React, { useState } from 'react'
import type { Vehicle } from '../types/vehicle'
import { getCarImageUrl } from '../services/api'

interface Props {
  vehicle: Vehicle
  onClick: () => void
}

const VehicleCard: React.FC<Props> = ({ vehicle, onClick }) => {
  const inStock = vehicle.availabilityStatus === 'In Stock'
  const hasDiscount = vehicle.discountPercentage > 0
  const discountedPrice = vehicle.price * (1 - vehicle.discountPercentage / 100)

  const carImage = vehicle.brand
    ? getCarImageUrl(vehicle.brand, vehicle.title)
    : vehicle.thumbnail

  const [imgSrc, setImgSrc] = useState(carImage)

  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >

      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={imgSrc}
          alt={vehicle.title}
          onError={() => setImgSrc(vehicle.thumbnail)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
            -{Math.round(vehicle.discountPercentage)}% OFF
          </span>
        )}
        
        <span className={`absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full shadow-lg text-white ${
          inStock ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {inStock ? '● Available' : '○ Sold'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {(vehicle.brand || vehicle.category) && (
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-2">
            {vehicle.brand ?? vehicle.category}
          </span>
        )}
        <h3 className="text-sm font-black text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
          {vehicle.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {vehicle.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <span className="block text-lg font-black bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              ${discountedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            {hasDiscount && (
              <span className="block text-[10px] text-gray-400 line-through font-medium">
                ${vehicle.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <span className="text-amber-500 text-sm">★</span>
            <span className="text-xs text-amber-700 font-black">{vehicle.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard
