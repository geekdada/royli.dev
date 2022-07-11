/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['resource-proxy.royli.dev'],
  },
  async rewrites() {
    return [
      {
        source: '/feed',
        destination: '/api/feed',
      },
      {
        source: '/feed.xml',
        destination: '/api/feed',
      },
    ]
  },
}

module.exports = nextConfig
