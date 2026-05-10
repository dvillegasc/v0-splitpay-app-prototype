"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"
import { PhoneFrame } from "@/components/splitpay/phone-frame"
import { BottomNav, type ViewKey } from "@/components/splitpay/bottom-nav"
import { DashboardView } from "@/components/splitpay/dashboard-view"
import { WalletsListView } from "@/components/splitpay/wallets-list-view"
import { WalletView } from "@/components/splitpay/wallet-view"
import { PlaceholderView } from "@/components/splitpay/placeholder-view"

export default function Page() {
  const [view, setView] = useState<ViewKey>("wallets")
  const [openWalletId, setOpenWalletId] = useState<string | null>(null)

  function handleNavChange(next: ViewKey) {
    setView(next)
    // When leaving the wallets section, also clear any open detail
    if (next !== "wallets") setOpenWalletId(null)
  }

  return (
    <PhoneFrame>
      {view === "dashboard" && (
        <div key="dashboard" className="flex-1 flex flex-col animate-in fade-in duration-200">
          <DashboardView />
        </div>
      )}

      {view === "wallets" &&
        (openWalletId ? (
          <div
            key={`detail-${openWalletId}`}
            className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-200"
          >
            <WalletView walletId={openWalletId} onBack={() => setOpenWalletId(null)} />
          </div>
        ) : (
          <div
            key="list"
            className="flex-1 flex flex-col animate-in fade-in slide-in-from-left-4 duration-200"
          >
            <WalletsListView onOpen={(id) => setOpenWalletId(id)} />
          </div>
        ))}

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

      <BottomNav active={view} onChange={handleNavChange} />
    </PhoneFrame>
  )
}
