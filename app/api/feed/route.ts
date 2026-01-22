import dayjs from 'dayjs'
import { Feed } from 'feed'
import pMapSeries from 'p-map-series'
import Handlebars from 'handlebars'
import { NextResponse } from 'next/server'

import feedItemTemplateString from '@/templates/feed-item'
import { getAllPosts, type Post } from '@/lib/content/posts'

const domain = 'https://royli.dev'
const year = new Date().getFullYear()
let feedItemTemplate: HandlebarsTemplateDelegate

const generateRSS = async (posts: Post[]): Promise<string> => {
  const feed = new Feed({
    id: domain,
    link: `${domain}/blog/feed.xml`,
    title: "Roy Li's Blog",
    description: 'feedId:54868671634178060+userId:55996681666002944',
    copyright: `©️ ${year}, Roy Li`,
    favicon: `${domain}/favicon.ico`,
    author: {
      name: 'Roy Li',
      link: 'https://royli.dev',
    },
  })

  await pMapSeries(posts, async (post) => {
    const readURL = `/blog/${post.publishYear}/${post.slug}`
    const isOldBlogPost = dayjs(post.publishDate).isBefore(
      'Sat, 05 Jun 2022 00:00:00 +0000'
    )

    feed.addItem({
      title: post.title,
      guid: isOldBlogPost
        ? `https://blog.royli.dev${readURL.replace('/blog', '')}`
        : `${domain}${readURL}`,
      link: `${domain}${readURL}`,
      date: new Date(post.publishDate),
      content: feedItemTemplate({
        ...post,
        readURL: `${domain}${readURL}`,
      }),
    })
  })

  return feed.rss2()
}

export async function GET() {
  if (!feedItemTemplate) {
    feedItemTemplate = Handlebars.compile(feedItemTemplateString)
  }

  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 10)
  const xmlFeed = await generateRSS(posts)

  return new NextResponse(xmlFeed, {
    headers: {
      'Content-Type': 'application/rss+xml;charset=utf-8',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate',
    },
  })
}
