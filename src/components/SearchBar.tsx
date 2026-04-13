import React from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => (
  <div className="relative flex-1">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
      🔍
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, brand or category..."
      className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
    />
  </div>
)

export default SearchBar
