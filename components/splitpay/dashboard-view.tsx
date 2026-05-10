"use client"

import {
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  TrendingUp,
  ShoppingCart,
  Bus,
  Wine,
  Sparkles,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const categoryData = [
  { name: "Mercado", value: 40, color: "#00FF66", icon: ShoppingCart },
  { name: "Pasajes Medellín–Marinilla", value: 25, color: "#8A2BE2", icon: Bus },
  { name: "Salidas / Licores", value: 20, color: "#00D4FF", icon: Wine },
  { name: "Suscripciones", value: 15, color: "#FFB020", icon: Sparkles },
]

const contributionData = [
  { name: "David", aporte: 720, fill: "#00FF66" },
  { name: "Sebastián", aporte: 630, fill: "#8A2BE2" },
  { name: "Manuela", aporte: 450, fill: "#00D4FF" },
]

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

export function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Mi Resumen</p>
        <h1 className="mt-1 text-2xl font-semibold text-balance">
          ¡Hola, <span className="text-primary text-glow-primary">David</span>!
        </h1>
        <p className="text-sm text-muted-foreground mt-1 text-pretty">
          Aquí está tu resumen financiero del mes.
        </p>
      </header>

      {/* Metric cards */}
      <section className="px-5 grid grid-cols-2 gap-3" aria-label="Métricas del mes">
        <MetricCard
          label="Aportado este mes"
          value={formatCOP(720000)}
          delta="+12%"
          deltaPositive
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Deuda pendiente"
          value={formatCOP(48000)}
          delta="−$22k"
          deltaPositive
          tone="secondary"
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
        <MetricCard
          className="col-span-2"
          label="Días de racha sin deudas"
          value="14 días"
          delta="¡Pilas, vas en racha!"
          icon={<Flame className="h-4 w-4" />}
          tone="streak"
        />
      </section>

      {/* Donut chart */}
      <section className="px-5 mt-6" aria-label="Gastos personales por categoría">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base font-semibold">Gastos por categoría</h2>
          <span className="text-xs text-muted-foreground">Este mes</span>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <div className="relative h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#131829",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#f5f7fb" }}
                    labelStyle={{ color: "#f5f7fb" }}
                    formatter={(value: number) => [`${value}%`, "Participación"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total
                </span>
                <span className="text-sm font-semibold text-foreground">{formatCOP(1450000)}</span>
              </div>
            </div>

            <ul className="space-y-2.5">
              {categoryData.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.name} className="flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${c.color}1f`, color: c.color }}
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/90 truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.value}%</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Bar chart */}
      <section className="px-5 mt-5" aria-label="Aportes a las carteras grupales">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base font-semibold">Aportes grupales</h2>
          <span className="text-xs text-muted-foreground">Casa Marinilla</span>
        </div>

        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contributionData}
                layout="vertical"
                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
                barSize={18}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={70}
                  tick={{ fill: "#8a93a8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#131829",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  itemStyle={{ color: "#f5f7fb" }}
                  labelStyle={{ color: "#f5f7fb" }}
                  formatter={(value: number) => [formatCOP(value * 1000), "Aporte"]}
                />
                <Bar dataKey="aporte" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight className="h-3 w-3 text-primary" />
              David lidera los aportes
            </span>
            <span>Total bolsa: {formatCOP(1800000)}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
  icon,
  tone = "primary",
  className,
}: {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  icon: React.ReactNode
  tone?: "primary" | "secondary" | "streak"
  className?: string
}) {
  const accent =
    tone === "primary"
      ? "text-primary"
      : tone === "secondary"
        ? "text-secondary"
        : "text-primary"

  const ring =
    tone === "primary"
      ? "ring-primary/20"
      : tone === "secondary"
        ? "ring-secondary/30"
        : "ring-primary/20"

  return (
    <div
      className={`relative rounded-2xl bg-card border border-border p-4 ring-1 ${ring} ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`${accent}`}>{icon}</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-foreground tabular-nums">{value}</p>
      {delta && (
        <p
          className={`mt-1 text-[11px] ${
            deltaPositive ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  )
}
