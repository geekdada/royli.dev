import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Post } from '../lib/types'

dayjs.extend(localizedFormat)

const PostItem = ({ post }: { post: Post }) => {
  return (
    <div className="bg-white dark:bg-dark-700 drop-shadow-md rounded overflow-hidden">
      {post.coverImage && (
        <div className="post-cover-image">
          <div
            style={{
              backgroundImage: `url(${post.coverImage})`,
            }}
          ></div>
        </div>
      )}

      <div className="px-6 py-6">
        <h2 className="heading-text font-bold text-xl mb-3">{post.title}</h2>
        <div className="border-t space-y-4 pt-3">
          {post.excerpt ? <p className="primary-text">{post.excerpt}</p> : null}

          <div className="secondary-text flex flex-wrap items-center space-x-2 text-sm">
            <div>{dayjs(post.publishDate).format('DD/MM/YYYY')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem
