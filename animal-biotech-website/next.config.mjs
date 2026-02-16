/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // [CRITICAL #4] 開啟 TypeScript 編譯檢查，不再忽略型別錯誤
    ignoreBuildErrors: false,
  },
  // Note: eslint config 已移至 eslint.config.mjs（ESLint v10 flat config）
  // Next.js 16.x 不再支援 next.config 中的 eslint 選項
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // 對所有路由套用安全 headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // 修正路由名不一致：/articles → /article
      {
        source: '/articles',
        destination: '/products',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
