import type { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents, uuidToId } from 'notion-utils'
import Link from 'next/link'
import clx from 'classnames'
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
    <>
      <div className="primary-text text-lg leading-8 font-bold">
        Table of Contents
      </div>

      {toc.length === 0 && (
        <div className="mt-3">
          <code className="leading-8 bg-dark-50 text-white px-3 py-1 rounded">
            NULL
          </code>
        </div>
      )}

      <ul className="list-inside list-none mt-3">
        {toc.map((item) => {
          const id = uuidToId(item.id)

          return (
            <li
              key={id}
              className="leading-8 truncate"
              style={{
                paddingLeft: item.indentLevel + 'rem',
              }}
            >
              <Link href={`#${id}`}>
                <a className="hover-links">{item.text}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default TableOfContent
