'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-[oklch(0.22_0.01_240)]',
        className
      )}
    />
  )
}

// Table Row Skeleton for list pages
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-[oklch(0.20_0.02_240)]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

// Product List Skeleton
export function ProductListSkeleton() {
  return (
    <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[oklch(0.22_0.02_240)]">
            {['產品', '分類', '型號', '狀態', '操作'].map((h) => (
              <th key={h} className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-[oklch(0.20_0.02_240)] last:border-0">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-12 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// News List Skeleton
export function NewsListSkeleton() {
  return (
    <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[oklch(0.22_0.02_240)]">
            {['標題', '摘要', '狀態', '發布日期', '操作'].map((h) => (
              <th key={h} className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-[oklch(0.20_0.02_240)] last:border-0">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-48" />
              </td>
              <td className="px-6 py-4 text-center">
                <Skeleton className="h-6 w-14 rounded-full mx-auto" />
              </td>
              <td className="px-6 py-4 text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Category List Skeleton
export function CategoryListSkeleton() {
  return (
    <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[oklch(0.22_0.02_240)]">
            {['分類名稱', '代稱', '產品數量', '操作'].map((h) => (
              <th key={h} className="text-left px-6 py-4 text-sm font-medium text-[oklch(0.65_0.01_240)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="border-b border-[oklch(0.20_0.02_240)] last:border-0">
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-12 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  )
}

// Featured Products Skeleton
export function FeaturedListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-4"
        >
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Settings Skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div
          key={sectionIndex}
          className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6"
        >
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
