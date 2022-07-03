import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { sec } from '../lib/utils/time'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Roy Li</title>
      </Head>

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

          <h1 className="heading-text my-8 text-4xl font-bold">Roy Li</h1>

          <div className="space-y-4 text-lg">
            <p className="leading-7">
              {`I'm a software engineer based in Berlin.`}
            </p>
            <p className="leading-7">
              You can find me on{' '}
              <a
                href="https://github.com/geekdada"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 p-1 px-2 rounded font-bold transition-all duration-150 bg-dark-600 text-white hover:bg-dark-600/60"
              >
                GitHub
              </a>{' '}
              and{' '}
              <a
                href="https://www.linkedin.com/in/roy-li-gz/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 p-1 px-2 rounded font-bold transition-all duration-150 bg-blue-600 text-white hover:bg-blue-600/60"
              >
                LinkedIn
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: sec('10m'),
  }
}

export default Home
