"use client"

import { useState } from "react"
import { PhoneFrame } from "@/components/splitpay/phone-frame"
import { BottomNav, type ViewKey } from "@/components/splitpay/bottom-nav"
import { DashboardView } from "@/components/splitpay/dashboard-view"
import { WalletsListView } from "@/components/splitpay/wallets-list-view"
import { WalletView } from "@/components/splitpay/wallet-view"
import { AlertsView } from "@/components/splitpay/alerts-view"
import { ProfileView } from "@/components/splitpay/profile-view"
import { AddExpenseModal } from "@/components/splitpay/add-expense-modal"

export default function Page() {
  const [view, setView] = useState<ViewKey>("dashboard")
  const [openWalletId, setOpenWalletId] = useState<string | null>(null)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)

  function handleNavChange(next: ViewKey) {
    setView(next)
    // When leaving the wallets section, also clear any open detail
    if (next !== "wallets") setOpenWalletId(null)
  }

  return (
    <PhoneFrame>
      {view === "dashboard" && (
        <div key="dashboard" className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
          <DashboardView />
        </div>
      )}

      {view === "wallets" &&
        (openWalletId ? (
          <div
            key={`detail-${openWalletId}`}
            className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right-4 duration-200"
          >
            <WalletView walletId={openWalletId} onBack={() => setOpenWalletId(null)} />
          </div>
        ) : (
          <div
            key="list"
            className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-left-4 duration-200"
          >
            <WalletsListView onOpen={(id) => setOpenWalletId(id)} />
          </div>
        ))}

      {view === "alerts" && (
        <div key="alerts" className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
          <AlertsView />
        </div>
      )}

      {view === "profile" && (
        <div key="profile" className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
          <ProfileView />
        </div>
      )}

      <BottomNav
        active={view}
        onChange={handleNavChange}
        onAddExpense={() => setAddExpenseOpen(true)}
      />

      <AddExpenseModal open={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />
    </PhoneFrame>
  )
}
