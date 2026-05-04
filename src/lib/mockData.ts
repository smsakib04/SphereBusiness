// src/lib/mockData.ts
import { v4 as uuidv4 } from "uuid";
import type { Product, Counterparty, DailyPnL, PricePoint } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  { id: uuidv4(), name: "Steel Coil", category: "Metals", buyPrice: 842.5, sellPrice: 891.0, quantity: 320, avgCostPrice: 842.5, unit: "MT", description: "Hot-rolled steel coil, Grade SS400" },
  { id: uuidv4(), name: "Arabica Coffee", category: "Soft Commodities", buyPrice: 2.18, sellPrice: 2.41, quantity: 15000, avgCostPrice: 2.18, unit: "lbs", description: "Grade 1 Arabica, washed process" },
  { id: uuidv4(), name: "Lithium Battery Pack", category: "Electronics", buyPrice: 148.0, sellPrice: 174.5, quantity: 840, avgCostPrice: 148.0, unit: "units", description: "LFP 100Ah 48V prismatic cells" },
  { id: uuidv4(), name: "Cotton Fabric", category: "Textiles", buyPrice: 3.85, sellPrice: 4.32, quantity: 28000, avgCostPrice: 3.85, unit: "yds", description: "100% cotton, 200 GSM, bleached white" },
  { id: uuidv4(), name: "Wheat Grain", category: "Grains", buyPrice: 6.12, sellPrice: 6.54, quantity: 50000, avgCostPrice: 6.12, unit: "bushels", description: "Hard red winter wheat, Grade 2" },
  { id: uuidv4(), name: "Copper Wire", category: "Metals", buyPrice: 4.28, sellPrice: 4.71, quantity: 5200, avgCostPrice: 4.28, unit: "kg", description: "EC grade copper rod, 8mm" },
  { id: uuidv4(), name: "Palm Oil", category: "Soft Commodities", buyPrice: 0.52, sellPrice: 0.58, quantity: 120000, avgCostPrice: 0.52, unit: "liters", description: "RBD Palm Oil, FFA max 0.1%" },
  { id: uuidv4(), name: "Aluminum Ingot", category: "Metals", buyPrice: 2.31, sellPrice: 2.56, quantity: 9800, avgCostPrice: 2.31, unit: "kg", description: "P1020A aluminum ingot, 99.7% purity" },
];

export const INITIAL_COUNTERPARTIES: Counterparty[] = [
  { id: uuidv4(), name: "Global Metals Ltd", type: "supplier", contact: "+44 20 7946 0958", email: "trading@globalmetals.co.uk", location: "London, UK", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Sunrise Textiles Co", type: "supplier", contact: "+86 21 6385 2200", email: "exports@sunrisetex.cn", location: "Shanghai, CN", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "TechParts Inc", type: "supplier", contact: "+1 408 555 0182", email: "supply@techparts.us", location: "San Jose, US", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Harvest Grains AG", type: "supplier", contact: "+49 30 2021 5500", email: "trade@harvestgrains.de", location: "Hamburg, DE", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Meridian Energy Corp", type: "customer", contact: "+1 713 555 0340", email: "procurement@meridianen.com", location: "Houston, US", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Pacific Rim Traders", type: "customer", contact: "+65 6221 9900", email: "ops@pacificrimtrade.sg", location: "Singapore, SG", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Atlas Manufacturing", type: "customer", contact: "+91 22 4040 6600", email: "sourcing@atlasmfg.in", location: "Mumbai, IN", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
  { id: uuidv4(), name: "Nordic Import House", type: "customer", contact: "+46 8 5500 2200", email: "buying@nordicimport.se", location: "Stockholm, SE", totalTrades: 0, totalBuyAmount: 0, totalSellAmount: 0, createdAt: new Date().toISOString() },
];

export function generateDailyPnL(): DailyPnL[] {
  const data: DailyPnL[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const profit = i === 0 ? 0 : (Math.random() - 0.3) * 8000 + 2000;
    data.push({ date: dateStr, profit: Math.round(profit), trades: Math.floor(Math.random() * 8) + 1 });
  }
  return data;
}

export function generatePriceHistory(buyPrice: number, sellPrice: number): PricePoint[] {
  const data: PricePoint[] = [];
  const now = new Date();
  let b = buyPrice * 0.92;
  let s = sellPrice * 0.92;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    b = b * (1 + (Math.random() - 0.48) * 0.03);
    s = s * (1 + (Math.random() - 0.48) * 0.03);
    data.push({ date: d.toISOString().split("T")[0], buy: Math.round(b * 100) / 100, sell: Math.round(s * 100) / 100 });
  }
  return data;
}
