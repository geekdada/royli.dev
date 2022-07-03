import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import '../styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
