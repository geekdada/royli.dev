import DefaultErrorPage from 'next/error'
import Head from 'next/head'

import { useTheme } from '@/lib/theme'

export default function Custom404() {
  const { theme } = useTheme()

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} withDarkMode={theme === 'dark'} />
    </>
  )
}
