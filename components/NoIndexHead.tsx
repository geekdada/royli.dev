import Head from 'next/head'
import type { ReactNode } from 'react'

const NoIndexHead = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <>{children}</>
    </>
  )
}

export default NoIndexHead
