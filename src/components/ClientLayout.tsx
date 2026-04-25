// src/components/ClientLayout.tsx
"use client";
import { useEffect } from "react";
import { useStore } from "@/store";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TradeModal from "./TradeModal";
import Toasts from "./Toasts";
import { usePriceFluctuation } from "@/hooks/usePriceFluctuation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { initializeStore, sidebarOpen } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  usePriceFluctuation(3000);

  return (
    <div className="min-h-screen bg-bg-900">
      <Sidebar />
      <Header />
      <main
        className={`transition-all duration-300 pt-14 min-h-screen ${sidebarOpen ? "pl-56" : "pl-14"}`}
      >
        <div className="p-5 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
      <TradeModal />
      <Toasts />
    </div>
  );
}
