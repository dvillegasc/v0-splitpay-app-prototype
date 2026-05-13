"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Bell,
  Clock,
  type LucideIcon,
} from "lucide-react"

type Tone = "urgent" | "success" | "info"

type Alert = {
  id: string
  tone: Tone
  icon: LucideIcon
  title: string
  body: string
  time: string
  cta?: string
}

const alerts: Alert[] = [
  {
    id: "a1",
    tone: "urgent",
    icon: AlertTriangle,
    title: "¡Pilas! Recibo de la luz vence mañana",
    body: "Cartera Casa Marinilla. Faltan 2 aprobaciones para mover la plata.",
    time: "Hace 5 min",
    cta: "Ver gasto",
  },
  {
    id: "a2",
    tone: "success",
    icon: CheckCircle2,
    title: "Manuela aprobó tu propuesta",
    body: "Ingredientes para pasta · $65.000. Ya quedó en firme.",
    time: "Hace 1 h",
  },
  {
    id: "a3",
    tone: "info",
    icon: Sparkles,
    title: "Sebastián pagó su parte del internet",
    body: "Aporte de $42.000 acreditado en la bolsa común de Casa Marinilla.",
    time: "Ayer",
  },
]

const toneStyles: Record<
  Tone,
  { ring: string; iconBg: string; iconColor: string; chip: string; chipText: string; label: string }
> = {
  urgent: {
    ring: "border-[#FF4D6D]/40 ring-[#FF4D6D]/20",
    iconBg: "rgba(255,77,109,0.18)",
    iconColor: "#FF4D6D",
    chip: "bg-[#FF4D6D]/15",
    chipText: "text-[#FF4D6D]",
    label: "Urgente",
  },
  success: {
    ring: "border-primary/40 ring-primary/20",
    iconBg: "rgba(0,255,102,0.18)",
    iconColor: "#00FF66",
    chip: "bg-primary/15",
    chipText: "text-primary",
    label: "Aprobado",
  },
  info: {
    ring: "border-secondary/40 ring-secondary/20",
    iconBg: "rgba(138,43,226,0.22)",
    iconColor: "#A875FF",
    chip: "bg-secondary/20",
    chipText: "text-secondary",
    label: "Info",
  },
}

export function AlertsView() {
  return (
    <main className="flex-1 overflow-y-auto scrollbar-hide pb-28">
      <header className="px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Alertas</p>
          <h1 className="mt-1 text-2xl font-semibold text-balance">
            Tu feed de <span className="text-primary text-glow-primary">avisos</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-pretty">
            Aprobaciones pendientes, pagos y novedades de tus carteras.
          </p>
        </div>
        <span className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary glow-primary shrink-0">
          <Bell className="h-4 w-4" />
        </span>
      </header>

      <section className="px-5 space-y-3" aria-label="Notificaciones">
        {alerts.map((a) => {
          const Icon = a.icon
          const tone = toneStyles[a.tone]
          return (
            <article
              key={a.id}
              className={`rounded-2xl bg-card border ${tone.ring} ring-1 p-4`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: tone.iconBg, color: tone.iconColor }}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tone.chip} ${tone.chipText}`}
                    >
                      {tone.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {a.time}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-sm font-semibold text-foreground text-pretty leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-muted-foreground text-pretty leading-snug">
                    {a.body}
                  </p>

                  {a.cta && (
                    <button
                      type="button"
                      className={`mt-3 h-9 px-3 rounded-lg text-xs font-semibold ${tone.chip} ${tone.chipText} hover:opacity-90 transition-opacity`}
                    >
                      {a.cta}
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          Ya estás al día con tus avisos.
        </p>
      </section>
    </main>
  )
}
