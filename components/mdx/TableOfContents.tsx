'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import clx from 'classnames'

interface TocItem {
  id: string
  text: string
  level: number
}

interface Props {
  contentSelector?: string
}

const TableOfContents = ({ contentSelector = '.prose' }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const [toc, setToc] = useState<TocItem[]>([])
  const [highlightId, setHighlightId] = useState<string | null>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault()
      setHighlightId(id)
      router.replace(`${pathname}#${id}`, { scroll: false })
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    },
    [router, pathname]
  )

  const extractHeadings = useCallback(() => {
    const container = document.querySelector(contentSelector)
    if (!container) return []

    const headings = container.querySelectorAll('h1, h2, h3, h4')
    const items: TocItem[] = []

    headings.forEach((heading) => {
      let id = heading.id
      if (!id) {
        id =
          heading.textContent
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') || ''
        heading.id = id
      }

      if (id && heading.textContent) {
        items.push({
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName[1], 10),
        })
      }
    })

    return items
  }, [contentSelector])

  useEffect(() => {
    const items = extractHeadings()
    setToc(items)

    if (items.length === 0) return

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    const visibilityRecord: Array<{ id: string; visible: boolean }> = []
    headingElements.forEach((el) =>
      visibilityRecord.push({ id: el.id, visible: false })
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = visibilityRecord.find((r) => r.id === entry.target.id)
          if (item) {
            item.visible = entry.isIntersecting
          }
        })

        for (const { id, visible } of visibilityRecord) {
          if (visible) {
            setHighlightId(id)
            break
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
      }
    )

    headingElements.forEach((el) => observer.observe(el))

    return () => {
      headingElements.forEach((el) => observer.unobserve(el))
    }
  }, [extractHeadings])

  const minLevel =
    toc.length > 0 ? Math.min(...toc.map((item) => item.level)) : 1

  const allItems = [
    { id: 'blog-title', text: '', level: minLevel, isHome: true },
    ...toc,
  ]

  return (
    <nav className="relative">
      {toc.length === 0 ? (
        <div className="text-xs text-gray-400 dark:text-gray-500 font-mono pl-3">
          No headings
        </div>
      ) : (
        <div className="relative">
          {/* Active indicator line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700/50" />

          <ul className="list-none space-y-0.5">
            {allItems.map((item, index) => {
              const isActive = highlightId === item.id
              const indent = 'isHome' in item ? 0 : (item.level - minLevel) * 12

              return (
                <li key={item.id} className="relative">
                  {/* Active indicator */}
                  <div
                    className={clx(
                      'absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-gray-900 dark:bg-white opacity-100'
                        : 'bg-transparent opacity-0'
                    )}
                  />

                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className="block"
                  >
                    <div
                      className={clx(
                        'py-1.5 pl-3 pr-2 text-[13px] leading-snug rounded-r-md transition-all duration-150',
                        'hover:bg-gray-100 dark:hover:bg-white/5',
                        isActive
                          ? 'text-gray-900 dark:text-white font-medium'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      )}
                      style={{ paddingLeft: `${12 + indent}px` }}
                    >
                      {'isHome' in item ? (
                        <span className="inline-flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                          <span>Top</span>
                        </span>
                      ) : (
                        <span className="line-clamp-2">{item.text}</span>
                      )}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default TableOfContents
