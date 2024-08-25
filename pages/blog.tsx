import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import PostItem from '@/components/PostItem'
import { getBlogPosts } from '@/lib/notion'
import { PaginatedResponse, Post } from '@/lib/types'
import { sec } from '@/lib/utils/time'

interface Props {
  posts: PaginatedResponse<Post>
}

export const getStaticProps = (async () => {
  const posts = await getBlogPosts()

  return {
    props: { posts },
    revalidate: sec('7d'),
  }
}) satisfies GetStaticProps<Props>

export default function BlogPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`Roy Li's Blog`}</title>
      </Head>

      <div className="mx-auto max-w-3xl container px-6">
        <h1 className="heading-text mb-8 text-4xl font-bold font-title">
          Blog
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
