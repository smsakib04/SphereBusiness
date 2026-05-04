// src/app/page.tsx
"use client";
import { useMemo } from "react";
import { DollarSign, Package, Activity, Award, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useStore } from "@/store";
import StatCard from "@/components/StatCard";
import PnLChart from "@/components/PnLChart";
import { fmtCurrency, fmtDateTime, pnlColor, pnlBg } from "@/lib/format";

export default function Dashboard() {
  const { products, trades, dailyPnL, cashBalance, openTradeModal, getTodayTrades, getTodayProfit, getTopProduct } = useStore();

  const totalPnL = useMemo(() => dailyPnL.reduce((s, d) => s + d.profit, 0), [dailyPnL]);
  const todayTrades = getTodayTrades();
  const todayProfit = getTodayProfit();
  const topProduct = getTopProduct();
  const recentTrades = trades.slice(0, 5);
  const activeInventory = products.filter((p) => p.quantity > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <button
          onClick={() => openTradeModal()}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-accent-blue/20"
        >
          <Plus size={16} />
          Quick Trade
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total P&L"
          value={fmtCurrency(totalPnL, true)}
          sub={`Today: ${fmtCurrency(todayProfit, true)}`}
          icon={<DollarSign size={20} />}
          accent={totalPnL >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Active Inventory"
          value={`${activeInventory} products`}
          sub={`${products.reduce((s, p) => s + p.quantity, 0).toLocaleString()} total units`}
          icon={<Package size={20} />}
          accent="blue"
        />
        <StatCard
          label="Trades Today"
          value={String(todayTrades.length)}
          sub={`${todayTrades.filter((t) => t.type === "buy").length} buys · ${todayTrades.filter((t) => t.type === "sell").length} sells`}
          icon={<Activity size={20} />}
          accent="cyan"
        />
        <StatCard
          label="Top Product"
          value={topProduct}
          sub="By trade volume"
          icon={<Award size={20} />}
          accent="amber"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* P&L Chart */}
        <div className="xl:col-span-2 bg-bg-700 border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-white">Daily P&L</h2>
              <p className="text-xs text-gray-500 mt-0.5">Last 30 days</p>
            </div>
            <div className={`text-sm font-mono font-semibold px-2.5 py-1 rounded-lg ${pnlBg(totalPnL)}`}>
              {totalPnL >= 0 ? "+" : ""}{fmtCurrency(totalPnL, true)}
            </div>
          </div>
          <PnLChart data={dailyPnL} />
        </div>

        {/* Recent trades */}
        <div className="bg-bg-700 border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Recent Trades</h2>
            <a href="/history" className="text-xs text-accent-blue hover:text-blue-400 transition-colors">View all →</a>
          </div>
          <div className="space-y-2">
            {recentTrades.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm">No trades yet.</p>
                <button onClick={() => openTradeModal()} className="mt-2 text-accent-blue text-sm hover:text-blue-400">Execute first trade →</button>
              </div>
            )}
            {recentTrades.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2.5 bg-bg-800 rounded-lg hover:bg-bg-600 transition-colors">
                <div className={`p-1.5 rounded-md ${t.type === "buy" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  {t.type === "buy"
                    ? <ArrowDownLeft size={14} className="text-emerald-400" />
                    : <ArrowUpRight size={14} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{t.productName}</p>
                  <p className="text-xs text-gray-600">{fmtDateTime(t.timestamp)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-gray-300">{fmtCurrency(t.totalValue, true)}</p>
                  {t.type === "sell" && (
                    <p className={`text-xs font-mono ${pnlColor(t.profit)}`}>{t.profit >= 0 ? "+" : ""}{fmtCurrency(t.profit, true)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product overview */}
      <div className="bg-bg-700 border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Inventory Overview</h2>
          <a href="/products" className="text-xs text-accent-blue hover:text-blue-400 transition-colors">Manage →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Category", "Qty", "Avg Cost", "Market Value", ""].map((h) => (
                  <th key={h} className="text-left text-xs text-gray-500 pb-2 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-bg-600/30 transition-colors group">
                  <td className="py-2.5 pr-4">
                    <a href={`/products/${p.id}`} className="font-medium text-gray-200 hover:text-accent-blue transition-colors">{p.name}</a>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">{p.category}</td>
                  <td className="py-2.5 pr-4 font-mono text-gray-300">{p.quantity.toLocaleString()} <span className="text-gray-600 text-xs">{p.unit}</span></td>
                  <td className="py-2.5 pr-4 font-mono text-cyan-400">{fmtCurrency(p.avgCostPrice)}</td>
                  <td className="py-2.5 pr-4 font-mono text-gray-300">{fmtCurrency(p.sellPrice * p.quantity, true)}</td>
                  <td className="py-2.5">
                    <button
                      onClick={() => openTradeModal(p.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-accent-blue border border-accent-blue/20 bg-accent-blue/10 hover:bg-accent-blue hover:text-white px-2 py-1 rounded transition-all"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
