"use client"

import { ChevronRight, Home, Trophy, Pin, Hourglass, Users, ShieldCheck, UserCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type WalletSummary = {
  id: string
  name: string
  type: "fija" | "temporal"
  expiresInDays?: number
  members: number
  role: "Administrador" | "Miembro"
  balance: number
  icon: LucideIcon
  accent: string
}

export const wallets: WalletSummary[] = [
  {
    id: "casa-marinilla",
    name: "Casa Marinilla",
    type: "fija",
    members: 3,
    role: "Administrador",
    balance: 450000,
    icon: Home,
    accent: "#00FF66",
  },
  {
    id: "torneo-baloncesto",
    name: "Torneo de Baloncesto",
    type: "temporal",
    expiresInDays: 5,
    members: 8,
    role: "Miembro",
    balance: 120000,
    icon: Trophy,
    accent: "#8A2BE2",
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
    <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
      <header className="px-5 pt-6 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Mis Carteras</p>
        <h1 className="mt-1 text-2xl font-semibold text-balance">
          Tus <span className="text-primary text-glow-primary">bolsas comunes</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 text-pretty">
          Toca una cartera para ver el detalle y aprobar gastos.
        </p>
      </header>

      <section className="px-5 space-y-3" aria-label="Listado de carteras activas">
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

          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            {wallet.type === "fija" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                <Pin className="h-3 w-3" />
                Fija
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                <Hourglass className="h-3 w-3" />
                Temporal · Vence en {wallet.expiresInDays}d
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 items-end">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {wallet.members} miembros
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
