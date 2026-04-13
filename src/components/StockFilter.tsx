import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const STOCK_OPTIONS = [
  { label: 'All Stock', value: '' },
  { label: 'In Stock Only', value: 'in-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
]

const StockFilter: React.FC<Props> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all cursor-pointer shadow-sm"
  >
    {STOCK_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)

export default StockFilter
