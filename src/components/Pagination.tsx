import React from 'react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<Props> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-end gap-2 mt-14">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        ← Prev
      </button>

      {getPageNumbers().map((num, idx) =>
        num === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num as number)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
              page === num
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-200"
      >
        Next →
      </button>
    </div>
  )
}

export default Pagination
