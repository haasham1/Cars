import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under $20k', value: '0-20000' },
  { label: '$20k - $30k', value: '20000-30000' },
  { label: '$30k - $40k', value: '30000-40000' },
  { label: 'Over $40k', value: '40000-999999' },
]

const PriceFilter: React.FC<Props> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer shadow-sm"
  >
    {PRICE_RANGES.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
)

export default PriceFilter
