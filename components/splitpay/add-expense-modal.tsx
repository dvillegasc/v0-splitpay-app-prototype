"use client"

import { useState } from "react"
import { Send, Tag, DollarSign, Wallet as WalletIcon, CheckCircle2, Camera, CreditCard, Receipt } from "lucide-react"
import { Modal } from "./modal"

const wallets = [
  { id: "casa-marinilla", name: "Casa Marinilla" },
  { id: "torneo-baloncesto", name: "Torneo de Baloncesto" },
]

export function AddExpenseModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [expenseType, setExpenseType] = useState<"direct" | "reimbursement">("direct")
  const [amount, setAmount] = useState("")
  const [concept, setConcept] = useState("")
  const [walletId, setWalletId] = useState(wallets[0].id)
  const [submitted, setSubmitted] = useState(false)

  function handleClose() {
    setSubmitted(false)
    setExpenseType("direct")
    setAmount("")
    setConcept("")
    setWalletId(wallets[0].id)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Añadir nuevo gasto"
      subtitle="Propón un gasto y deja que tu grupo lo apruebe."
    >
      {submitted ? (
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
                <p className="text-sm font-semibold text-foreground/90">
                  Subir recibo o factura
                </p>
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
                placeholder="120.000"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
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
                placeholder="Ej. Recibo de la luz"
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
              {wallets.map((w) => {
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

          <button
            type="submit"
            disabled={!amount || !concept}
            className={`w-full h-12 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] ${
              expenseType === "reimbursement"
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:glow-secondary"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:glow-primary"
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <Send className="h-4 w-4" />
            {expenseType === "reimbursement" ? "Solicitar reembolso" : "Proponer pago directo"}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">
            Toca fuera del recuadro para descartar.
          </p>
        </form>
      )}
    </Modal>
  )
}
