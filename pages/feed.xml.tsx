import dayjs from 'dayjs'
import { Feed } from 'feed'
import { GetServerSideProps } from 'next'

import { getCachedBlogPosts } from '../lib/notion'
import { PaginatedResponse, Post } from '../lib/types'

const domain = 'https://royli.dev'
const year = new Date().getFullYear()

const FeedXml = () => null

const generateRSS = (posts: PaginatedResponse<Post>): string => {
  const feed = new Feed({
    id: domain,
    link: domain,
    title: "Roy Li's Blog",
    description: '',
    copyright: `©️ ${year}, Roy Li`,
    image: `${domain}/favicon.png`,
    favicon: `${domain}/favicon.ico`,
    author: {
      name: 'Roy Li',
      link: 'https://royli.dev',
    },
  })

  // Add posts to feed based on queried data from Notion
  posts.results.forEach((post) => {
    const publishYear = dayjs(post.publishDate as string).format('YYYY')

    feed.addItem({
      title: post.title,
      id: post.id,
      link: `${domain}/blog/${publishYear}/${post.slug}`,
      description: post.excerpt || '',
      date: new Date(post.publishDate),
    })
  })

  return feed.rss2()
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate')

  const posts = await getCachedBlogPosts({ pageSize: 9999 })
  const xmlFeed = generateRSS(posts)

  res.setHeader('Content-Type', 'text/xml')
  res.write(xmlFeed)
  res.end()

  return {
    props: {},
  }
}

export default FeedXml
