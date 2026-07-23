import { ChevronLeft, ChevronRight } from 'lucide-react'

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 2) {
      pages.push('...')
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage)
    }

    if (currentPage < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-2 text-sm text-[var(--color-text-muted)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
              currentPage === page
                ? 'bg-[var(--color-text)] text-white'
                : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Pagination