import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/front-pages/landing-page',
        permanent: false
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*', // frontend route
        destination: 'http://46.101.81.175/api/:path*' // backend proxy
      }
    ]
  }
}

export default nextConfig
