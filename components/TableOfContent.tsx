import type { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents, uuidToId } from 'notion-utils'
import { useMemo, useState, useEffect } from 'react'
import clx from 'classnames'

import { Post } from '@/lib/types'

interface Props {
  post: Post
  postRecordMap: ExtendedRecordMap
}

const TableOfContent = ({ postRecordMap }: Props) => {
  const [highlightBlockId, setHighlightBlockId] = useState<string | null>(null)
  const toc = useMemo(() => {
    const id = Object.keys(postRecordMap.block)[0]
    const block = postRecordMap.block[id]?.value

    return getPageTableOfContents(block as PageBlock, postRecordMap)
  }, [postRecordMap])

  useEffect(() => {
    const $anchors = document.querySelectorAll('.notion-h[data-id]')
    const anchorVisiblilityRecord: [string, boolean][] = []

    $anchors.forEach((section) => {
      const id = section.getAttribute('data-id')
      if (!id) return
      anchorVisiblilityRecord.push([id, false])
    })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('data-id')
          const index = anchorVisiblilityRecord.findIndex(
            (item) => item[0] === id
          )

          if (id && entry.isIntersecting) {
            anchorVisiblilityRecord[index][1] = true
          } else if (id && !entry.isIntersecting) {
            anchorVisiblilityRecord[index][1] = false
          }
        }

        for (const [id, visible] of anchorVisiblilityRecord) {
          if (visible) {
            setHighlightBlockId(id)
            break
          }
        }
      },
      {
        rootMargin: '66px 0px 0px 0px',
      }
    )

    $anchors.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      $anchors.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  return (
    <nav>
      <div className="primary-text text-lg leading-8 font-bold font-title">
        Table of Contents
      </div>

      {toc.length === 0 ? (
        <div className="mt-3">
          <code className="leading-8 bg-dark-50 text-white px-3 py-1 rounded-sm">
            NULL
          </code>
        </div>
      ) : (
        <ul className="list-inside list-none mt-3 -mx-1 space-y-1">
          <li className="leading-4">
            <a
              href="#blog-title"
              onClick={() => setHighlightBlockId('blog-title')}
            >
              <div
                className={clx(
                  'flex py-2 px-2.5 lg:rounded-lg lg:border-none lg:py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors',
                  highlightBlockId === 'blog-title' &&
                    'bg-gray-200 dark:bg-gray-800'
                )}
              >
                🏠
              </div>
            </a>
          </li>

          {toc.map((item) => {
            const id = uuidToId(item.id)

            return (
              <li
                key={id}
                className="leading-4"
                style={{
                  paddingLeft: item.indentLevel * 0.8 + 'rem',
                }}
              >
                <a href={`#${id}`} onClick={() => setHighlightBlockId(id)}>
                  <div
                    className={clx(
                      'flex py-2 px-2.5 lg:rounded-lg lg:border-none lg:py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors',
                      highlightBlockId === id && 'bg-gray-200 dark:bg-gray-800'
                    )}
                  >
                    {item.text}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}

export default TableOfContent
