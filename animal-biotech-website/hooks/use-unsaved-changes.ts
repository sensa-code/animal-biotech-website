'use client'

import { useEffect, useCallback, useState } from 'react'

/**
 * Hook to warn users about unsaved changes before leaving the page
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param message - Custom message to show (optional)
 */
export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  message = '您有未儲存的變更。確定要離開此頁面嗎？'
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        // Modern browsers will show their own message, but we set this for older browsers
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, message])
}

/**
 * Hook to track form changes and provide unsaved changes warning
 * @param initialData - Initial form data to compare against
 * @returns Object with isDirty state and reset function
 */
export function useFormDirty<T extends Record<string, unknown>>(initialData: T) {
  const [originalData, setOriginalData] = useState<T>(initialData)
  const [currentData, setCurrentData] = useState<T>(initialData)

  const isDirty = JSON.stringify(originalData) !== JSON.stringify(currentData)

  const reset = useCallback((newData?: T) => {
    const data = newData ?? originalData
    setOriginalData(data)
    setCurrentData(data)
  }, [originalData])

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setCurrentData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateData = useCallback((data: Partial<T>) => {
    setCurrentData((prev) => ({ ...prev, ...data }))
  }, [])

  // Warn before leaving if dirty
  useUnsavedChanges(isDirty)

  return {
    isDirty,
    currentData,
    originalData,
    reset,
    updateField,
    updateData,
    setCurrentData,
    setOriginalData,
  }
}
