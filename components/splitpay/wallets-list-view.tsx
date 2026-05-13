"use client"

import { ChevronRight, Home, Trophy, Users, ShieldCheck, UserCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { WalletMember } from "./wallet-settings-modal"

export type WalletSummary = {
  id: string
  name: string
  members: WalletMember[]
  role: "Administrador" | "Miembro"
  balance: number
  icon: LucideIcon
  accent: string
}

export const wallets: WalletSummary[] = [
  {
    id: "casa-marinilla",
    name: "Casa Marinilla",
    role: "Administrador",
    balance: 450000,
    icon: Home,
    accent: "#00FF66",
    members: [
      { name: "David Castro", initials: "DC", color: "#00FF66", role: "Administrador" },
      { name: "Sebastián Ramírez", initials: "SR", color: "#8A2BE2", role: "Miembro" },
      { name: "Manuela Vélez", initials: "MV", color: "#00D4FF", role: "Miembro" },
    ],
  },
  {
    id: "torneo-baloncesto",
    name: "Torneo de Baloncesto",
    role: "Miembro",
    balance: 120000,
    icon: Trophy,
    accent: "#8A2BE2",
    members: [
      { name: "Andrés López", initials: "AL", color: "#00FF66", role: "Administrador" },
      { name: "David Castro", initials: "DC", color: "#00D4FF", role: "Miembro" },
      { name: "Valentina Ríos", initials: "VR", color: "#FFB020", role: "Miembro" },
      { name: "Sebastián Ramírez", initials: "SR", color: "#8A2BE2", role: "Miembro" },
      { name: "Manuela Vélez", initials: "MV", color: "#FF4D6D", role: "Miembro" },
    ],
  },
]

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

export function WalletsListView({
  onOpen,
}: {
  onOpen: (id: string) => void
}) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide pb-28">
      <header className="px-5 pt-6 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Mis Carteras</p>
        <h1 className="mt-1 text-2xl font-semibold text-balance">
          Tus <span className="text-primary text-glow-primary">bolsas comunes</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 text-pretty">
          Toca una cartera para ver el detalle y aprobar gastos.
        </p>
      </header>

      <section className="px-5 space-y-3" aria-label="Listado de carteras">
        {wallets.map((w) => (
          <WalletListCard key={w.id} wallet={w} onOpen={onOpen} />
        ))}

        <button
          type="button"
          className="w-full rounded-2xl border border-dashed border-border bg-card/50 px-4 py-4 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          + Crear nueva cartera
        </button>
      </section>
    </div>
  )
}

function WalletListCard({
  wallet,
  onOpen,
}: {
  wallet: WalletSummary
  onOpen: (id: string) => void
}) {
  const Icon = wallet.icon
  const isAdmin = wallet.role === "Administrador"

  return (
    <button
      type="button"
      onClick={() => onOpen(wallet.id)}
      className="group w-full text-left rounded-2xl bg-card border border-border p-4 transition-all hover:border-primary/40 hover:bg-card/80 active:scale-[0.99]"
      aria-label={`Abrir cartera ${wallet.name}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${wallet.accent}1f`,
            color: wallet.accent,
            border: `1px solid ${wallet.accent}40`,
          }}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{wallet.name}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
          </div>

          {/* Member avatars */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-2">
              {wallet.members.slice(0, 3).map((m) => (
                <span
                  key={m.name}
                  className="h-6 w-6 rounded-full inline-flex items-center justify-center text-[10px] font-semibold ring-2 ring-card"
                  style={{
                    background: `${m.color}33`,
                    color: m.color,
                    border: `1px solid ${m.color}55`,
                  }}
                  aria-hidden
                  title={m.name}
                >
                  {m.initials}
                </span>
              ))}
            </div>
            {wallet.members.length > 3 && (
              <span className="text-[11px] text-muted-foreground">
                +{wallet.members.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 items-end">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {wallet.members.length} miembros
          </span>
          <span className="inline-flex items-center gap-1">
            {isAdmin ? (
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <UserCircle2 className="h-3.5 w-3.5" />
            )}
            <span className={isAdmin ? "text-primary" : ""}>{wallet.role}</span>
          </span>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Saldo</p>
          <p className="text-base font-semibold tabular-nums text-foreground">
            {formatCOP(wallet.balance)}
          </p>
        </div>
      </div>
    </button>
  )
}
