// src/app/products/[productId]/page.tsx
"use client";
import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Zap, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store";
import PriceChart from "@/components/PriceChart";
import PnLChart from "@/components/PnLChart";
import { fmtCurrency, fmtNumber, fmtDateTime, pnlColor, pnlBg } from "@/lib/format";
import { generatePriceHistory } from "@/lib/mockData";
import type { DailyPnL } from "@/types";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { products, trades, openTradeModal } = useStore();

  const product = products.find((p) => p.id === productId);
  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found.</p>
      <Link href="/products" className="text-accent-blue mt-2 inline-block">← Back to Products</Link>
    </div>
  );

  const priceHistory = useMemo(() => generatePriceHistory(product.buyPrice, product.sellPrice), [product.id]);

  const productTrades = trades.filter((t) => t.productId === productId);
  const totalBought = productTrades.filter((t) => t.type === "buy").reduce((s, t) => s + t.quantity, 0);
  const totalSold = productTrades.filter((t) => t.type === "sell").reduce((s, t) => s + t.quantity, 0);
  const totalProfit = productTrades.filter((t) => t.type === "sell").reduce((s, t) => s + t.profit, 0);

  const dailyProductPnL: DailyPnL[] = useMemo(() => {
    const map: Record<string, number> = {};
    productTrades.filter((t) => t.type === "sell").forEach((t) => {
      const d = t.timestamp.split("T")[0];
      map[d] = (map[d] || 0) + t.profit;
    });
    return Object.entries(map).map(([date, profit]) => ({ date, profit, trades: 1 })).sort((a, b) => a.date.localeCompare(b.date));
  }, [productTrades]);

  const margin = ((product.sellPrice - product.buyPrice) / product.buyPrice) * 100;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/products" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors">
          <ArrowLeft size={14} />
          Products
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300 text-sm">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{product.category} · {product.description}</p>
        </div>
        <button
          onClick={() => openTradeModal(product.id)}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-accent-blue/20"
        >
          <Zap size={16} />
          Quick Trade
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Buy Price</p>
          <p className="text-xl font-mono font-bold text-cyan-400">{fmtCurrency(product.buyPrice)}</p>
          <p className="text-xs text-gray-600 mt-0.5">/{product.unit}</p>
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sell Price</p>
          <p className="text-xl font-mono font-bold text-purple-400">{fmtCurrency(product.sellPrice)}</p>
          <p className="text-xs text-gray-600 mt-0.5">/{product.unit}</p>
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Margin</p>
          <p className={`text-xl font-mono font-bold ${margin > 0 ? "text-emerald-400" : "text-red-400"}`}>{margin.toFixed(2)}%</p>
          <p className="text-xs text-gray-600 mt-0.5">Spread</p>
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Inventory</p>
          <p className="text-xl font-mono font-bold text-white">{fmtNumber(product.quantity)}</p>
          <p className="text-xs text-gray-600 mt-0.5">{product.unit} on hand</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-bg-700 border border-border rounded-xl p-5">
          <h2 className="font-display font-semibold text-white mb-1">30-Day Price Trend</h2>
          <p className="text-xs text-gray-500 mb-4">Historical buy/sell price movement</p>
          <PriceChart data={priceHistory} />
        </div>
        <div className="bg-bg-700 border border-border rounded-xl p-5">
          <h2 className="font-display font-semibold text-white mb-1">Product P&L</h2>
          <p className="text-xs text-gray-500 mb-4">Realized profit from sales</p>
          {dailyProductPnL.length > 0 ? (
            <PnLChart data={dailyProductPnL} />
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No trades yet for this product.</div>
          )}
        </div>
      </div>

      {/* Trade history for product */}
      <div className="bg-bg-700 border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Trade History</h2>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Bought: <span className="text-emerald-400 font-mono">{fmtNumber(totalBought)} {product.unit}</span></span>
            <span>Sold: <span className="text-red-400 font-mono">{fmtNumber(totalSold)} {product.unit}</span></span>
            <span>Profit: <span className={`font-mono ${pnlColor(totalProfit)}`}>{fmtCurrency(totalProfit, true)}</span></span>
          </div>
        </div>
        {productTrades.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm">No trades for this product yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Type", "Quantity", "Price", "Total", "Counterparty", "Profit"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 pb-2 pr-4 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productTrades.map((t) => (
                  <tr key={t.id} className="hover:bg-bg-600/30 transition-colors">
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">{fmtDateTime(t.timestamp)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${t.type === "buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-gray-300">{fmtNumber(t.quantity)}</td>
                    <td className="py-2.5 pr-4 font-mono text-gray-300">{fmtCurrency(t.price)}</td>
                    <td className="py-2.5 pr-4 font-mono text-gray-300">{fmtCurrency(t.totalValue, true)}</td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">{t.counterpartyName}</td>
                    <td className="py-2.5 pr-4">
                      {t.type === "sell" ? (
                        <span className={`font-mono text-xs font-semibold ${pnlColor(t.profit)}`}>
                          {t.profit >= 0 ? "+" : ""}{fmtCurrency(t.profit, true)}
                        </span>
                      ) : <span className="text-gray-700">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
