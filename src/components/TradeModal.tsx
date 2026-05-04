// src/components/TradeModal.tsx
"use client";
import { useState, useEffect } from "react";
import { X, ArrowDownCircle, ArrowUpCircle, AlertCircle, Plus } from "lucide-react";
import { useStore } from "@/store";
import { fmtCurrency, fmtNumber } from "@/lib/format";

export default function TradeModal() {
  const { tradeModalOpen, tradeModalProductId, closeTradeModal, products, counterparties, cashBalance, executeTrade, addToast, addCounterparty } = useStore();

  const [type, setType] = useState<"buy" | "sell">("buy");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [counterpartyId, setCounterpartyId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [showAddCp, setShowAddCp] = useState(false);
  const [newCpName, setNewCpName] = useState("");
  const [newCpType, setNewCpType] = useState<"supplier" | "customer">("supplier");
  const [productSearch, setProductSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);

  const selectedProduct = products.find((p) => p.id === productId);
  const totalValue = parseFloat(quantity || "0") * parseFloat(price || "0");
  const fee = Math.round(totalValue * 0.001 * 100) / 100;

  const filteredProducts = productSearch
    ? products.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
    : products;

  const relevantCounterparties = counterparties.filter((c) =>
    type === "buy" ? c.type === "supplier" : c.type === "customer"
  );

  useEffect(() => {
    if (tradeModalOpen) {
      setError("");
      setNotes("");
      setQuantity("");
      if (tradeModalProductId) {
        const p = products.find((p) => p.id === tradeModalProductId);
        setProductId(tradeModalProductId);
        setProductSearch(p?.name || "");
        setPrice(type === "buy" ? String(p?.buyPrice || "") : String(p?.sellPrice || ""));
      } else {
        setProductId("");
        setProductSearch("");
        setPrice("");
      }
      setCounterpartyId(relevantCounterparties[0]?.id || "");
    }
  }, [tradeModalOpen, tradeModalProductId]);

  useEffect(() => {
    if (selectedProduct) {
      setPrice(type === "buy" ? String(selectedProduct.buyPrice) : String(selectedProduct.sellPrice));
    }
    setCounterpartyId(relevantCounterparties[0]?.id || "");
  }, [type]);

  const handleProductSelect = (p: typeof products[0]) => {
    setProductId(p.id);
    setProductSearch(p.name);
    setPrice(type === "buy" ? String(p.buyPrice) : String(p.sellPrice));
    setShowProductList(false);
  };

  const handleAddCp = () => {
    if (!newCpName.trim()) return;
    addCounterparty({ name: newCpName, type: newCpType, contact: "", email: "", location: "" });
    setShowAddCp(false);
    setNewCpName("");
    // select newest
    setTimeout(() => {
      const cps = useStore.getState().counterparties;
      const newest = [...cps].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      if (newest) setCounterpartyId(newest.id);
    }, 50);
  };

  const handleSubmit = () => {
    setError("");
    if (!productId) return setError("Select a product");
    if (!quantity || parseFloat(quantity) <= 0) return setError("Enter a valid quantity");
    if (!price || parseFloat(price) <= 0) return setError("Enter a valid price");
    if (!counterpartyId) return setError("Select a counterparty");

    const result = executeTrade({
      productId,
      type,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      counterpartyId,
      notes,
    });

    if (result.success) {
      addToast(result.message, "success");
      closeTradeModal();
    } else {
      setError(result.message);
    }
  };

  if (!tradeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTradeModal} />
      <div className="relative bg-bg-800 border border-border rounded-xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-display font-bold text-white">Execute Trade</h2>
          <button onClick={closeTradeModal} className="p-1.5 rounded-lg hover:bg-bg-600 text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Buy / Sell toggle */}
          <div className="grid grid-cols-2 gap-2 bg-bg-900 p-1 rounded-lg">
            {(["buy", "sell"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all
                  ${type === t
                    ? t === "buy" ? "bg-emerald-600 text-white shadow" : "bg-red-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {t === "buy" ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Product */}
          <div className="relative">
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Product</label>
            <input
              value={productSearch}
              onChange={(e) => { setProductSearch(e.target.value); setShowProductList(true); }}
              onFocus={() => setShowProductList(true)}
              onBlur={() => setTimeout(() => setShowProductList(false), 150)}
              placeholder="Search product..."
              className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
            />
            {showProductList && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-bg-700 border border-border rounded-lg z-10 max-h-40 overflow-y-auto shadow-xl">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleProductSelect(p)}
                    className="w-full flex justify-between items-center px-3 py-2 hover:bg-bg-600 text-sm text-left"
                  >
                    <span className="text-gray-200">{p.name}</span>
                    <span className="text-xs text-gray-500">{p.quantity} {p.unit}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Qty + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">
                Quantity {selectedProduct && <span className="text-gray-600">({selectedProduct.unit})</span>}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
              />
              {selectedProduct && type === "sell" && (
                <p className="text-xs text-gray-600 mt-1">Avail: {fmtNumber(selectedProduct.quantity)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Price / Unit ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
              />
            </div>
          </div>

          {/* Counterparty */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500 uppercase tracking-wider">
                {type === "buy" ? "Supplier" : "Customer"}
              </label>
              <button onClick={() => setShowAddCp(!showAddCp)} className="text-xs text-accent-blue hover:text-blue-400 flex items-center gap-1">
                <Plus size={12} /> New
              </button>
            </div>
            {showAddCp ? (
              <div className="flex gap-2">
                <select
                  value={newCpType}
                  onChange={(e) => setNewCpType(e.target.value as "supplier" | "customer")}
                  className="bg-bg-700 border border-border rounded-lg px-2 py-2 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                </select>
                <input
                  value={newCpName}
                  onChange={(e) => setNewCpName(e.target.value)}
                  placeholder="Counterparty name..."
                  className="flex-1 bg-bg-700 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
                />
                <button onClick={handleAddCp} className="px-3 py-2 bg-accent-blue text-white rounded-lg text-sm hover:bg-blue-500">Add</button>
              </div>
            ) : (
              <select
                value={counterpartyId}
                onChange={(e) => setCounterpartyId(e.target.value)}
                className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
              >
                {relevantCounterparties.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Notes (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add trade notes..."
              className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
            />
          </div>

          {/* Summary */}
          {totalValue > 0 && (
            <div className="bg-bg-700 rounded-lg p-3 space-y-1.5 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Value</span>
                <span className="text-gray-200 font-mono">{fmtCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Fee (0.1%)</span>
                <span className="text-gray-400 font-mono">-{fmtCurrency(fee)}</span>
              </div>
              {type === "buy" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cash After</span>
                  <span className={`font-mono ${cashBalance - totalValue - fee < 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {fmtCurrency(cashBalance - totalValue - fee)}
                  </span>
                </div>
              )}
              {type === "sell" && selectedProduct && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. Profit</span>
                  <span className={`font-mono font-semibold ${(parseFloat(price) - selectedProduct.avgCostPrice) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {fmtCurrency((parseFloat(price) - selectedProduct.avgCostPrice) * parseFloat(quantity || "0") - fee)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 rounded-lg px-3 py-2 text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 pt-0 flex gap-3">
          <button onClick={closeTradeModal} className="flex-1 py-2.5 border border-border rounded-lg text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-2 flex-1 py-2.5 rounded-lg text-white text-sm font-bold transition-all active:scale-95 shadow-lg
              ${type === "buy" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50" : "bg-red-600 hover:bg-red-500 shadow-red-900/50"}`}
          >
            {type === "buy" ? "Execute Purchase" : "Execute Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
