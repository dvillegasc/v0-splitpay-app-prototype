"use client"

import { useState } from "react"
import {
  Pencil,
  CreditCard,
  BellRing,
  History,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { Modal } from "./modal"

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

type Option = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  danger?: boolean
}

const options: Option[] = [
  {
    id: "payments",
    label: "Métodos de pago vinculados",
    description: "Nequi, Bancolombia y tarjeta",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Preferencias de notificaciones",
    description: "Aprobaciones, vencimientos y resumen",
    icon: BellRing,
  },
  {
    id: "history",
    label: "Historial de transacciones",
    description: "Aportes, pagos y reembolsos",
    icon: History,
  },
  {
    id: "logout",
    label: "Cerrar sesión",
    description: "Salir de tu cuenta en este dispositivo",
    icon: LogOut,
    danger: true,
  },
]

export function ProfileView() {
  const [income, setIncome] = useState(14500000)
  const [editOpen, setEditOpen] = useState(false)
  const [draftIncome, setDraftIncome] = useState(income.toString())

  function openEditor() {
    setDraftIncome(income.toString())
    setEditOpen(true)
  }

  function saveIncome() {
    const parsed = Number(draftIncome.replace(/[^0-9]/g, ""))
    if (!Number.isNaN(parsed) && parsed > 0) {
      setIncome(parsed)
    }
    setEditOpen(false)
  }

  return (
    <main className="flex-1 overflow-y-auto scrollbar-hide pb-28">
      <header className="px-5 pt-6 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Perfil</p>
        <h1 className="mt-1 text-2xl font-semibold text-balance">
          Mi <span className="text-primary text-glow-primary">cuenta</span>
        </h1>
      </header>

      {/* Avatar header */}
      <section className="px-5">
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 text-lg font-bold"
            style={{
              background: "linear-gradient(135deg, #00FF66 0%, #8A2BE2 100%)",
              color: "#0a0e1a",
              boxShadow: "0 0 18px rgba(0,255,102,0.45)",
            }}
            aria-hidden
          >
            DC
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">David Castro</h2>
            <p className="text-xs text-muted-foreground">davidcastro@correo.co</p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              <ShieldCheck className="h-3 w-3" />
              Usuario Activo
            </span>
          </div>
        </div>
      </section>

      {/* Income card */}
      <section className="px-5 mt-4" aria-label="Ingresos declarados">
        <div
          className="relative rounded-2xl p-4 overflow-hidden border border-primary/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,255,102,0.12), rgba(138,43,226,0.10) 70%, rgba(19,24,41,0.6))",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-14 -right-14 h-32 w-32 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-foreground/70">
                <Wallet className="h-3 w-3" />
                Ingreso mensual declarado
              </span>
              <button
                type="button"
                onClick={openEditor}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg bg-primary/10"
              >
                <Pencil className="h-3 w-3" />
                Editar
              </button>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-primary text-glow-primary">
              {formatCOP(income)} COP
            </p>
            <p className="mt-1 text-[11px] text-foreground/60 text-pretty">
              Se usa para calcular tu proporción de aporte en cada cartera.
            </p>
          </div>
        </div>
      </section>

      {/* Options list */}
      <section className="px-5 mt-5" aria-label="Configuración">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">
          Configuración
        </p>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          {options.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                  opt.danger ? "hover:bg-[#FF4D6D]/10" : "hover:bg-background/40"
                }`}
              >
                <span
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    opt.danger
                      ? "bg-[#FF4D6D]/15 text-[#FF4D6D]"
                      : "bg-secondary/15 text-secondary"
                  }`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      opt.danger ? "text-[#FF4D6D]" : "text-foreground"
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{opt.description}</p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 ${
                    opt.danger ? "text-[#FF4D6D]/70" : "text-muted-foreground"
                  }`}
                />
              </button>
            )
          })}
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-5">
          SplitPay · v0.1 prototipo
        </p>
      </section>

      {/* Edit income modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar ingreso mensual"
        subtitle="Tu plata declarada se usa para calcular cuánto aportas en cada cartera. Es privada."
      >
        <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
          Ingreso mensual (COP)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={draftIncome}
            onChange={(e) => setDraftIncome(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full h-12 pl-7 pr-3 rounded-xl bg-background/60 border border-border text-foreground text-base tabular-nums focus:outline-none focus:border-primary/60"
            placeholder="14500000"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(false)}
            className="flex-1 h-11 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-background/40 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveIncome}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 hover:glow-primary transition-all"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </main>
  )
}
