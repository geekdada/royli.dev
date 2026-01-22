/**
 * Pagination Component
 */

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

function getPageUrl(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const linkClasses =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-light-500/50 dark:bg-dark-400/50 text-dark-900/70 dark:text-light-900/70 hover:bg-light-600 dark:hover:bg-dark-300 transition-colors'

  return (
    <nav className="flex items-center justify-center gap-3 mt-12" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={getPageUrl(basePath, currentPage - 1)} className={linkClasses}>
          <span aria-hidden="true">←</span>
          <span>Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-dark-900/30 dark:text-light-900/30 cursor-not-allowed">
          <span aria-hidden="true">←</span>
          <span>Previous</span>
        </span>
      )}

      <span className="text-sm secondary-text tabular-nums">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={getPageUrl(basePath, currentPage + 1)} className={linkClasses}>
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-dark-900/30 dark:text-light-900/30 cursor-not-allowed">
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  )
}
