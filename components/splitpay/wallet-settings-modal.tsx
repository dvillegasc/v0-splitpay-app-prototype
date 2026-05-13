"use client"

import { useState } from "react"
import { ShieldCheck, Trash2, UserCircle2, LogOut, AlertTriangle } from "lucide-react"
import { Modal } from "./modal"

export type WalletMember = {
  name: string
  initials: string
  color: string
  role: "Administrador" | "Miembro"
}

export function WalletSettingsModal({
  open,
  onClose,
  walletName,
  members,
  isAdmin,
}: {
  open: boolean
  onClose: () => void
  walletName: string
  members: WalletMember[]
  isAdmin: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleted, setDeleted] = useState(false)

  function handleClose() {
    setConfirming(false)
    setDeleted(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Ajustes de la cartera"
      subtitle={walletName}
    >
      {deleted ? (
        <div className="py-6 flex flex-col items-center text-center">
          <span className="h-14 w-14 rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
            <Trash2 className="h-7 w-7" />
          </span>
          <h3 className="mt-3 text-base font-semibold">Cartera eliminada</h3>
          <p className="mt-1 text-xs text-muted-foreground text-pretty max-w-[260px]">
            El saldo restante se redistribuyó proporcionalmente entre los miembros.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:glow-primary transition-all"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Members */}
          <section aria-label="Miembros de la cartera">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                Miembros ({members.length})
              </h3>
              {isAdmin && (
                <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  Vista admin
                </span>
              )}
            </div>

            <ul className="rounded-2xl bg-background border border-border divide-y divide-border max-h-[180px] overflow-y-auto scrollbar-hide">
              {members.map((m) => (
                <li key={m.name} className="flex items-center gap-3 px-3 py-2.5">
                  <span
                    className="h-9 w-9 rounded-full inline-flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: `${m.color}33`,
                      color: m.color,
                      border: `1px solid ${m.color}55`,
                    }}
                    aria-hidden
                  >
                    {m.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.role === "Administrador" ? "Administrador" : "Miembro"}
                    </p>
                  </div>
                  {m.role === "Administrador" ? (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Danger zone */}
          {isAdmin ? (
            <section
              aria-label="Zona de riesgo"
              className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-destructive">Zona de riesgo</p>
                  <p className="text-[11px] text-foreground/70 mt-0.5 text-pretty">
                    Al eliminar la cartera, el saldo se redistribuirá entre todos los miembros y no podrás revertirlo.
                  </p>
                </div>
              </div>

              {confirming ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="h-10 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:border-foreground/30 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleted(true)}
                    className="h-10 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Confirmar eliminación
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="mt-3 w-full h-10 rounded-xl bg-destructive/10 border border-destructive/40 text-destructive text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar cartera
                </button>
              )}
            </section>
          ) : (
            <button
              type="button"
              className="w-full h-11 rounded-xl bg-card border border-border text-sm font-semibold text-foreground/80 inline-flex items-center justify-center gap-1.5 hover:border-destructive/40 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Salir de la cartera
            </button>
          )}
        </div>
      )}
    </Modal>
  )
}
