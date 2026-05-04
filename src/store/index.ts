// src/store/index.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Product, Counterparty, Trade, DailyPnL, Toast } from "@/types";
import {
  INITIAL_PRODUCTS,
  INITIAL_COUNTERPARTIES,
  generateDailyPnL,
} from "@/lib/mockData";

interface TradeFlowState {
  // Core data
  products: Product[];
  counterparties: Counterparty[];
  trades: Trade[];
  cashBalance: number;
  dailyPnL: DailyPnL[];
  initialized: boolean;

  // UI state
  toasts: Toast[];
  tradeModalOpen: boolean;
  tradeModalProductId: string | null;
  sidebarOpen: boolean;

  // Actions
  initializeStore: () => void;
  updateProductPrices: () => void;
  executeTrade: (params: {
    productId: string;
    type: "buy" | "sell";
    quantity: number;
    price: number;
    counterpartyId: string;
    notes: string;
  }) => { success: boolean; message: string };
  addCounterparty: (cp: Omit<Counterparty, "id" | "totalTrades" | "totalBuyAmount" | "totalSellAmount" | "createdAt">) => void;
  addToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;
  openTradeModal: (productId?: string) => void;
  closeTradeModal: () => void;
  toggleSidebar: () => void;
  getTodayTrades: () => Trade[];
  getTodayProfit: () => number;
  getTopProduct: () => string;
}

export const useStore = create<TradeFlowState>()(
  persist(
    (set, get) => ({
      products: [],
      counterparties: [],
      trades: [],
      cashBalance: 500000,
      dailyPnL: [],
      initialized: false,
      toasts: [],
      tradeModalOpen: false,
      tradeModalProductId: null,
      sidebarOpen: true,

      initializeStore: () => {
        const { initialized } = get();
        if (!initialized) {
          set({
            products: INITIAL_PRODUCTS,
            counterparties: INITIAL_COUNTERPARTIES,
            dailyPnL: generateDailyPnL(),
            initialized: true,
          });
        }
      },

      updateProductPrices: () => {
        set((state) => ({
          products: state.products.map((p) => {
            const delta = (Math.random() - 0.5) * 0.006;
            const buyPrice = Math.max(0.01, p.buyPrice * (1 + delta));
            const sellPrice = Math.max(buyPrice * 1.02, p.sellPrice * (1 + delta));
            return {
              ...p,
              buyPrice: Math.round(buyPrice * 10000) / 10000,
              sellPrice: Math.round(sellPrice * 10000) / 10000,
            };
          }),
        }));
      },

      executeTrade: ({ productId, type, quantity, price, counterpartyId, notes }) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);
        const counterparty = state.counterparties.find((c) => c.id === counterpartyId);
        if (!product || !counterparty) return { success: false, message: "Product or counterparty not found" };

        const totalValue = quantity * price;
        const fee = Math.round(totalValue * 0.001 * 100) / 100;

        if (type === "buy") {
          if (state.cashBalance < totalValue + fee) {
            return { success: false, message: `Insufficient funds. Need $${(totalValue + fee).toLocaleString()}` };
          }
        } else {
          if (product.quantity < quantity) {
            return { success: false, message: `Insufficient inventory. Have ${product.quantity} ${product.unit}` };
          }
        }

        const profit = type === "sell" ? Math.round(((price - product.avgCostPrice) * quantity - fee) * 100) / 100 : -fee;

        const trade: Trade = {
          id: uuidv4(),
          productId,
          productName: product.name,
          type,
          quantity,
          price,
          totalValue,
          counterpartyId,
          counterpartyName: counterparty.name,
          profit,
          fee,
          notes,
          timestamp: new Date().toISOString(),
        };

        const today = new Date().toISOString().split("T")[0];

        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id !== productId) return p;
            if (type === "buy") {
              const newQty = p.quantity + quantity;
              const newAvgCost = (p.avgCostPrice * p.quantity + price * quantity) / newQty;
              return { ...p, quantity: newQty, avgCostPrice: Math.round(newAvgCost * 10000) / 10000 };
            } else {
              return { ...p, quantity: p.quantity - quantity };
            }
          });

          const updatedCounterparties = state.counterparties.map((c) => {
            if (c.id !== counterpartyId) return c;
            return {
              ...c,
              totalTrades: c.totalTrades + 1,
              totalBuyAmount: type === "buy" ? c.totalBuyAmount + totalValue : c.totalBuyAmount,
              totalSellAmount: type === "sell" ? c.totalSellAmount + totalValue : c.totalSellAmount,
            };
          });

          const updatedDailyPnL = state.dailyPnL.map((d) => {
            if (d.date !== today) return d;
            return { ...d, profit: d.profit + profit, trades: d.trades + 1 };
          });

          // If today not in list yet
          const hasToday = state.dailyPnL.some((d) => d.date === today);
          if (!hasToday) {
            updatedDailyPnL.push({ date: today, profit, trades: 1 });
          }

          return {
            products: updatedProducts,
            counterparties: updatedCounterparties,
            trades: [trade, ...state.trades],
            cashBalance: type === "buy" ? state.cashBalance - totalValue - fee : state.cashBalance + totalValue - fee,
            dailyPnL: updatedDailyPnL,
          };
        });

        return { success: true, message: `${type === "buy" ? "Purchase" : "Sale"} executed successfully` };
      },

      addCounterparty: (cp) => {
        const newCp: Counterparty = {
          ...cp,
          id: uuidv4(),
          totalTrades: 0,
          totalBuyAmount: 0,
          totalSellAmount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ counterparties: [...state.counterparties, newCp] }));
      },

      addToast: (message, type) => {
        const id = uuidv4();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },

      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      openTradeModal: (productId) => set({ tradeModalOpen: true, tradeModalProductId: productId || null }),
      closeTradeModal: () => set({ tradeModalOpen: false, tradeModalProductId: null }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      getTodayTrades: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().trades.filter((t) => t.timestamp.startsWith(today));
      },

      getTodayProfit: () => {
        return get().getTodayTrades().reduce((sum, t) => sum + t.profit, 0);
      },

      getTopProduct: () => {
        const { trades } = get();
        const sellTrades = trades.filter((t) => t.type === "sell");
        if (!sellTrades.length) return "N/A";
        const byProduct: Record<string, number> = {};
        sellTrades.forEach((t) => {
          byProduct[t.productName] = (byProduct[t.productName] || 0) + t.totalValue;
        });
        return Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
      },
    }),
    {
      name: "tradeflow-storage",
      partialize: (state) => ({
        products: state.products,
        counterparties: state.counterparties,
        trades: state.trades,
        cashBalance: state.cashBalance,
        dailyPnL: state.dailyPnL,
        initialized: state.initialized,
      }),
    }
  )
);
