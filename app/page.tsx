import Image from 'next/image'
import Link from 'next/link'
import {
  FiGithub,
  FiTwitter,
  FiCamera,
  FiLinkedin,
  FiArrowUpRight,
} from 'react-icons/fi'
import { FaMastodon } from 'react-icons/fa'

import { getAllPosts } from '@/lib/content/posts'
import NellyIcon from '@/components/NellyIcon'
import Icon from '@/components/Icon'

export const revalidate = 604800 // 7 days

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/geekdada',
    icon: FiGithub,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/geekdada',
    icon: FiTwitter,
  },
  {
    name: 'Mastodon',
    href: 'https://tooted.space/@geekdada',
    icon: FaMastodon,
    rel: 'me',
  },
  {
    name: 'Unsplash',
    href: 'https://unsplash.com/@geekdada',
    icon: FiCamera,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/roy-li-gz/',
    icon: FiLinkedin,
  },
]

export default async function IndexPage() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 3)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 md:py-20">
        {/* Hero section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          <Image
            className="h-20 w-20 rounded-full md:h-24 md:w-24"
            src="/images/avatar.svg"
            alt="Roy Li"
            width={96}
            height={96}
            priority
          />

          <div className="flex-1">
            <h1 className="font-mono text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              Roy Li
            </h1>

            <p className="mt-4 text-gray-700 dark:text-gray-500 font-mono text-sm tracking-tight">
              Software engineer based in Berlin. Currently at
              <a
                href="https://getnelly.de"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <Icon
                  className="ml-2 mr-1 w-[50px] align-[-5px] overflow-hidden"
                  icon={<NellyIcon />}
                />
              </a>
              , previously at{' '}
              <a
                href="https://klarna.com"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-gray-500 dark:decoration-gray-600 dark:hover:decoration-gray-400"
              >
                Klarna
              </a>{' '}
              and Alibaba.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel={link.rel || 'noopener noreferrer'}
                  className="text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent posts */}
        <div className="mt-16">
          <div className="border-b border-gray-200 pb-2 dark:border-gray-800">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
              Recent Posts
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.publishYear}/${post.slug}`}
                className="group flex items-start justify-between py-4"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900 group-hover:underline dark:text-gray-100">
                    {post.title}
                  </span>
                  <FiArrowUpRight className="ml-1 inline-block h-3.5 w-3.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="ml-4 shrink-0 text-sm text-gray-400 dark:text-gray-600">
                  {post.publishYear}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse all link */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 border-b border-gray-900 pb-0.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-500 hover:text-gray-600 dark:border-white dark:text-white dark:hover:border-gray-400 dark:hover:text-gray-300"
          >
            Browse all posts
            <FiArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
