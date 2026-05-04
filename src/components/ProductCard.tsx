// src/components/ProductCard.tsx
"use client";
import { useRef } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useStore } from "@/store";
import { fmtCurrency, fmtNumber } from "@/lib/format";
import type { Product } from "@/types";

interface Props {
  product: Product;
  prevPrice?: number;
}

export default function ProductCard({ product, prevPrice }: Props) {
  const { openTradeModal } = useStore();
  const priceChange = prevPrice ? ((product.sellPrice - prevPrice) / prevPrice) * 100 : 0;
  const up = priceChange >= 0;

  return (
    <div className="bg-bg-700 border border-border rounded-xl p-4 hover:border-border-light transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link href={`/products/${product.id}`} className="font-display font-semibold text-white hover:text-accent-blue transition-colors text-sm">
            {product.name}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-bg-800 rounded-lg p-2">
          <p className="text-xs text-gray-600 mb-0.5">Buy</p>
          <p className="text-sm font-mono font-semibold text-cyan-400">{fmtCurrency(product.buyPrice)}</p>
        </div>
        <div className="bg-bg-800 rounded-lg p-2">
          <p className="text-xs text-gray-600 mb-0.5">Sell</p>
          <p className="text-sm font-mono font-semibold text-purple-400">{fmtCurrency(product.sellPrice)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Inventory</p>
          <p className="text-sm font-mono text-gray-300">{fmtNumber(product.quantity)} <span className="text-xs text-gray-600">{product.unit}</span></p>
        </div>
        <button
          onClick={() => openTradeModal(product.id)}
          className="flex items-center gap-1.5 bg-accent-blue/10 border border-accent-blue/20 hover:bg-accent-blue hover:border-accent-blue text-accent-blue hover:text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
        >
          <Zap size={12} />
          Trade
        </button>
      </div>
    </div>
  );
}
