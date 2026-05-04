// src/components/Header.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Wallet, User } from "lucide-react";
import { useStore } from "@/store";
import { fmtCurrency } from "@/lib/format";

export default function Header() {
  const { cashBalance, openTradeModal, products, counterparties, sidebarOpen } = useStore();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const results = query.length > 1
    ? [
        ...products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map((p) => ({ type: "product", id: p.id, name: p.name, sub: p.category })),
        ...counterparties.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map((c) => ({ type: "cp", id: c.id, name: c.name, sub: c.type })),
      ]
    : [];

  const handleSelect = (item: { type: string; id: string }) => {
    setQuery("");
    setShowResults(false);
    if (item.type === "product") router.push(`/products/${item.id}`);
    else router.push(`/counterparties/${item.id}`);
  };

  return (
    <header
      className={`fixed top-0 right-0 h-14 z-20 flex items-center gap-4 px-4 border-b border-border bg-bg-800/95 backdrop-blur transition-all duration-300
        ${sidebarOpen ? "left-56" : "left-14"}`}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-80">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onFocus={() => setShowResults(true)}
          placeholder="Search products, counterparties..."
          className="w-full bg-bg-700 border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent-blue/50 transition-colors"
        />
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-bg-700 border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
            {results.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-bg-600 text-left transition-colors"
              >
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono uppercase ${r.type === "product" ? "bg-accent-blue/20 text-accent-blue" : "bg-accent-purple/20 text-accent-purple"}`}>
                  {r.type === "product" ? "PRD" : "CTR"}
                </span>
                <div>
                  <p className="text-sm text-gray-200">{r.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{r.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Cash Balance */}
        <div className="flex items-center gap-2 bg-bg-700 border border-border rounded-lg px-3 py-1.5">
          <Wallet size={14} className="text-accent-cyan" />
          <div>
            <p className="text-xs text-gray-500 leading-none">Balance</p>
            <p className="text-sm font-mono font-semibold text-accent-cyan leading-none mt-0.5">{fmtCurrency(cashBalance, true)}</p>
          </div>
        </div>

        {/* Quick Trade */}
        <button
          onClick={() => openTradeModal()}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 shadow-lg shadow-accent-blue/20"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Trade</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 bg-bg-700 border border-border rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-accent-purple/30 flex items-center justify-center">
            <User size={12} className="text-accent-purple" />
          </div>
          <span className="text-sm text-gray-300 hidden sm:inline">Demo Trader</span>
        </div>
      </div>
    </header>
  );
}
