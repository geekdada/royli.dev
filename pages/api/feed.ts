import boom from '@hapi/boom'
import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Feed } from 'feed'
import { createRouter } from 'next-connect'
import pMapSeries from 'p-map-series'
import Handlebars from 'handlebars'

import feedItemTemplateString from '@/templates/feed-item'
import { getAllPosts, type Post } from '@/lib/content/posts'

const router = createRouter<NextApiRequest, NextApiResponse>()
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
        : `${domain}/${readURL}`,
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

router.get(async (req, res) => {
  if (!feedItemTemplate) {
    feedItemTemplate = Handlebars.compile(feedItemTemplateString)
  }

  res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate')

  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 10)
  const xmlFeed = await generateRSS(posts)

  res.setHeader('Content-Type', 'application/rss+xml;charset=utf-8')
  res.write(xmlFeed)
  res.end()
})

export default router.handler({
  onError: (err, req, res) => {
    console.error(err)

    if (boom.isBoom(err)) {
      res.status(err.output.statusCode).send(err.message)
      return
    } else if (err instanceof Error) {
      res.status(500).send(err.message)
      return
    }

    res.status(500).end()
  },
})
