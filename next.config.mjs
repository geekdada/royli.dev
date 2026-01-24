import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import { visit } from 'unist-util-visit'

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: false,
}

/** Custom rehype plugin to add language labels to code blocks */
function rehypeCodeLanguageLabel() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Find figure elements created by rehype-pretty-code
      if (
        node.tagName === 'figure' &&
        node.properties?.['data-rehype-pretty-code-figure'] !== undefined
      ) {
        // Find the pre > code to get the language
        const pre = node.children.find(
          (child) => child.type === 'element' && child.tagName === 'pre'
        )
        const lang = pre?.properties?.['data-language'] || 'text'

        // Prepend the language label
        node.children.unshift({
          type: 'element',
          tagName: 'div',
          properties: {
            'data-language-label': '',
            className: ['code-language-label'],
          },
          children: [{ type: 'text', value: lang.toUpperCase() }],
        })
      }
    })
  }
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
    rehypePlugins: [
      'rehype-slug',
      [rehypePrettyCode, prettyCodeOptions],
      rehypeCodeLanguageLabel,
    ],
  },
})

export default withMDX(nextConfig)
