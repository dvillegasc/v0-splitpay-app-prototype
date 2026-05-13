"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, Plus, Settings, Settings2, Eye, EyeOff, Sparkles, Info } from "lucide-react"
import { ExpenseCard, type Expense } from "./expense-card"
import { wallets } from "./wallets-list-view"
import { WalletSettingsModal } from "./wallet-settings-modal"

const proportionsByWallet: Record<string, { name: string; percent: number; color: string }[]> = {
  "casa-marinilla": [
    { name: "David", percent: 40, color: "#00FF66" },
    { name: "Sebastián", percent: 35, color: "#8A2BE2" },
    { name: "Manuela", percent: 25, color: "#00D4FF" },
  ],
  "torneo-baloncesto": [
    { name: "Andrés", percent: 28, color: "#00FF66" },
    { name: "David", percent: 24, color: "#00D4FF" },
    { name: "Valentina", percent: 20, color: "#FFB020" },
    { name: "Sebastián", percent: 16, color: "#8A2BE2" },
    { name: "Manuela", percent: 12, color: "#FF4D6D" },
  ],
}

const expensesByWallet: Record<string, Expense[]> = {
  "casa-marinilla": [
    {
      id: "1",
      proposer: { name: "Sebastián", initials: "SR", color: "#8A2BE2" },
      title: "Pagar el recibo de la luz de septiembre.",
      amount: 120000,
      status: "pending",
      category: "luz",
      approvals: [
        { name: "Manuela", initials: "MV", approved: true, color: "#00D4FF" },
        { name: "David", initials: "DC", approved: false, color: "#00FF66" },
      ],
    },
    {
      id: "2",
      proposer: { name: "Manuela", initials: "MV", color: "#00D4FF" },
      title: "Ingredientes para pasta al horno (mercado del finde).",
      amount: 65000,
      status: "approved",
      category: "mercado",
    },
    {
      id: "3",
      proposer: { name: "David", initials: "DC", color: "#00FF66" },
      title: "Compra de Jägermeister para el viernes.",
      amount: 110000,
      status: "debate",
      category: "licor",
      attemptsLeft: 3,
      comments: [
        {
          from: "Sebastián",
          text: "Uy, ¿no está muy caro en esa licorera? Vi una promo más barata en otra.",
          color: "#8A2BE2",
        },
      ],
    },
  ],
  "torneo-baloncesto": [
    {
      id: "t1",
      proposer: { name: "Andrés", initials: "AL", color: "#00FF66" },
      title: "Pago de inscripción al torneo (cupo 8 jugadores).",
      amount: 80000,
      status: "approved",
      category: "mercado",
    },
    {
      id: "t2",
      proposer: { name: "Valentina", initials: "VR", color: "#FFB020" },
      title: "Hidratación + vendas para el partido del sábado.",
      amount: 35000,
      status: "pending",
      category: "mercado",
      approvals: [
        { name: "Andrés", initials: "AL", approved: true, color: "#00FF66" },
        { name: "David", initials: "DC", approved: false, color: "#00D4FF" },
        { name: "Sebastián", initials: "SR", approved: false, color: "#8A2BE2" },
      ],
    },
  ],
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

export function WalletView({
  walletId,
  onBack,
}: {
  walletId: string
  onBack: () => void
}) {
  const wallet = useMemo(() => wallets.find((w) => w.id === walletId) ?? wallets[0], [walletId])
  const proportions = proportionsByWallet[wallet.id] ?? []
  const expenses = expensesByWallet[wallet.id] ?? []

  const [autoFunding, setAutoFunding] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isAdmin = wallet.role === "Administrador"

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide pb-28">
      {/* Top bar with Back + Admin Gear */}
      <div className="px-5 pt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a Mis Carteras"
          className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHideBalance((v) => !v)}
            aria-label={hideBalance ? "Mostrar saldo" : "Ocultar saldo"}
            className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Ajustes de la cartera"
            className={
              isAdmin
                ? "h-9 w-9 rounded-full bg-card border border-primary/30 flex items-center justify-center text-primary hover:glow-primary transition-all"
                : "h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Wallet header */}
      <header className="px-5 pt-3 pb-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Cartera</p>
        <div className="flex items-center gap-2 mt-0.5">
          <h1 className="text-xl font-semibold">{wallet.name}</h1>
          {isAdmin && (
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              Admin
            </span>
          )}
        </div>

        {/* Balance card */}
        <div
          className="mt-4 relative rounded-3xl p-5 overflow-hidden border border-primary/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,255,102,0.15), rgba(138,43,226,0.12) 60%, rgba(19,24,41,0.6))",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl"
          />

          <div className="relative">
            <p className="text-[11px] uppercase tracking-wider text-foreground/70">
              Saldo bolsa común
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-glow-primary text-primary">
              {hideBalance ? "••••••" : formatCOP(wallet.balance)}
            </p>
            <p className="mt-1.5 text-[10px] leading-snug text-foreground/60 text-pretty">
              Fondo aislado. El saldo sobrante se redistribuirá proporcionalmente al cierre.
            </p>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 items-center">
              <button
                type="button"
                className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-all hover:bg-primary/90 hover:glow-primary active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
                Fondear cartera
              </button>

              <label className="flex items-center gap-2 rounded-xl bg-background/40 border border-border px-3 h-11 cursor-pointer select-none">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] text-foreground/90 leading-tight">
                  Aporte
                  <br />
                  automático
                </span>
                <Toggle on={autoFunding} onChange={setAutoFunding} />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Proportions */}
      <section className="px-5" aria-label="Proporción actual de aportes">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Proporción actual</h2>
          {isAdmin ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-secondary font-medium hover:text-secondary/80 transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Editar acuerdos
            </button>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Solo lectura
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          {proportions.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground/90">{p.name}</span>
                <span className="tabular-nums text-muted-foreground">{p.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${p.percent}%`,
                    background: p.color,
                    boxShadow: `0 0 12px ${p.color}88`,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-start gap-1.5 pt-1.5 border-t border-border/60">
            <Info className="h-3 w-3 text-secondary mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground text-pretty">
              División calculada inteligentemente basada en ingresos declarados.
            </p>
          </div>
        </div>
      </section>

      {/* Approval feed */}
      <section className="px-5 mt-6" aria-label="Feed de aprobación de gastos">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Feed de aprobación</h2>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Hoy</span>
        </div>

        <div className="space-y-3">
          {expenses.map((e) => (
            <ExpenseCard key={e.id} expense={e} />
          ))}
        </div>
      </section>

      <WalletSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        walletName={wallet.name}
        members={wallet.members}
        isAdmin={isAdmin}
      />
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-5 w-9 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}
