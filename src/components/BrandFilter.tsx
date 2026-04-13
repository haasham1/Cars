import React from 'react'

interface Props {
  makes: string[]
  selected: string
  onChange: (make: string) => void
  loading: boolean
}

const BrandFilter: React.FC<Props> = ({ makes, selected, onChange, loading }) => (
  <select
    value={selected}
    onChange={(e) => onChange(e.target.value)}
    disabled={loading}
    className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-40 shadow-sm"
  >
    <option value="">
      {loading ? 'Loading makes...' : 'All Makes'}
    </option>
    {makes.map((make) => (
      <option key={make} value={make}>
        {make}
      </option>
    ))}
  </select>
)

export default BrandFilter
