'use client'

import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
  /** 外部傳入的 loading 狀態，優先於內部 loading */
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  confirmText = '確認刪除',
  cancelText = '取消',
  variant = 'danger',
  isLoading: externalLoading,
  onConfirm,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  // 外部 isLoading 優先於內部狀態
  const loading = externalLoading ?? internalLoading

  const handleConfirm = async () => {
    setInternalLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Confirm action failed:', error)
    } finally {
      setInternalLoading(false)
    }
  }

  const isDanger = variant === 'danger'

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[oklch(0.16_0.01_240)] border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)]">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isDanger ? 'bg-[oklch(0.25_0.10_25)]' : 'bg-[oklch(0.25_0.10_85)]'}`}>
              <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-[oklch(0.70_0.15_25)]' : 'text-[oklch(0.70_0.15_85)]'}`} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-[oklch(0.95_0.01_90)]">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm text-[oklch(0.70_0.01_240)]">
                {description}
              </AlertDialogDescription>
              {itemName && (
                <div className="mt-3 p-3 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.20_0.02_240)]">
                  <p className="text-sm font-medium text-[oklch(0.85_0.01_90)]">{itemName}</p>
                </div>
              )}
              {isDanger && (
                <p className="mt-3 text-xs text-[oklch(0.70_0.10_25)] font-medium">
                  此操作無法復原
                </p>
              )}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            disabled={loading}
            className="bg-transparent border-[oklch(0.30_0.02_240)] text-[oklch(0.80_0.01_90)] hover:bg-[oklch(0.20_0.01_240)] hover:text-[oklch(0.95_0.01_90)]"
          >
            {cancelText}
          </AlertDialogCancel>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              isDanger
                ? 'bg-[oklch(0.50_0.15_25)] hover:bg-[oklch(0.45_0.15_25)] text-white'
                : 'bg-[oklch(0.50_0.15_85)] hover:bg-[oklch(0.45_0.15_85)] text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                處理中...
              </>
            ) : (
              confirmText
            )}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Hook for easier usage
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean
    title: string
    description: string
    itemName?: string
    confirmText?: string
    variant?: 'danger' | 'warning'
    onConfirm: () => Promise<void> | void
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const confirm = (options: Omit<typeof dialogState, 'open'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        ...options,
        open: true,
        onConfirm: async () => {
          await options.onConfirm()
          resolve(true)
        },
      })
    })
  }

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, open: false }))
  }

  return {
    dialogState,
    confirm,
    closeDialog,
    setDialogState,
    ConfirmDialogComponent: (
      <ConfirmDialog
        {...dialogState}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
      />
    ),
  }
}
