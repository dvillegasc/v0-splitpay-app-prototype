"use client"

import { useState } from "react"
import {
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Send,
  Zap,
  ShoppingBag,
  Wine,
  Bell,
  BellRing,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "pending" | "approved" | "debate"

export type Expense = {
  id: string
  proposer: { name: string; initials: string; color: string }
  title: string
  amount: number
  status: Status
  approvals?: { name: string; initials: string; approved: boolean; color: string }[]
  category: "luz" | "mercado" | "licor"
  comments?: { from: string; text: string; color: string }[]
  attemptsLeft?: number
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

const categoryIcon = {
  luz: Zap,
  mercado: ShoppingBag,
  licor: Wine,
}

export function ExpenseCard({ expense }: { expense: Expense }) {
  const [reply, setReply] = useState("")
  const [approvedNow, setApprovedNow] = useState(false)
  const [reminded, setReminded] = useState<Record<string, boolean>>({})
  const Icon = categoryIcon[expense.category]

  // Effective status — flips to "approved" once the user clicks Aprobar
  const status: Status = approvedNow && expense.status === "pending" ? "approved" : expense.status

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-4 transition-colors",
        status === "pending" && "border-primary/30",
        status === "approved" && "border-primary/30",
        status === "debate" && "border-secondary/40",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar initials={expense.proposer.initials} color={expense.proposer.color} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground">{expense.proposer.name}</p>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">propuso un gasto</p>
        </div>
        <span
          className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0"
          aria-hidden
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      {/* Body */}
      <div className="mt-3 rounded-xl bg-background/40 border border-border p-3">
        <p className="text-sm text-foreground/90 text-pretty">{expense.title}</p>
        <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
          {formatCOP(expense.amount)}
        </p>
      </div>

      {/* Pending: approval list + reminders + actions */}
      {expense.status === "pending" && expense.approvals && !approvedNow && (
        <>
          <div className="mt-3 space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Aprobaciones ({expense.approvals.filter((a) => a.approved).length}/
              {expense.approvals.length})
            </p>
            <ul className="space-y-1.5">
              {expense.approvals.map((a) => (
                <li
                  key={a.name}
                  className="flex items-center gap-2 rounded-xl bg-background/40 border border-border px-2.5 py-1.5"
                >
                  <Avatar initials={a.initials} color={a.color} size="sm" />
                  <span className="text-xs font-medium text-foreground/90 flex-1 truncate">
                    {a.name}
                  </span>

                  {a.approved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      Aprobó
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Pendiente
                      </span>
                      <button
                        type="button"
                        onClick={() => setReminded((r) => ({ ...r, [a.name]: true }))}
                        disabled={reminded[a.name]}
                        aria-label={`Enviar recordatorio a ${a.name}`}
                        className={cn(
                          "inline-flex items-center gap-1 h-7 px-2 rounded-full text-[10px] font-semibold transition-colors",
                          reminded[a.name]
                            ? "bg-primary/15 text-primary cursor-default"
                            : "bg-secondary/15 text-secondary hover:bg-secondary/25",
                        )}
                      >
                        {reminded[a.name] ? (
                          <>
                            <BellRing className="h-3 w-3" />
                            Enviado
                          </>
                        ) : (
                          <>
                            <Bell className="h-3 w-3" />
                            Recordar
                          </>
                        )}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setApprovedNow(true)}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-all hover:bg-primary/90 hover:glow-primary active:scale-[0.98]"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              Aprobar
            </button>
            <button
              type="button"
              className="h-11 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-all hover:bg-secondary/90 hover:glow-secondary active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Rechazar / Debatir
            </button>
          </div>
        </>
      )}

      {/* Approved (originally or after click) */}
      {(expense.status === "approved" || approvedNow) && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
          <button
            type="button"
            disabled
            className="text-xs font-semibold text-primary cursor-default"
            aria-label="Gasto aprobado"
          >
            ✓ Aprobado
          </button>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {approvedNow ? "Justo ahora" : "hace 2 días"}
          </span>
        </div>
      )}

      {/* Debate: chat + alert */}
      {expense.status === "debate" && (
        <>
          <div className="mt-3 rounded-xl bg-secondary/10 border border-secondary/30 px-3 py-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-secondary shrink-0" />
            <p className="text-xs text-foreground/90">
              Quedan{" "}
              <span className="font-semibold text-secondary">{expense.attemptsLeft}</span> intentos
              de aprobación hoy
            </p>
          </div>

          <div className="mt-3 space-y-2">
            {expense.comments?.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <Avatar initials={c.from.slice(0, 1)} color={c.color} size="sm" />
                <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-3 py-2 max-w-[85%]">
                  <p className="text-[11px] font-medium text-muted-foreground">{c.from}</p>
                  <p className="text-xs text-foreground/95 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}

            <form
              className="mt-2 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                setReply("")
              }}
            >
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Responder al debate…"
                className="flex-1 h-10 rounded-full bg-background border border-border px-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                aria-label="Enviar comentario"
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </article>
  )
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
        <Clock className="h-3 w-3" />
        Pendiente
      </span>
    )
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
        <Check className="h-3 w-3" strokeWidth={3} />
        Aprobado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
      <AlertTriangle className="h-3 w-3" />
      En debate
    </span>
  )
}

function Avatar({
  initials,
  color,
  size = "md",
  className,
}: {
  initials: string
  color: string
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold shrink-0",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-10 w-10 text-xs",
        className,
      )}
      style={{ background: `${color}33`, color, border: `1px solid ${color}55` }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
