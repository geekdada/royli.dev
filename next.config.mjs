import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: true,
  transformers: [
    {
      line(node, line) {
        node.properties['data-line-number'] = line
      },
    },
  ],
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
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
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug', [rehypePrettyCode, prettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
