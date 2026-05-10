"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"
import { PhoneFrame } from "@/components/splitpay/phone-frame"
import { BottomNav, type ViewKey } from "@/components/splitpay/bottom-nav"
import { DashboardView } from "@/components/splitpay/dashboard-view"
import { WalletView } from "@/components/splitpay/wallet-view"
import { PlaceholderView } from "@/components/splitpay/placeholder-view"

export default function Page() {
  const [view, setView] = useState<ViewKey>("wallet")

  return (
    <PhoneFrame>
      {view === "dashboard" && <DashboardView />}
      {view === "wallet" && <WalletView />}
      {view === "alerts" && (
        <PlaceholderView
          icon={Bell}
          title="¡Pilas, tienes un pago!"
          subtitle="Aquí verás tus alertas de aprobación, vencimientos y novedades de tus carteras."
        />
      )}
      {view === "profile" && (
        <PlaceholderView
          icon={User}
          title="Tu perfil"
          subtitle="Edita tus ingresos, métodos de pago y preferencias para ajustar tus aportes."
        />
      )}

      <BottomNav active={view} onChange={setView} />
    </PhoneFrame>
  )
}
