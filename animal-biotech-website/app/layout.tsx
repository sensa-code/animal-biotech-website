import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://senbio.tech'),
  title: '上弦動物生技 | 專業動物醫療設備與耗材',
  description: '上弦動物生技以獸醫師角度出發，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，致力打造更優質的動物醫療環境。',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '上弦動物生技 | 專業動物醫療設備與耗材',
    description: '上弦動物生技以獸醫師的角度為出發點，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材。',
    type: 'website',
    locale: 'zh_TW',
    siteName: '上弦動物生技',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '上弦動物生技 — 專業動物醫療設備與耗材',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '上弦動物生技 | 專業動物醫療設備與耗材',
    description: '上弦動物生技以獸醫師的角度為出發點，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材。',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
