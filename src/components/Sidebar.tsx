// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, History, TrendingUp, X, Menu } from "lucide-react";
import { useStore } from "@/store";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/counterparties", label: "Counterparties", icon: Users },
  { href: "/history", label: "Trade History", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 border-r border-border
          ${sidebarOpen ? "w-56" : "w-14"} bg-bg-800`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 h-14 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded bg-accent-blue flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-white text-lg tracking-tight">TradeFlow</span>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto p-1 rounded hover:bg-bg-600 text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-hidden">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                    : "text-gray-400 hover:text-gray-100 hover:bg-bg-600"
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Version */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-xs text-gray-600 font-mono">TRADEFLOW v1.0</p>
            <p className="text-xs text-gray-600">Demo Trader · Active</p>
          </div>
        )}
      </aside>
    </>
  );
}
