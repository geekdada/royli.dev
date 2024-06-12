import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import type { ExtendedRecordMap } from 'notion-types'
import { ParsedUrlQuery } from 'querystring'
import { FiMessageCircle } from 'react-icons/fi'
import clx from 'classnames'
import DefaultErrorPage from 'next/error'
import { Balancer } from 'react-wrap-balancer'

import { NotionPage } from '@/components/NotionPage'
import PageHead from '@/components/PageHead'
import Time from '@/components/Time'
import { siteURL } from '@/lib/config'
import { getCachedPages, getPageByPageId } from '@/lib/notion'
import { sec } from '@/lib/utils/time'
import { Page } from '@/lib/types'

interface Props {
  post: Page | null
  postRecordMap: ExtendedRecordMap | null
}

const Comments = dynamic(() => import('@/components/Comments'), {
  ssr: false,
})

const PageEndpoint: NextPage<Props> = ({ post, postRecordMap }) => {
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
        title={`${post.title} - Roy Li`}
        description={post.excerpt}
        image={post.coverImage}
        url={canonical.toString()}
      />

      <div className="container mx-auto md:px-6 max-w-3xl lg:max-w-5xl xl:max-w-7xl space-y-4">
        {post.coverImage && (
          <div className="md:mb-8">
            <div className="md:rounded-lg md:shadow-md overflow-hidden post-cover-image">
              <div
                style={{
                  backgroundImage: `url(${post.coverImage})`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="post-section bg-white dark:bg-dark-700">
          <article
            className={clx(
              'px-5 lg:px-7',
              hasCoverImage ? 'pt-5 lg:pt-6' : 'pt-3 lg:pt-4'
            )}
          >
            <h1 className="mb-2 flex justify space-x-2 text-3xl font-bold font-title">
              <Balancer>
                {post.coverIcon ? (
                  <span className="mr-2">{post.coverIcon}</span>
                ) : null}
                {post.title}
              </Balancer>
            </h1>

            <div className="secondary-text flex flex-wrap items-center gap-2">
              <span>
                <Time datetime={post.createdDate} />
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
          </article>
        </div>

        <div
          id="comments-section"
          className="post-section p-4 bg-white dark:bg-dark-700"
        >
          <Comments />
        </div>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const posts = await getCachedPages({ pageSize: 9999 })

  return {
    paths: posts.results.map((p) => {
      return {
        params: { slug: p.slug },
      }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  interface Props extends ParsedUrlQuery {
    slug: string
  }

  const { slug } = params as Props
  const posts = await getCachedPages({ pageSize: 9999 })
  const post = posts.results.find((p) => p.slug === slug)

  if (!post) {
    return {
      props: {
        post: null,
        postRecordMap: null,
      },
      revalidate: 0,
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

export default PageEndpoint
