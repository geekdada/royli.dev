import dayjs from 'dayjs'
import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import type { ExtendedRecordMap } from 'notion-types'
import { ParsedUrlQuery } from 'querystring'
import { FiArrowLeft, FiTag } from 'react-icons/fi'
import clx from 'classnames'
import { Balancer } from 'react-wrap-balancer'

import Copyright from '@/components/Copyright'
import { NotionPage } from '@/components/NotionPage'
import PageHead from '@/components/PageHead'
import TableOfContent from '@/components/TableOfContent'
import { siteURL } from '@/lib/config'
import {
  getPrivatePageRecordMapByPageId,
  getCachedBlogPosts,
  getCachedBlogPostBySlug,
} from '@/lib/notion'
import { sec } from '@/lib/utils/time'
import type { Post } from '@/lib/types'
import { useTheme } from '@/lib/theme'

interface Props {
  post: Post | null
  postRecordMap: ExtendedRecordMap | null
}

const Comments = dynamic(() => import('@/components/Comments'), {
  ssr: false,
})

const BlogPostPage: NextPage<Props> = ({ post, postRecordMap }) => {
  const { theme } = useTheme()

  if (!post || !postRecordMap) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} withDarkMode={theme === 'dark'} />
      </>
    )
  }

  const { isGallaryView } = post
  const canonical = new URL(post.readURL, siteURL)
  const hasCoverImage = Boolean(post.coverImage)

  return (
    <>
      <PageHead
        title={`${post.title} - Roy Li's Blog`}
        description={post.excerpt}
        image={post.coverImage}
        url={canonical.toString()}
      />

      <div className="container mx-auto md:px-6 max-w-3xl lg:max-w-5xl xl:max-w-7xl">
        {post.coverImage && (
          <div className="mb-0 md:mb-8">
            <div className="md:rounded-lg md:shadow-md overflow-hidden post-cover-image">
              <div
                style={{
                  backgroundImage: `url(${post.coverImage})`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-10 gap-8">
          <div
            className={clx(
              'space-y-4',
              isGallaryView ? 'col-span-full' : 'col-span-10 lg:col-span-7'
            )}
          >
            <div className="post-section">
              <article
                className={clx(
                  'px-5 lg:px-7',
                  hasCoverImage ? 'pt-5 lg:pt-6' : 'pt-3 lg:pt-4'
                )}
              >
                <h1
                  className="relative mb-2 flex justify space-x-2 text-3xl font-bold font-title notion-h"
                  data-id="blog-title"
                >
                  <span id="blog-title" className="notion-header-anchor" />
                  <Balancer>
                    {post.coverIcon ? (
                      <span className="mr-2">{post.coverIcon}</span>
                    ) : null}
                    {post.title}
                  </Balancer>
                </h1>

                <div className="my-6">
                  <NotionPage recordMap={postRecordMap} />
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="my-6">
                    <FiTag className="inline-block mr-2" />

                    {post.tags.map((tag) => (
                      <Link href={`/blog/tags/${tag.id}`} key={tag.id}>
                        <div
                          key={tag.id}
                          className="inline-block px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-dark-900 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-dark-800 cursor-pointer"
                        >
                          {tag.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <aside>
                  <Copyright
                    canonical={`${siteURL}${post.readURL}`}
                    title={`${post.title} - Roy Li's Blog`}
                    publishDate={post.publishDate}
                  />
                </aside>
              </article>
            </div>

            <div className="post-section">
              <Link href="/blog" passHref>
                <div className="group flex cursor-pointer items-center justify-between p-4 hover:bg-light-200 hover:opacity-80 dark:hover:bg-dark-900 font-mono">
                  <span>cd /blog</span>
                  <FiArrowLeft className="h-4 w-4 transition-all duration-150 group-hover:-translate-x-1" />
                </div>
              </Link>
            </div>

            <div id="comments-section" className="post-section p-4">
              <Comments />
            </div>
          </div>

          {!isGallaryView && (
            <div className="sticky top-20 col-span-3 hidden lg:block">
              <div className="max-h-screen-md rounded border border-gray-400/30 p-4 relative bg-white dark:bg-dark-700 overflow-hidden">
                <TableOfContent post={post} postRecordMap={postRecordMap} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const posts = await getCachedBlogPosts({ pageSize: 9999 })

  return {
    paths: posts.results.map((p) => {
      const publishYear = dayjs(p.publishDate as string).format('YYYY')
      return {
        params: { slug: p.slug, year: publishYear },
      }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  interface Props extends ParsedUrlQuery {
    slug: string
    year: string
  }

  const { slug } = params as Props
  const post = await getCachedBlogPostBySlug(slug)

  if (!post) {
    return {
      props: {
        post: null,
        postRecordMap: null,
      },
      revalidate: sec('7d'),
    }
  }

  const postPage = await getPrivatePageRecordMapByPageId(post.id)

  return {
    props: {
      post,
      postRecordMap: postPage,
    },
    revalidate: sec('7d'),
  }
}

export default BlogPostPage
