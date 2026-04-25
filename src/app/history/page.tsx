// src/app/history/page.tsx
"use client";
import { useState, useMemo } from "react";
import { Search, Download, Filter } from "lucide-react";
import { useStore } from "@/store";
import { fmtCurrency, fmtDateTime, pnlColor, pnlBg } from "@/lib/format";
import PnLChart from "@/components/PnLChart";

export default function HistoryPage() {
  const { trades, products, counterparties, dailyPnL } = useStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "sell">("all");
  const [productFilter, setProductFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "value" | "profit">("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return trades
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) return false;
        if (productFilter !== "all" && t.productId !== productFilter) return false;
        if (search && !t.productName.toLowerCase().includes(search.toLowerCase()) && !t.counterpartyName.toLowerCase().includes(search.toLowerCase())) return false;
        if (dateFrom && t.timestamp < dateFrom) return false;
        if (dateTo && t.timestamp > dateTo + "T23:59:59") return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date") return b.timestamp.localeCompare(a.timestamp);
        if (sortBy === "value") return b.totalValue - a.totalValue;
        return b.profit - a.profit;
      });
  }, [trades, typeFilter, productFilter, search, sortBy, dateFrom, dateTo]);

  const totalProfit = filtered.filter((t) => t.type === "sell").reduce((s, t) => s + t.profit, 0);
  const totalVolume = filtered.reduce((s, t) => s + t.totalValue, 0);

  const exportCSV = () => {
    const header = ["Date", "Product", "Type", "Quantity", "Price", "Total", "Counterparty", "Profit", "Fee", "Notes"].join(",");
    const rows = filtered.map((t) =>
      [fmtDateTime(t.timestamp), t.productName, t.type, t.quantity, t.price, t.totalValue, t.counterpartyName, t.profit, t.fee, t.notes].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradeflow-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Trade History</h1>
          <p className="text-sm text-gray-500 mt-0.5">{trades.length} total trades executed</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-bg-700 border border-border hover:border-border-light text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shown Trades</p>
          <p className="text-2xl font-display font-bold text-white">{filtered.length}</p>
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Volume</p>
          <p className="text-2xl font-display font-bold text-white">{fmtCurrency(totalVolume, true)}</p>
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Realized P&L</p>
          <p className={`text-2xl font-display font-bold ${pnlColor(totalProfit)}`}>{totalProfit >= 0 ? "+" : ""}{fmtCurrency(totalProfit, true)}</p>
        </div>
      </div>

      {/* P&L chart */}
      <div className="bg-bg-700 border border-border rounded-xl p-5">
        <h2 className="font-display font-semibold text-white mb-4">P&L Timeline</h2>
        <PnLChart data={dailyPnL} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-bg-700 border border-border rounded-xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-bg-800 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent-blue/50 w-44"
          />
        </div>

        <div className="flex gap-1 bg-bg-800 border border-border rounded-lg p-1">
          {(["all", "buy", "sell"] as const).map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${typeFilter === f ? "bg-accent-blue text-white" : "text-gray-500 hover:text-gray-300"}`}>
              {f}
            </button>
          ))}
        </div>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="bg-bg-800 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
        >
          <option value="all">All Products</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-bg-800 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
        >
          <option value="date">Sort: Date</option>
          <option value="value">Sort: Value</option>
          <option value="profit">Sort: Profit</option>
        </select>

        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="bg-bg-800 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none" />
          <span className="text-gray-600 text-xs">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="bg-bg-800 border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-700 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              {["Date & Time", "Product", "Type", "Qty", "Price", "Total", "Counterparty", "P&L", "Fee"].map((h) => (
                <th key={h} className="text-left text-xs text-gray-500 px-4 py-3 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-600">
                  {trades.length === 0 ? "No trades yet. Execute your first trade!" : "No trades match your filters."}
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-bg-600/30 transition-colors">
                <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">{fmtDateTime(t.timestamp)}</td>
                <td className="px-4 py-2.5 text-gray-200 font-medium">
                  <a href={`/products/${t.productId}`} className="hover:text-accent-blue transition-colors">{t.productName}</a>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${t.type === "buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-300">{t.quantity.toLocaleString()}</td>
                <td className="px-4 py-2.5 font-mono text-gray-400">{fmtCurrency(t.price)}</td>
                <td className="px-4 py-2.5 font-mono text-gray-300">{fmtCurrency(t.totalValue, true)}</td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">
                  <a href={`/counterparties/${t.counterpartyId}`} className="hover:text-accent-blue transition-colors">{t.counterpartyName}</a>
                </td>
                <td className="px-4 py-2.5">
                  {t.type === "sell" ? (
                    <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${pnlBg(t.profit)}`}>
                      {t.profit >= 0 ? "+" : ""}{fmtCurrency(t.profit, true)}
                    </span>
                  ) : <span className="text-gray-700 text-xs">—</span>}
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-600 text-xs">{fmtCurrency(t.fee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
