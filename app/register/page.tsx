"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles, User, DollarSign } from "lucide-react"
import { PhoneFrame } from "@/components/splitpay/phone-frame"
import { api, setAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

function parseCOPInput(raw: string) {
  const n = Number(raw.replace(/[^0-9]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [ingresoMensual, setIngresoMensual] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const ingresoNum = parseCOPInput(ingresoMensual)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password || !ingresoMensual) {
      setErrorMessage("Por favor completa todos los campos requeridos.")
      return
    }

    if (ingresoNum <= 0) {
      setErrorMessage("Ingresa un monto válido para tu ingreso mensual declarado.")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        ingreso_mensual_declarado: ingresoNum,
      }

      // Petición POST a /auth/register mediante la librería API centralizada
      const response = await api.post("/auth/register", payload)

      const token =
        response?.token ||
        response?.access_token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.access_token ||
        response?.jwt

      if (token) {
        setAuthToken(token)
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Te has registrado exitosamente en SplitPay.",
      })

      if (token) {
        router.push("/")
      } else {
        router.push("/login")
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Ocurrió un error al registrar la cuenta. Por favor intenta de nuevo."
      setErrorMessage(msg)
      toast({
        title: "Error en el registro",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col justify-between px-6 py-8 overflow-y-auto scrollbar-hide">
        {/* Encabezado */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-10 w-10 rounded-2xl bg-card border border-primary/30 flex items-center justify-center text-primary glow-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Split<span className="text-primary text-glow-primary">Pay</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            Crea tu cuenta
          </h1>
          <p className="text-xs text-muted-foreground mt-1 text-pretty">
            Empieza a gestionar y dividir gastos de forma inteligente con tu grupo.
          </p>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleSubmit} className="my-auto space-y-3.5 pt-4 pb-2">
          {errorMessage && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-xs text-destructive text-balance">
              {errorMessage}
            </div>
          )}

          {/* Nombre completo */}
          <div>
            <label htmlFor="name" className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
              Nombre completo
            </label>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-11 transition-all">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="name"
                type="text"
                required
                placeholder="David Castro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent ml-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
              Correo electrónico
            </label>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-11 transition-all">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="email"
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent ml-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
              Contraseña
            </label>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-11 transition-all">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent ml-2.5 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Ingreso mensual declarado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="ingreso_mensual_declarado" className="block text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Ingreso mensual declarado
              </label>
              {ingresoNum > 0 && (
                <span className="text-[10px] font-semibold text-primary tabular-nums">
                  {formatCOP(ingresoNum)}
                </span>
              )}
            </div>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-11 transition-all">
              <DollarSign className="h-4 w-4 text-primary shrink-0" />
              <input
                id="ingreso_mensual_declarado"
                type="text"
                inputMode="numeric"
                required
                placeholder="3500000"
                value={ingresoMensual}
                onChange={(e) => setIngresoMensual(e.target.value.replace(/[^0-9]/g, ""))}
                className="flex-1 bg-transparent ml-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums"
              />
              <span className="text-xs text-muted-foreground ml-1">COP</span>
            </div>
            <p className="text-[10px] text-muted-foreground/80 mt-1">
              Se utiliza para calcular de forma justa tu porcentaje de aporte en las carteras compartidas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:glow-primary active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando…
              </>
            ) : (
              <>
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Pie de página */}
        <div className="pt-2 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Conexión segura SSL · SplitPay Colombia
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
