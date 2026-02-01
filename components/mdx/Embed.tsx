import { TweetEmbed } from './TweetEmbed'

function extractTweetId(url: string): string | null {
  const regex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function Embed({ url, caption }: { url: string; caption?: string }) {
  // Handle Twitter/X embeds
  if (url.includes('twitter.com') || url.includes('x.com')) {
    const tweetId = extractTweetId(url)
    if (tweetId) {
      return <TweetEmbed id={tweetId} caption={caption} />
    }
  }

  return (
    <figure className="my-4">
      <iframe
        src={url}
        className="w-full aspect-video rounded-lg border border-gray-200 dark:border-gray-700"
        allowFullScreen
      />
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
