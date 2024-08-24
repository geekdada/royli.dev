import dayjs from 'dayjs'
import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { FiTag } from 'react-icons/fi'
import DefaultErrorPage from 'next/error'

import PostItem from '@/components/PostItem'
import { getCachedTags, getBlogPosts } from '@/lib/notion'
import { sec } from '@/lib/utils/time'
import { PaginatedResponse, Post } from '@/lib/types'
import { useTheme } from '@/lib/theme'

interface Props {
  posts: PaginatedResponse<Post> | null
  tagName: string | null
}

const Tag: NextPage<Props> = ({ tagName, posts }) => {
  const { theme } = useTheme()

  if (!posts || !tagName) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} withDarkMode={theme === 'dark'} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{`${tagName} - Roy Li's Blog`}</title>
      </Head>

      <div className="mx-auto max-w-3xl container px-6">
        <h1 className="heading-text mb-8 text-4xl font-bold font-title">
          <FiTag className="inline-block mr-2" />
          <span>{tagName}</span>
        </h1>

        <div className="space-y-5">
          {posts.results.map((post) => (
            <div key={post.id}>
              <Link href={post.readURL}>
                <PostItem post={post} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const tags = await getCachedTags()

  return {
    paths: tags.map((p) => {
      return {
        params: { tagId: p.id },
      }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  interface Props extends ParsedUrlQuery {
    tagId: string
  }

  const { tagId } = params as Props
  const tags = await getCachedTags()
  const tag = tags.find((tag) => tag.id === tagId)

  if (!tag) {
    return {
      props: {
        posts: null,
        tagName: null,
      },
      revalidate: sec('7d'),
    }
  }

  const posts = await getBlogPosts({ options: { tagId }, pageSize: 50 })

  return {
    props: { posts, tagName: tag.name },
    revalidate: sec('7d'),
  }
}

export default Tag
