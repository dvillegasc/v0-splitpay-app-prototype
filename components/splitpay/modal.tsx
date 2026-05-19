"use client"

import { useEffect, type ReactNode } from "react"
import { X } from "lucide-react"

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="absolute inset-0 z-[100] flex items-end justify-center"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      />

      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-h-[88%] rounded-t-3xl border-t border-x border-border bg-card shadow-2xl animate-in slide-in-from-bottom-6 fade-in duration-200 flex flex-col"
      >
        {/* Drag handle */}
        <div className="pt-2 pb-1 flex justify-center" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-start justify-between px-5 pt-2 pb-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 text-pretty">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="h-8 w-8 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-24 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  )
}
