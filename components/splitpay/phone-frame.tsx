import type { ReactNode } from "react"
import { Signal, Wifi, BatteryFull } from "lucide-react"

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background p-0 sm:p-6">
      {/* Ambient glow on desktop */}
      <div
        aria-hidden
        className="hidden sm:block pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(0,255,102,0.08), transparent 60%), radial-gradient(50% 40% at 80% 80%, rgba(138,43,226,0.10), transparent 60%)",
        }}
      />

      <div className="relative w-full sm:w-[400px] sm:h-[860px] sm:rounded-[3rem] sm:border sm:border-white/10 sm:bg-card sm:shadow-2xl sm:overflow-hidden">
        {/* Notch (only on desktop simulation) */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-50 h-7 w-32 rounded-full bg-black items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white/10 ml-8" />
        </div>

        {/* Status bar (desktop simulation) */}
        <div className="hidden sm:flex absolute top-0 left-0 right-0 h-10 px-8 items-center justify-between text-[11px] font-medium text-foreground/80 z-40">
          <span className="ml-2">9:41</span>
          <div className="flex items-center gap-1.5 mr-2">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="relative h-svh sm:h-full sm:pt-10 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
