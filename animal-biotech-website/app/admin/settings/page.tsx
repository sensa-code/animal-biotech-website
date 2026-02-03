'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'

interface Setting {
  id: number
  key: string
  value: string
  description: string | null
}

const SETTING_LABELS: Record<string, { label: string; description: string; type: string }> = {
  company_name: { label: '公司名稱', description: '網站標題和頁尾顯示', type: 'text' },
  company_name_en: { label: '公司英文名稱', description: '英文版網站標題', type: 'text' },
  phone: { label: '聯絡電話', description: '主要聯絡電話', type: 'text' },
  fax: { label: '傳真號碼', description: '傳真聯絡方式', type: 'text' },
  email: { label: '電子信箱', description: '主要聯絡信箱', type: 'email' },
  address: { label: '公司地址', description: '實體地址', type: 'text' },
  business_hours: { label: '營業時間', description: '服務時間說明', type: 'text' },
  website_url: { label: '網站網址', description: '公司網站連結', type: 'url' },
  company_description: { label: '公司描述', description: '網站描述文字', type: 'text' },
  line_id: { label: 'LINE ID', description: 'LINE 官方帳號', type: 'text' },
  facebook_url: { label: 'Facebook', description: 'Facebook 粉絲頁連結', type: 'url' },
  instagram_url: { label: 'Instagram', description: 'Instagram 帳號連結', type: 'url' },
  copyright_text: { label: '版權宣告', description: '頁尾版權文字', type: 'text' },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()

      if (data.success) {
        // Convert object format to array format
        // API returns: { key: { id, value }, ... }
        const settingsArray: Setting[] = Object.entries(data.data).map(([key, val]: [string, any]) => ({
          id: val.id,
          key,
          value: val.value,
          description: null,
        }))

        setSettings(settingsArray)

        // Initialize edited values
        const values: Record<string, string> = {}
        settingsArray.forEach((s: Setting) => {
          values[s.key] = s.value
        })
        setEditedValues(values)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value: editedValues[key],
        }),
      })
      const data = await res.json()

      if (data.success) {
        setSettings(settings.map(s =>
          s.key === key ? { ...s, value: editedValues[key] } : s
        ))
      } else {
        alert(data.message || '儲存失敗')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('儲存失敗')
    } finally {
      setSaving(null)
    }
  }

  const handleSaveAll = async () => {
    setSaving('all')
    try {
      // Save all changed settings
      const promises = settings
        .filter(s => s.value !== editedValues[s.key])
        .map(s =>
          fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: s.key,
              value: editedValues[s.key],
            }),
          })
        )

      if (promises.length === 0) {
        alert('沒有變更需要儲存')
        setSaving(null)
        return
      }

      await Promise.all(promises)

      // Update local state
      setSettings(settings.map(s => ({ ...s, value: editedValues[s.key] })))
      alert('所有設定已儲存')
    } catch (error) {
      console.error('Save error:', error)
      alert('部分設定儲存失敗')
    } finally {
      setSaving(null)
    }
  }

  const hasChanges = settings.some(s => s.value !== editedValues[s.key])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.70_0.08_160)]" />
      </div>
    )
  }

  // Group settings by category
  const basicSettings = settings.filter(s =>
    ['company_name', 'company_name_en', 'company_description', 'copyright_text'].includes(s.key)
  )
  const contactSettings = settings.filter(s =>
    ['phone', 'fax', 'email', 'address', 'business_hours', 'website_url'].includes(s.key)
  )
  const socialSettings = settings.filter(s =>
    ['line_id', 'facebook_url', 'instagram_url'].includes(s.key)
  )

  const renderSettingInput = (setting: Setting) => {
    const config = SETTING_LABELS[setting.key] || {
      label: setting.key,
      description: setting.description || '',
      type: 'text',
    }

    const hasChanged = setting.value !== editedValues[setting.key]

    return (
      <div key={setting.key} className="flex items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[oklch(0.80_0.01_90)] mb-1">
            {config.label}
          </label>
          {config.description && (
            <p className="text-xs text-[oklch(0.55_0.01_240)] mb-2">{config.description}</p>
          )}
          <input
            type={config.type}
            value={editedValues[setting.key] || ''}
            onChange={(e) => setEditedValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg bg-[oklch(0.12_0.01_240)] border border-[oklch(0.25_0.02_240)] text-[oklch(0.95_0.01_90)] placeholder:text-[oklch(0.45_0.01_240)] focus:border-[oklch(0.70_0.08_160)] focus:outline-none"
          />
        </div>
        {hasChanged && (
          <button
            onClick={() => handleSave(setting.key)}
            disabled={saving === setting.key}
            className="mt-7 p-2 rounded-lg bg-[oklch(0.70_0.08_160)/0.15] hover:bg-[oklch(0.70_0.08_160)/0.25] text-[oklch(0.70_0.08_160)] transition-colors disabled:opacity-50"
          >
            {saving === setting.key ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[oklch(0.95_0.01_90)]">網站設定</h1>
          <p className="text-[oklch(0.60_0.01_240)] mt-1">
            編輯網站基本資訊
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSaveAll}
            disabled={saving === 'all'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.70_0.08_160)] hover:bg-[oklch(0.65_0.08_160)] text-[oklch(0.15_0.01_240)] font-medium transition-colors disabled:opacity-50"
          >
            {saving === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            儲存全部
          </button>
        )}
      </div>

      {/* Basic Info */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">基本資訊</h2>
        <div className="space-y-4">
          {basicSettings.map(renderSettingInput)}
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">聯絡資訊</h2>
        <div className="space-y-4">
          {contactSettings.map(renderSettingInput)}
        </div>
      </div>

      {/* Social Media */}
      {socialSettings.length > 0 && (
        <div className="rounded-xl bg-[oklch(0.16_0.01_240)] border border-[oklch(0.22_0.02_240)] p-6">
          <h2 className="text-lg font-semibold text-[oklch(0.95_0.01_90)] mb-4">社群媒體</h2>
          <div className="space-y-4">
            {socialSettings.map(renderSettingInput)}
          </div>
        </div>
      )}
    </div>
  )
}
