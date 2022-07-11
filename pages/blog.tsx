import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import PostItem from '../components/PostItem'
import { getCachedBlogPosts } from '../lib/notion'
import { PaginatedResponse, Post } from '../lib/types'
import { sec } from '../lib/utils/time'

interface Props {
  posts: PaginatedResponse<Post>
}

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>{`Roy Li's Blog`}</title>
      </Head>

      <div className="mx-auto max-w-3xl container px-6">
        <h1 className="heading-text mb-8 text-4xl font-bold">Blog</h1>

        <div className="space-y-5">
          {posts.results.map((post) => (
            <div key={post.id}>
              <Link href={post.readURL}>
                <a>
                  <PostItem post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getCachedBlogPosts()

  return {
    props: { posts },
    revalidate: sec('10m'),
  }
}

export default Blog
