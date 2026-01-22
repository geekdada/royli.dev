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
        id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || ''
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
    headingElements.forEach((el) => visibilityRecord.push({ id: el.id, visible: false }))

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

  const minLevel = toc.length > 0 ? Math.min(...toc.map((item) => item.level)) : 1

  return (
    <nav>
      {toc.length === 0 ? (
        <div>
          <code className="leading-8 bg-dark-50 text-white px-3 py-1 rounded-sm">NULL</code>
        </div>
      ) : (
        <ul className="list-inside list-none mt-3 -mx-1">
          <li className="leading-4">
            <a href="#blog-title" onClick={(e) => handleClick(e, 'blog-title')}>
              <div
                className={clx(
                  'flex py-1.5 px-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors',
                  highlightId === 'blog-title' && 'bg-gray-200 dark:bg-gray-800'
                )}
              >
                🏠
              </div>
            </a>
          </li>

          {toc.map((item) => (
            <li
              key={item.id}
              className="leading-4"
              style={{
                paddingLeft: (item.level - minLevel) * 0.8 + 'rem',
              }}
            >
              <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                <div
                  className={clx(
                    'flex py-1.5 px-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm',
                    highlightId === item.id && 'bg-gray-200 dark:bg-gray-800'
                  )}
                >
                  {item.text}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default TableOfContents
