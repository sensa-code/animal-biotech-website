/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // [CRITICAL #4] 開啟 TypeScript 編譯檢查，不再忽略型別錯誤
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
