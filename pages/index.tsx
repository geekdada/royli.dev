import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Balancer } from 'react-wrap-balancer'

import { getBlogPosts } from '@/lib/notion'
import { PaginatedResponse, Post } from '@/lib/types'
import { sec } from '@/lib/utils/time'

interface Props {
  posts: PaginatedResponse<Post>
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <div className="flex justify-center flex-col flex-1">
        <div className="mx-auto max-w-3xl px-6">
          <Image
            className="rounded-full"
            src="/images/avatar.jpg"
            alt="avatar"
            width={120}
            height={120}
            priority
          />

          <h1 className="heading-text my-8 text-4xl font-bold font-title">
            Roy Li
          </h1>

          <div className="space-y-4 text-lg">
            <div className="leading-9">
              <p>
                <Balancer>
                  I am a software engineer based in Berlin, currently working
                  at&nbsp;
                  <a href="https://klarna.com" target="_blank" rel="noreferrer">
                    <img
                      className="inline-block h-[30px] align-[-9px]"
                      src="/images/klarna.svg"
                      alt="Klarna"
                    />
                  </a>
                  ,
                </Balancer>
              </p>
              <p>
                <Balancer>
                  previously at&nbsp;
                  <img
                    className="inline-block h-[30px] align-[-9px]"
                    src="/images/alibaba.svg"
                    alt="Alibaba"
                  />
                  .
                </Balancer>
              </p>
            </div>
            <p className="leading-9">
              You can find me on&nbsp;
              <a
                href="https://github.com/geekdada"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 py-1 px-2 rounded font-bold transition-all duration-150 bg-dark-600 text-white hover:bg-dark-600/80"
              >
                GitHub
              </a>
              {', '}
              <a
                href="https://twitter.com/geekdada"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 py-1 px-2 rounded font-bold transition-all duration-150 bg-blue-400 text-white hover:bg-blue-400/80"
              >
                Twitter
              </a>
              {', '}
              <a
                href="https://tooted.space/@geekdada"
                rel="me"
                className="mx-1 py-1 px-2 rounded font-bold transition-all duration-150 bg-indigo-500 text-white hover:bg-indigo-400/80"
              >
                Mastodon
              </a>
              {', '}
              <a
                href="https://unsplash.com/@geekdada"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 py-1 px-2 rounded font-bold transition-all duration-150 bg-dark-900 text-white hover:bg-dark-900/80"
              >
                Unsplash
              </a>
              &nbsp;and&nbsp;
              <a
                href="https://www.linkedin.com/in/roy-li-gz/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 py-1 px-2 rounded font-bold transition-all duration-150 bg-blue-600 text-white hover:bg-blue-600/80"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>

          <div className="mt-10 text-lg leading-8">
            <p>
              <span>Read the latest post:&nbsp;</span>
              <Link
                href={posts.results[0].readURL}
                className="hover-links mx-2"
              >
                {posts.results[0].title}
              </Link>
            </p>
            <p>
              <span>Or see&nbsp;</span>
              <Link href="/blog" className="hover-links">
                all blog posts
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getBlogPosts()

  return {
    props: { posts },
    revalidate: sec('24h'),
  }
}

export default Home
