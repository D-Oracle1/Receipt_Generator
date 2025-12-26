/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & Output
  compress: true,
  swcMinify: true,

  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: ['*.vercel.app', 'localhost'],
    },
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      'lucide-react',
    ],
  },

  // Headers for caching
  headers: async () => [
    {
      source: '/:path((?!api|_next/static|_next/image|favicon.ico).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600',
        },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
        },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],

  // Redirects
  redirects: async () => [
    {
      source: '/admin',
      destination: '/admin/setup',
      permanent: true,
    },
  ],

  // Rewrites for API routes
  rewrites: async () => ({
    beforeFiles: [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ],
  }),

  // Build optimization
  productionBrowserSourceMaps: false,
  cleanDistDir: true,

  // Webpack optimization
  webpack: (config, options) => {
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    }
    return config
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // TypeScript
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // PoweredBy header
  poweredByHeader: false,
}

module.exports = nextConfig
