/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['resource-proxy.royli.dev'],
  },
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

module.exports = nextConfig
