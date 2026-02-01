import { Suspense } from 'react'
import { Tweet } from 'react-tweet'

function TweetSkeleton() {
  return (
    <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
      <span className="text-gray-500 dark:text-gray-400">Loading tweet...</span>
    </div>
  )
}

export function TweetEmbed({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure className="my-2! mx-auto flex flex-col items-center">
      <Suspense fallback={<TweetSkeleton />}>
        <Tweet id={id} />
      </Suspense>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
