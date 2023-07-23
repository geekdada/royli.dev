import dayjs from 'dayjs'
import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import type { ExtendedRecordMap } from 'notion-types'
import { ParsedUrlQuery } from 'querystring'
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi'
import clx from 'classnames'

import Copyright from '../../../components/Copyright'
import { NotionPage } from '../../../components/NotionPage'
import PageHead from '../../../components/PageHead'
import TableOfContent from '../../../components/TableOfContent'
import Time from '../../../components/Time'
import { siteURL } from '../../../lib/config'
import { getPageByPageId, getCachedBlogPosts } from '../../../lib/notion'
import { sec } from '../../../lib/utils/time'
import { Post } from '../../../lib/types'

interface Props {
  post: Post | null
  postRecordMap: ExtendedRecordMap | null
}

const Comments = dynamic(() => import('../../../components/Comments'), {
  ssr: false,
})

const Post: NextPage<Props> = ({ post, postRecordMap }) => {
  if (!post || !postRecordMap) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

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
          <div className="md:mb-8">
            <div className="md:rounded-lg md:drop-shadow-md overflow-hidden post-cover-image">
              <div
                style={{
                  backgroundImage: `url(${post.coverImage})`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-10 gap-8">
          <div className="col-span-10 lg:col-span-7 space-y-4">
            <div className="post-section">
              <article
                className={clx(
                  'px-5 lg:px-7',
                  hasCoverImage ? 'pt-5 lg:pt-6' : 'pt-3 lg:pt-4'
                )}
              >
                <h1 className="mb-2 flex justify-between space-x-2 text-3xl font-bold font-title">
                  {post.title}
                </h1>

                <div className="secondary-text flex flex-wrap items-center gap-2">
                  <span>
                    <Time datetime={post.publishDate} />
                  </span>
                  <span>·</span>
                  <span>Roy</span>
                  <span>·</span>
                  <Link href="#comments-section" className="hover-links">
                    <FiMessageCircle size={18} className="mr-1 inline" />
                    <span>comments</span>
                  </Link>
                </div>

                <div className="my-6">
                  <NotionPage recordMap={postRecordMap} />
                </div>

                <Copyright
                  canonical={`${siteURL}${post.readURL}`}
                  title={`${post.title} - Roy Li's Blog`}
                />
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

          <div className="sticky top-20 col-span-3 hidden h-0 lg:block">
            <div className="max-h-screen-md rounded border border-gray-400/30 p-4 relative bg-white dark:bg-dark-700 overflow-hidden">
              <TableOfContent post={post} postRecordMap={postRecordMap} />
            </div>
          </div>
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
  const posts = await getCachedBlogPosts({ pageSize: 9999 })
  const post = posts.results.find((p) => p.slug === slug)

  if (!post) {
    return {
      props: {
        post: null,
        postRecordMap: null,
      },
      revalidate: sec('10m'),
    }
  }

  const postPage = await getPageByPageId(post.id)

  return {
    props: {
      post,
      postRecordMap: postPage,
    },
    revalidate: sec('7d'),
  }
}

export default Post
