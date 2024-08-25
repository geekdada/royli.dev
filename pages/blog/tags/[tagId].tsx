import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { FiTag } from 'react-icons/fi'

import PostItem from '@/components/PostItem'
import { getTags, getBlogPosts } from '@/lib/notion'
import { PaginatedResponse, Post } from '@/lib/types'

interface Props {
  posts: PaginatedResponse<Post> | null
  tagName: string | null
}

export const getServerSideProps = (async ({ params }) => {
  interface Props extends ParsedUrlQuery {
    tagId: string
  }

  const { tagId } = params as Props
  const tags = await getTags()
  const tag = tags.find((tag) => tag.id === tagId)

  if (!tag) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  const posts = await getBlogPosts({ options: { tagId }, pageSize: 50 })

  return {
    props: { posts, tagName: tag.name },
  }
}) satisfies GetServerSideProps<Props>

export default function TagPage({
  tagName,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!posts || !tagName) {
    return null
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
