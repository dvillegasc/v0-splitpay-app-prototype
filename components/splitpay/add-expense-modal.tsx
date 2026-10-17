"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Send,
  Tag,
  DollarSign,
  Wallet as WalletIcon,
  CheckCircle2,
  Camera,
  CreditCard,
  Receipt,
  Sparkles,
  Users,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Modal } from "./modal"
import {
  computeSplitLines,
  formatCOP,
  type DivisionStrategy,
  validateCustomSplit,
} from "@/lib/expense-division"
import { api, parseApiError } from "@/lib/api"

function parseCOPInput(raw: string) {
  const n = Number(raw.replace(/[^0-9]/g, ""))
  return Number.isFinite(n) ? n : 0
}

export function AddExpenseModal({
  open,
  onClose,
  householdId,
}: {
  open: boolean
  onClose: () => void
  householdId?: string
}) {
  const [expenseType, setExpenseType] = useState<"direct" | "reimbursement">("direct")
  const [amount, setAmount] = useState("")
  const [concept, setConcept] = useState("")
  
  const [walletsList, setWalletsList] = useState<{ id: string; name: string }[]>([
    { id: "casa-marinilla", name: "Casa Marinilla" },
  ])
  const [walletId, setWalletId] = useState(householdId || "casa-marinilla")

  // Division strategy for UI preview
  const [divisionStrategy, setDivisionStrategy] = useState<DivisionStrategy>("proportional")
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({})

  // Submit & Error state
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch real households when modal opens
  useEffect(() => {
    if (!open) return

    let isMounted = true
    async function fetchWallets() {
      try {
        let res: any
        try {
          res = await api.get("/households/me")
        } catch {
          res = await api.get("/api/households/me")
        }

        const data = res?.households || res?.household || res?.data?.households || res?.data?.household || res?.data || res
        const list: any[] = Array.isArray(data) ? data : data ? [data] : []

        if (isMounted && list.length > 0) {
          const mapped = list.map((h: any, idx: number) => ({
            id: h.id || h.household_id || `household-${idx}`,
            name: h.name || `Cartera ${idx + 1}`,
          }))
          setWalletsList(mapped)

          if (householdId) {
            setWalletId(householdId)
          } else if (mapped[0]?.id) {
            setWalletId(mapped[0].id)
          }
        }
      } catch (err) {
        console.warn("Error fetching households in AddExpenseModal:", err)
      }
    }

    fetchWallets()

    return () => {
      isMounted = false
    }
  }, [open, householdId])

  const amountCOP = useMemo(() => parseCOPInput(amount), [amount])

  // Visual preview of split breakdown
  const splitLines = useMemo(() => {
    return computeSplitLines({
      totalCOP: amountCOP,
      strategy: divisionStrategy,
      customAmounts: customAmounts as any,
    })
  }, [amountCOP, divisionStrategy, customAmounts])

  const customValidation = useMemo(() => {
    if (divisionStrategy !== "custom") return { valid: true, sum: amountCOP, diff: 0 }
    return validateCustomSplit(amountCOP, splitLines)
  }, [divisionStrategy, amountCOP, splitLines])

  function handleClose() {
    setSubmitState("idle")
    setErrorMessage(null)
    setExpenseType("direct")
    setAmount("")
    setConcept("")
    setWalletId(householdId || (walletsList[0]?.id ?? "casa-marinilla"))
    setDivisionStrategy("proportional")
    setCustomAmounts({})
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitState !== "idle") return

    if (divisionStrategy === "custom" && !customValidation.valid) return

    setSubmitState("loading")
    setErrorMessage(null)

    try {
      const payload = {
        household_id: walletId,
        amount: amountCOP,
        description: concept,
        concept,
        payment_type: expenseType,
        division_strategy: divisionStrategy,
      }

      try {
        await api.post("/expenses", payload)
      } catch {
        await api.post("/api/expenses", payload)
      }

      setSubmitState("success")
    } catch (err: any) {
      const msg = parseApiError(err)
      setErrorMessage(msg)
      setSubmitState("idle")
    }
  }

  const canSubmit =
    amountCOP > 0 &&
    concept.trim().length > 0 &&
    (divisionStrategy !== "custom" || customValidation.valid)

  return (
    <Modal open={open} onClose={handleClose} title="Añadir nuevo gasto" subtitle="Propón un gasto y deja que tu grupo lo apruebe.">
      {submitState === "success" ? (
        <div className="py-6 flex flex-col items-center text-center">
          <span className="h-14 w-14 rounded-full bg-primary/15 text-primary flex items-center justify-center glow-primary">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">¡Listo, lo propusiste!</h3>
          <p className="mt-1 text-xs text-muted-foreground text-pretty max-w-[260px]">
            Tu grupo recibirá la solicitud para aprobarla. Te avisamos cuando todos respondan.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:glow-primary transition-all"
          >
            Listo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive text-balance">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Hybrid Payment Model Tabs */}
          <div className="flex bg-background/50 p-1.5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setExpenseType("direct")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                expenseType === "direct"
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Pago Directo (Tarjeta SplitPay)
            </button>
            <button
              type="button"
              onClick={() => setExpenseType("reimbursement")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                expenseType === "reimbursement"
                  ? "bg-secondary/20 text-secondary border border-secondary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Receipt className="h-4 w-4" />
              Solicitar Reembolso
            </button>
          </div>

          {/* Upload Receipt UI */}
          {expenseType === "reimbursement" && (
            <div className="mt-4 p-5 rounded-2xl border-2 border-dashed border-border bg-card/40 flex flex-col items-center justify-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/15 flex items-center justify-center text-secondary glow-secondary">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/90">Subir recibo o factura</p>
                <p className="text-xs text-muted-foreground mt-0.5 text-balance">
                  Sube una foto para extraer el monto automáticamente.
                </p>
              </div>
              <p className="text-[10px] text-secondary font-medium px-2 py-1 rounded-md bg-secondary/10 mt-1">
                Los fondos se transferirán a tu cuenta personal una vez aprobado.
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Monto
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-background border border-border focus-within:ring-2 focus-within:ring-primary/40 px-3 h-12">
              <DollarSign className="h-4 w-4 text-primary" />
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                placeholder="120000"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                className="flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="text-[11px] text-muted-foreground">COP</span>
            </div>
          </div>

          {/* Concept */}
          <div>
            <label htmlFor="concept" className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Concepto
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-background border border-border focus-within:ring-2 focus-within:ring-primary/40 px-3 h-12">
              <Tag className="h-4 w-4 text-primary" />
              <input
                id="concept"
                type="text"
                placeholder="Ej. Arriendo"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Wallet picker */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Cartera
            </label>
            <div className="mt-1.5 grid grid-cols-1 gap-2">
              {walletsList.map((w) => {
                const active = walletId === w.id
                return (
                  <button
                    type="button"
                    key={w.id}
                    onClick={() => setWalletId(w.id)}
                    aria-pressed={active}
                    className={`flex items-center justify-between rounded-xl border px-3 h-12 text-sm transition-colors ${
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border bg-background text-foreground/80 hover:border-primary/30"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <WalletIcon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      {w.name}
                    </span>
                    <span
                      className={`h-4 w-4 rounded-full border-2 ${
                        active ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Division strategy selector */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              División del gasto (Previsualización)
            </label>

            <div className="mt-1.5 flex bg-background/50 p-1.5 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setDivisionStrategy("proportional")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  divisionStrategy === "proportional"
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Proporcional
              </button>
              <button
                type="button"
                onClick={() => setDivisionStrategy("equal")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  divisionStrategy === "equal"
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
                Partes iguales
              </button>
              <button
                type="button"
                onClick={() => setDivisionStrategy("custom")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  divisionStrategy === "custom"
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tag className="h-4 w-4" />
                Manual
              </button>
            </div>

            {/* Previsualización del desglose */}
            <div className="mt-3 rounded-2xl bg-card border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground/90">Desglose estimado</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  Total: <span className="text-foreground">{formatCOP(amountCOP)}</span>
                </p>
              </div>

              {splitLines.map((l) => (
                <div key={l.memberId} className="flex items-center justify-between gap-3 rounded-xl bg-background/40 border border-border px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-7 w-7 rounded-full inline-flex items-center justify-center text-[10px] font-semibold shrink-0"
                      style={{ background: `${l.color}33`, color: l.color, border: `1px solid ${l.color}55` }}
                      aria-hidden
                    >
                      {l.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{l.name}</p>
                      <p className="text-[10px] text-muted-foreground tabular-nums">
                        {(l.percent * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {divisionStrategy === "custom" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={String((customAmounts as any)[l.memberId] ?? l.amountCOP)}
                        onChange={(e) => {
                          const v = parseCOPInput(e.target.value)
                          setCustomAmounts((prev) => ({ ...prev, [l.memberId]: v }))
                        }}
                        className="w-28 h-9 rounded-xl bg-background border border-border px-3 text-xs text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-secondary/30"
                        placeholder="0"
                      />
                      <span className="text-[10px] text-muted-foreground">COP</span>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold tabular-nums text-foreground">{formatCOP(l.amountCOP)}</p>
                  )}
                </div>
              ))}

              {divisionStrategy === "custom" && (
                <div
                  className={`mt-1 rounded-xl border px-3 py-2 text-xs ${
                    customValidation.valid
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-secondary/10 border-secondary/30 text-secondary"
                  }`}
                >
                  {customValidation.valid ? (
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Cuadra perfecto: {formatCOP(customValidation.sum)}
                    </span>
                  ) : (
                    <span className="tabular-nums">
                      No cuadra: suma {formatCOP(customValidation.sum)} (diferencia {formatCOP(customValidation.diff)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Primary action button */}
          <button
            type="submit"
            disabled={!canSubmit || submitState !== "idle"}
            className={`w-full h-12 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
              expenseType === "reimbursement"
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:glow-secondary"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-primary"
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {submitState === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {expenseType === "reimbursement" ? "Solicitar reembolso" : "Proponer pago"}
              </>
            )}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">Toca fuera del recuadro para descartar.</p>
        </form>
      )}
    </Modal>
  )
}
