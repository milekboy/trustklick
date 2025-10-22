import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/front-pages/landing-page',
        permanent: false
      }
    ]
  }
}

export default nextConfig
