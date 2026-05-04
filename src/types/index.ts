// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  avgCostPrice: number;
  unit: string;
  description: string;
}

export interface Counterparty {
  id: string;
  name: string;
  type: "supplier" | "customer";
  contact: string;
  email: string;
  location: string;
  totalTrades: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  createdAt: string;
}

export type TradeType = "buy" | "sell";

export interface Trade {
  id: string;
  productId: string;
  productName: string;
  type: TradeType;
  quantity: number;
  price: number;
  totalValue: number;
  counterpartyId: string;
  counterpartyName: string;
  profit: number;
  fee: number;
  notes: string;
  timestamp: string;
}

export interface DailyPnL {
  date: string;
  profit: number;
  trades: number;
}

export interface PricePoint {
  date: string;
  buy: number;
  sell: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
