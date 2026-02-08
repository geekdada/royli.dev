import Image from 'next/image'
import Link from 'next/link'
import {
  FiGithub,
  FiTwitter,
  FiCamera,
  FiLinkedin,
  FiArrowRight,
} from 'react-icons/fi'
import { FaMastodon } from 'react-icons/fa'

import { getAllPosts } from '@/lib/content/posts'
import NellyIcon from '@/components/NellyIcon'
import Icon from '@/components/Icon'
import {
  AnimatedSection,
  AnimatedItem,
  ScaleIn,
} from '@/components/home/HeroSection'
import BerlinClock from '@/components/home/BerlinClock'

export const revalidate = 604800 // 7 days

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/geekdada', icon: FiGithub },
  { name: 'Twitter', href: 'https://twitter.com/geekdada', icon: FiTwitter },
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function IndexPage() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-6">
        {/* ───────────── Hero ───────────── */}
        <AnimatedSection className="pb-16 pt-10 md:pb-20 md:pt-16">
          {/* Name row */}
          <AnimatedItem className="flex items-end gap-5 mb-6">
            <h1 className="font-pixel text-5xl leading-[0.9] text-gray-900 dark:text-white md:text-7xl">
              Roy Li
            </h1>
            <ScaleIn>
              <Image
                className="h-11 w-11 rounded-full ring-2 ring-gray-900/10 dark:ring-white/10 md:h-14 md:w-14 mb-1"
                src="/images/avatar.svg"
                alt="Roy Li"
                width={56}
                height={56}
                priority
              />
            </ScaleIn>
          </AnimatedItem>

          {/* Bio */}
          <AnimatedItem>
            <p className="max-w-md text-[17px] leading-relaxed text-gray-500 dark:text-gray-400">
              Software engineer in Berlin. Building things at
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
              , after stints at{' '}
              <a
                href="https://klarna.com"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-gray-700 dark:text-gray-300 underline decoration-gray-300/40 underline-offset-[3px] transition-all hover:decoration-gray-500 dark:decoration-gray-700 dark:hover:decoration-gray-400"
              >
                Klarna
              </a>{' '}
              and{' '}
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Alibaba
              </span>
              .
            </p>
          </AnimatedItem>

          {/* Status pill */}
          <AnimatedItem className="mt-8">
            <BerlinClock />
          </AnimatedItem>

          {/* Socials row */}
          <AnimatedItem className="mt-5 flex items-center -ml-2.5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel={link.rel || 'noopener noreferrer'}
                className="rounded-lg p-2.5 text-gray-300 transition-all duration-150 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                aria-label={link.name}
              >
                <link.icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </AnimatedItem>
        </AnimatedSection>

        {/* ───────────── Divider ───────────── */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700/50" />
        </div>

        {/* ───────────── Writing ───────────── */}
        <AnimatedSection className="py-16 md:py-20" viewport>
          <AnimatedItem className="flex items-baseline justify-between mb-10">
            <h2 className="font-pixel text-[11px] tracking-[0.35em] uppercase text-gray-400 dark:text-gray-600">
              Writing
            </h2>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-300"
            >
              All posts
              <FiArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </AnimatedItem>

          <div className="grid gap-px">
            {recentPosts.map((post) => (
              <AnimatedItem key={post.slug}>
                <Link
                  href={`/blog/${post.publishYear}/${post.slug}`}
                  className="home-post-row group"
                >
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-gray-300 dark:text-gray-700 w-16 pt-[3px]">
                    {formatDate(post.publishDate)}
                  </span>
                  <span className="flex-1 text-[15px] leading-snug text-gray-600 transition-colors duration-150 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white">
                    {post.coverIcon && (
                      <span className="mr-1.5">{post.coverIcon}</span>
                    )}
                    {post.title}
                  </span>
                  <FiArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-200 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 dark:text-gray-700" />
                </Link>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
