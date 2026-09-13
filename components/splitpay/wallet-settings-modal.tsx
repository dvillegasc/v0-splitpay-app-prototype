"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Trash2, UserCircle2, LogOut, AlertTriangle, Cpu, Zap, Handshake, Loader2 } from "lucide-react"
import { Modal } from "./modal"
import { api } from "@/lib/api"

export type WalletMember = {
  id?: string
  name: string
  initials: string
  color: string
  role: "Administrador" | "Miembro" | "Tesorero" | string
  is_treasurer?: boolean
}

export function WalletSettingsModal({
  open,
  onClose,
  walletName,
  members: initialMembers,
  isAdmin,
  householdId = "casa-marinilla",
}: {
  open: boolean
  onClose: () => void
  walletName: string
  members: WalletMember[]
  isAdmin: boolean
  householdId?: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [members, setMembers] = useState<WalletMember[]>(initialMembers)
  const [loadingMembers, setLoadingMembers] = useState(false)

  // Smart rule toggles
  const [ruleTrust, setRuleTrust] = useState(true)
  const [ruleFixed, setRuleFixed] = useState(true)
  const [ruleUnanimous, setRuleUnanimous] = useState(false)

  // Cargar miembros reales del hogar vía GET /api/households/{id}/members
  useEffect(() => {
    if (!open) return
    let isMounted = true

    async function fetchMembers() {
      setLoadingMembers(true)
      try {
        let response: any
        try {
          response = await api.get(`/households/${householdId}/members`)
        } catch {
          response = await api.get(`/api/households/${householdId}/members`)
        }

        const data = response?.members || response?.data?.members || response?.data || response
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const defaultColors = ["#00FF66", "#8A2BE2", "#00D4FF", "#FFB020", "#FF4D6D"]
          const mapped: WalletMember[] = data.map((m: any, idx: number) => {
            const name = m.name || m.user_name || m.email || `Miembro ${idx + 1}`
            const rawRole = (m.role || m.user_role || (m.is_treasurer ? "Tesorero" : "Miembro")).toString()
            const isTreas =
              m.is_treasurer === true ||
              rawRole.toLowerCase().includes("tesorero") ||
              rawRole.toLowerCase().includes("treasurer") ||
              idx === 0
            
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase() || "M"

            return {
              id: m.id || m.user_id || `m-${idx}`,
              name,
              initials,
              color: m.color || defaultColors[idx % defaultColors.length],
              role: isTreas ? "Tesorero" : rawRole,
              is_treasurer: isTreas,
            }
          })
          setMembers(mapped)
        }
      } catch (err) {
        console.warn("No se pudieron cargar los miembros de la API, conservando lista local:", err)
      } finally {
        if (isMounted) setLoadingMembers(false)
      }
    }

    fetchMembers()

    return () => {
      isMounted = false
    }
  }, [open, householdId])

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
        <div className="space-y-6">
          
          {/* Smart Approval Rules */}
          <section aria-label="Reglas Inteligentes de Aprobación">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-secondary" />
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Reglas Inteligentes
              </h3>
            </div>
            
            <div className="rounded-2xl bg-card border border-border p-1 divide-y divide-border">
              {/* Rule 1 */}
              <label className="flex items-start justify-between gap-4 p-3 cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Trust Limit</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Auto-aprobar gastos dinámicos individuales menores a $50.000.
                  </p>
                </div>
                <Toggle on={ruleTrust} onChange={setRuleTrust} />
              </label>

              {/* Rule 2 */}
              <label className="flex items-start justify-between gap-4 p-3 cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Gastos Fijos</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Auto-aprobar recibos registrados (ej. Arriendo, Luz) en su fecha de corte.
                  </p>
                </div>
                <Toggle on={ruleFixed} onChange={setRuleFixed} />
              </label>

              {/* Rule 3 */}
              <label className="flex items-start justify-between gap-4 p-3 cursor-pointer group">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Handshake className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Consenso Unánime</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Requerir 100% de aprobación para cualquier gasto mayor a $100.000.
                  </p>
                </div>
                <Toggle on={ruleUnanimous} onChange={setRuleUnanimous} />
              </label>
            </div>
          </section>

          {/* Members */}
          <section aria-label="Miembros del hogar">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
                Miembros ({members.length})
              </h3>
              {loadingMembers ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  Cargando...
                </span>
              ) : isAdmin ? (
                <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  Vista admin
                </span>
              ) : null}
            </div>

            <ul className="rounded-2xl bg-background border border-border divide-y divide-border max-h-[220px] overflow-y-auto scrollbar-hide">
              {members.map((m) => {
                const isTreas =
                  m.is_treasurer ||
                  m.role?.toLowerCase().includes("tesorero") ||
                  m.role?.toLowerCase().includes("treasurer")

                return (
                  <li key={m.id || m.name} className="flex items-center gap-3 px-3 py-2.5">
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
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[11px] text-muted-foreground capitalize">{m.role}</p>
                        {isTreas && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 glow-primary">
                            Tesorero
                          </span>
                        )}
                      </div>
                    </div>
                    {isTreas ? (
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <UserCircle2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </li>
                )
              })}
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
                    className="h-10 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-destructive/90 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Confirmar eliminación
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="mt-3 w-full h-10 rounded-xl bg-destructive/10 border border-destructive/40 text-destructive text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-destructive/20 transition-all"
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

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-5 w-9 rounded-full transition-colors shrink-0 ${
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
