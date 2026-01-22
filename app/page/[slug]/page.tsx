/**
 * Static Pages Route (About, etc.)
 */

import Link from 'next/link'
import clx from 'classnames'
import { Balancer } from 'react-wrap-balancer'
import { FiMessageCircle } from 'react-icons/fi'
import { getPageBySlug, getAllPages } from '@/lib/content/pages'
import { notFound } from 'next/navigation'
import Time from '@/components/Time'
import ArticleContent from '@/components/mdx/ArticleContent'
import Comments from '@/components/Comments'
import { siteURL } from '@/lib/config'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const { Content } = page
  const hasCoverImage = Boolean(page.coverImage)

  return (
    <div className="container mx-auto md:px-6 max-w-3xl lg:max-w-5xl xl:max-w-7xl space-y-4">
      {page.coverImage && (
        <div className="md:mb-8">
          <div className="md:rounded-lg md:shadow-md overflow-hidden post-cover-image">
            <div
              style={{
                backgroundImage: `url(${page.coverImage})`,
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
            <Balancer>{page.title}</Balancer>
          </h1>

          <div className="secondary-text flex flex-wrap items-center gap-2">
            <span>
              <Time datetime={page.publishDate} />
            </span>
            <span>·</span>
            <span>Roy</span>
            <span>·</span>
            <Link href="#comments-section" className="hover-links">
              <FiMessageCircle size={18} className="mr-1 inline" />
              <span>comments</span>
            </Link>
          </div>

          <ArticleContent>
            <Content />
          </ArticleContent>
        </article>
      </div>

      <div
        id="comments-section"
        className="post-section p-4 bg-white dark:bg-dark-700"
      >
        <Comments />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return {}
  }

  const canonical = new URL(`/page/${slug}`, siteURL)

  return {
    title: `${page.title} - Roy Li`,
    alternates: {
      canonical: canonical.toString(),
    },
  }
}
