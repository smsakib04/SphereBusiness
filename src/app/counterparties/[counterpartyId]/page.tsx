// src/app/counterparties/[counterpartyId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "@/store";
import { fmtCurrency, fmtDateTime, pnlColor } from "@/lib/format";

export default function CounterpartyDetailPage() {
  const { counterpartyId } = useParams();
  const { counterparties, trades, openTradeModal } = useStore();

  const cp = counterparties.find((c) => c.id === counterpartyId);
  if (!cp) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Counterparty not found.</p>
      <Link href="/counterparties" className="text-accent-blue mt-2 inline-block">← Back</Link>
    </div>
  );

  const cpTrades = trades.filter((t) => t.counterpartyId === counterpartyId);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/counterparties" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors">
          <ArrowLeft size={14} />
          Counterparties
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300 text-sm">{cp.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-bg-700 border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${cp.type === "supplier" ? "bg-cyan-500/10" : "bg-purple-500/10"}`}>
              {cp.type === "supplier"
                ? <Building2 size={24} className="text-cyan-400" />
                : <Users size={24} className="text-purple-400" />}
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg">{cp.name}</h1>
              <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${cp.type === "supplier" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"}`}>
                {cp.type}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {cp.contact && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-gray-600" />
                {cp.contact}
              </div>
            )}
            {cp.email && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-gray-600" />
                {cp.email}
              </div>
            )}
            {cp.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-gray-600" />
                {cp.location}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-gray-600">Total Trades</p>
              <p className="text-lg font-mono font-bold text-white mt-0.5">{cp.totalTrades}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{cp.type === "supplier" ? "Total Paid" : "Total Received"}</p>
              <p className="text-lg font-mono font-bold text-cyan-400 mt-0.5">{fmtCurrency(cp.type === "supplier" ? cp.totalBuyAmount : cp.totalSellAmount, true)}</p>
            </div>
          </div>
        </div>

        {/* Trades list */}
        <div className="lg:col-span-2 bg-bg-700 border border-border rounded-xl p-5">
          <h2 className="font-display font-semibold text-white mb-4">Trade History</h2>
          {cpTrades.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">No trades with this counterparty yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Product", "Type", "Qty", "Price", "Total", "P&L"].map((h) => (
                      <th key={h} className="text-left text-xs text-gray-500 pb-2 pr-4 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cpTrades.map((t) => (
                    <tr key={t.id} className="hover:bg-bg-600/30 transition-colors">
                      <td className="py-2.5 pr-4 text-xs text-gray-500">{fmtDateTime(t.timestamp)}</td>
                      <td className="py-2.5 pr-4 text-gray-300">{t.productName}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${t.type === "buy" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono text-gray-300">{t.quantity}</td>
                      <td className="py-2.5 pr-4 font-mono text-gray-400">{fmtCurrency(t.price)}</td>
                      <td className="py-2.5 pr-4 font-mono text-gray-300">{fmtCurrency(t.totalValue, true)}</td>
                      <td className="py-2.5 pr-4">
                        {t.type === "sell" ? (
                          <span className={`font-mono text-xs ${pnlColor(t.profit)}`}>{t.profit >= 0 ? "+" : ""}{fmtCurrency(t.profit, true)}</span>
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
    </div>
  );
}
