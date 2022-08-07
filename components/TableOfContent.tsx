import type { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents, uuidToId } from 'notion-utils'
import { useMemo } from 'react'

import { Post, Page } from '../lib/types'

interface Props {
  post: Post | Page
  postRecordMap: ExtendedRecordMap
}

const TableOfContent = ({ postRecordMap }: Props) => {
  const toc = useMemo(() => {
    const id = Object.keys(postRecordMap.block)[0]
    const block = postRecordMap.block[id]?.value

    return getPageTableOfContents(block as PageBlock, postRecordMap)
  }, [postRecordMap])

  return (
    <nav>
      <div className="primary-text text-lg leading-8 font-bold font-title">
        Table of Contents
      </div>

      {toc.length === 0 ? (
        <div className="mt-3">
          <code className="leading-8 bg-dark-50 text-white px-3 py-1 rounded">
            NULL
          </code>
        </div>
      ) : (
        <ul className="list-inside list-none mt-3 -mx-1">
          {toc.map((item) => {
            const id = uuidToId(item.id)

            return (
              <li
                key={id}
                className="leading-5"
                style={{
                  paddingLeft: item.indentLevel * 0.8 + 'rem',
                }}
              >
                <a href={`#${id}`}>
                  <div className="flex py-2 px-2.5 lg:rounded-lg lg:border-none lg:py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
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
