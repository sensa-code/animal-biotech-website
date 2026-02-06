"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const initialForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [serverMessage, setServerMessage] = useState("")

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}

    if (!form.name.trim()) newErrors.name = "請輸入姓名"
    if (!form.email.trim()) {
      newErrors.email = "請輸入 Email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "請輸入有效的 Email 格式"
    }
    if (!form.message.trim()) newErrors.message = "請輸入訊息內容"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus("submitting")
    try {
      const res = await fetch("/api/website/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus("success")
        setServerMessage(data.message)
        setForm(initialForm)
      } else {
        setStatus("error")
        setServerMessage(data.message || "提交失敗，請稍後再試")
      }
    } catch {
      setStatus("error")
      setServerMessage("網路錯誤，請稍後再試")
    }
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />
        <h3 className="font-serif text-2xl text-foreground mb-3">感謝您的來信</h3>
        <p className="text-muted-foreground mb-8">{serverMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm text-accent hover:text-foreground transition-colors"
        >
          再次填寫
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            姓名 <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="您的姓名"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-phone" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            電話
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="02-XXXX-XXXX"
          />
        </div>

        <div>
          <label htmlFor="contact-company" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            公司 / 醫院名稱
          </label>
          <input
            id="contact-company"
            type="text"
            value={form.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="公司或醫院名稱"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
          訊息內容 <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none transition-colors resize-none"
          placeholder="請描述您的需求或問題..."
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>

      {status === "error" && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-sm text-destructive">
          {serverMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            送出中...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            送出訊息
          </>
        )}
      </button>
    </form>
  )
}
