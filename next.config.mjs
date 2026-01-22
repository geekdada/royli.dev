import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  i18n: {
    locales: ['zh-Hans'],
    defaultLocale: 'zh-Hans',
  },
  images: {
    remotePatterns: [{ hostname: 'resource-proxy.royli.dev' }],
  },
  transpilePackages: ['geist'],
  async redirects() {
    return [
      {
        permanent: true,
        source: '/feed',
        destination: '/blog/feed.xml',
      },
      {
        permanent: true,
        source: '/feed.xml',
        destination: '/blog/feed.xml',
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/blog/feed.xml',
        destination: '/api/feed',
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug', 'rehype-highlight'],
  },
})

export default withMDX(nextConfig)
