"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { PhoneFrame } from "@/components/splitpay/phone-frame"
import { api, setAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      // Petición POST a /auth/login a través de la librería API centralizada
      const response = await api.post("/auth/login", { email, password })

      const token =
        response?.token ||
        response?.access_token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.access_token ||
        response?.jwt

      if (token) {
        // Guardar el token JWT en almacenamiento local y cookies
        setAuthToken(token)

        toast({
          title: "¡Sesión iniciada!",
          description: "Has ingresado correctamente a SplitPay.",
        })

        router.push("/")
      } else {
        throw new Error("Respuesta del servidor sin token de autenticación.")
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Credenciales inválidas. Por favor verifica tus datos e intenta de nuevo."
      setErrorMessage(msg)
      toast({
        title: "Error de inicio de sesión",
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
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-10 w-10 rounded-2xl bg-card border border-primary/30 flex items-center justify-center text-primary glow-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Split<span className="text-primary text-glow-primary">Pay</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            ¡Hola de nuevo!
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-pretty">
            Ingresa a tu cuenta para gestionar tus carteras compartidas y aprobaciones.
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="my-auto space-y-4 pt-6 pb-4">
          {errorMessage && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-xs text-destructive text-balance">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 font-medium">
              Correo electrónico
            </label>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-12 transition-all">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary/90 hover:text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative flex items-center rounded-xl bg-background/60 border border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 px-3.5 h-12 transition-all">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:glow-primary active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Iniciando sesión…
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Pie de página */}
        <div className="pt-2 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Regístrate aquí
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
