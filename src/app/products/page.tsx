// src/app/products/page.tsx
"use client";
import { useState } from "react";
import { Search, LayoutGrid, List, TrendingUp } from "lucide-react";
import { useStore } from "@/store";
import ProductCard from "@/components/ProductCard";
import { fmtCurrency, fmtNumber } from "@/lib/format";

const CATEGORIES = ["All", "Metals", "Soft Commodities", "Grains", "Electronics", "Textiles"];

export default function ProductsPage() {
  const { products, openTradeModal } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "qty" | "value">("name");

  const filtered = products
    .filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "qty") return b.quantity - a.quantity;
      return b.sellPrice * b.quantity - a.sellPrice * a.quantity;
    });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Products & Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products · Live prices update every 3s</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-bg-700 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent-blue/50"
          />
        </div>

        <div className="flex gap-1 bg-bg-700 border border-border rounded-lg p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors
                ${category === c ? "bg-accent-blue text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-bg-700 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
        >
          <option value="name">Sort: Name</option>
          <option value="qty">Sort: Quantity</option>
          <option value="value">Sort: Value</option>
        </select>

        <div className="flex gap-1 bg-bg-700 border border-border rounded-lg p-1 ml-auto">
          {([["grid", LayoutGrid], ["list", List]] as const).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`p-1.5 rounded-md transition-colors ${view === v ? "bg-bg-500 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="bg-bg-700 border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                {["Product", "Category", "Buy Price", "Sell Price", "Quantity", "Total Value", ""].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-bg-600/30 transition-colors group">
                  <td className="px-4 py-3">
                    <a href={`/products/${p.id}`} className="font-medium text-gray-200 hover:text-accent-blue transition-colors flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-600" />
                      {p.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400">{fmtCurrency(p.buyPrice)}</td>
                  <td className="px-4 py-3 font-mono text-purple-400">{fmtCurrency(p.sellPrice)}</td>
                  <td className="px-4 py-3 font-mono text-gray-300">{fmtNumber(p.quantity)} <span className="text-gray-600 text-xs">{p.unit}</span></td>
                  <td className="px-4 py-3 font-mono text-gray-300">{fmtCurrency(p.sellPrice * p.quantity, true)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openTradeModal(p.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-accent-blue border border-accent-blue/20 bg-accent-blue/10 hover:bg-accent-blue hover:text-white px-3 py-1 rounded-lg transition-all"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">No products match your filters.</div>
      )}
    </div>
  );
}
