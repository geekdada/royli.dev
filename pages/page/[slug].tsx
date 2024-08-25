import { GetStaticProps, InferGetStaticPropsType } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { ExtendedRecordMap } from 'notion-types'
import { ParsedUrlQuery } from 'querystring'
import { FiMessageCircle } from 'react-icons/fi'
import clx from 'classnames'
import { Balancer } from 'react-wrap-balancer'
import { useRouter } from 'next/router'

import { NotionPage } from '@/components/NotionPage'
import PageHead from '@/components/PageHead'
import Time from '@/components/Time'
import { siteURL } from '@/lib/config'
import { getPageBySlug, getPrivatePageRecordMapByPageId } from '@/lib/notion'
import { Post } from '@/lib/types'

interface Props {
  post: Post | null
  postRecordMap: ExtendedRecordMap | null
}

interface Params extends ParsedUrlQuery {
  slug: string
}

const Comments = dynamic(() => import('@/components/Comments'), {
  ssr: false,
})

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = (async ({ params }) => {
  const { slug } = params || {}

  if (!slug) {
    return {
      notFound: true,
      revalidate: 10,
    }
  }

  const post = await getPageBySlug(slug)

  if (!post) {
    return {
      notFound: true,
      revalidate: 10,
    }
  }

  const postPage = await getPrivatePageRecordMapByPageId(post.id)

  return {
    props: {
      post,
      postRecordMap: postPage,
    },
  }
}) satisfies GetStaticProps<Props, Params>

export default function PageTypePage({
  post,
  postRecordMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <div className="container mx-auto text-center font-mono text-slate-900 dark:text-slate-100 font-bold">
        Loading...
      </div>
    )
  }

  if (!post || !postRecordMap) {
    return null
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
