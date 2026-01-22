import Link from 'next/link'
import clx from 'classnames'
import { Balancer } from 'react-wrap-balancer'
import { FiArrowLeft, FiTag } from 'react-icons/fi'
import { getAllPosts, getPostBySlug } from '@/lib/content/posts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Comments from '@/components/Comments'
import Copyright from '@/components/Copyright'
import TableOfContents from '@/components/mdx/TableOfContents'
import ArticleContent from '@/components/mdx/ArticleContent'
import { siteURL } from '@/lib/config'

export const revalidate = 86400

export const dynamicParams = true

interface PageProps {
  params: Promise<{ year: string; slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { year, slug } = await params
  const post = await getPostBySlug(slug, year)

  if (!post) {
    notFound()
  }

  const { Content } = post
  const hasCoverImage = Boolean(post.coverImage)
  const isGalleryView = post.isGallaryView

  return (
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
            isGalleryView ? 'col-span-full' : 'col-span-10 lg:col-span-7'
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
                className="relative mb-2 flex justify space-x-2 text-3xl font-bold font-title"
                data-id="blog-title"
              >
                <span id="blog-title" className="scroll-mt-20" />
                <Balancer>
                  {post.coverIcon ? (
                    <span className="mr-2">{post.coverIcon}</span>
                  ) : null}
                  {post.title}
                </Balancer>
              </h1>

              <ArticleContent>
                <Content />
              </ArticleContent>

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
                  canonical={`${siteURL}/blog/${year}/${slug}`}
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

        {!isGalleryView && (
          <div className="sticky top-20 col-span-3 hidden lg:block self-start">
            <div className="max-h-screen-md py-3 relative overflow-hidden">
              <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                On this page
              </div>
              <TableOfContents />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    year: post.publishYear,
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year, slug } = await params
  const post = await getPostBySlug(slug, year)

  if (!post) {
    return {}
  }

  const canonical = new URL(`/blog/${year}/${slug}`, siteURL)

  return {
    title: `${post.title} - Roy Li's Blog`,
    description: post.excerpt,
    openGraph: post.coverImage
      ? {
          images: [post.coverImage],
        }
      : undefined,
    alternates: {
      canonical: canonical.toString(),
    },
  }
}
