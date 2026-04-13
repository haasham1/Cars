import React from 'react'
import type { SortOption } from '../types/sort'

interface Props {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Name: A–Z', value: 'name_asc' },
]

const SortDropdown: React.FC<Props> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as SortOption)}
    className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer shadow-sm"
  >
    {SORT_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)

export default SortDropdown
