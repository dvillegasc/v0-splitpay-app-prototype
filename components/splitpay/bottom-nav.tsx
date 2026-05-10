"use client"

import { LayoutDashboard, Wallet, Plus, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewKey = "dashboard" | "wallets" | "alerts" | "profile"

const items: { key: ViewKey; label: string; icon: typeof Wallet }[] = [
  { key: "dashboard", label: "Resumen", icon: LayoutDashboard },
  { key: "wallets", label: "Carteras", icon: Wallet },
  { key: "alerts", label: "Alertas", icon: Bell },
  { key: "profile", label: "Perfil", icon: User },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: ViewKey
  onChange: (v: ViewKey) => void
}) {
  return (
    <nav
      aria-label="Navegación principal"
      className="relative shrink-0 border-t border-border bg-card/95 backdrop-blur-md"
    >
      <ul className="grid grid-cols-5 items-center px-2 pt-2 pb-3">
        {items.slice(0, 2).map((item) => (
          <NavButton key={item.key} item={item} active={active === item.key} onChange={onChange} />
        ))}

        {/* Center FAB */}
        <li className="flex justify-center">
          <button
            type="button"
            aria-label="Proponer nuevo gasto"
            className="relative -mt-8 h-14 w-14 rounded-full bg-primary text-primary-foreground glow-primary flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </button>
        </li>

        {items.slice(2).map((item) => (
          <NavButton key={item.key} item={item} active={active === item.key} onChange={onChange} />
        ))}
      </ul>
    </nav>
  )
}

function NavButton({
  item,
  active,
  onChange,
}: {
  item: { key: ViewKey; label: string; icon: typeof Wallet }
  active: boolean
  onChange: (v: ViewKey) => void
}) {
  const Icon = item.icon
  return (
    <li>
      <button
        type="button"
        onClick={() => onChange(item.key)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "w-full flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]")} />
        <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
      </button>
    </li>
  )
}
