// src/app/counterparties/page.tsx
"use client";
import { useState } from "react";
import { Search, Plus, Building2, Users, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store";
import { fmtCurrency } from "@/lib/format";

export default function CounterpartiesPage() {
  const { counterparties, addCounterparty } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "supplier" | "customer">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", type: "supplier" as "supplier" | "customer", contact: "", email: "", location: "" });

  const filtered = counterparties.filter((c) =>
    (filter === "all" || c.type === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addCounterparty(form);
    setShowAdd(false);
    setForm({ name: "", type: "supplier", contact: "", email: "", location: "" });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Counterparties</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {counterparties.filter((c) => c.type === "supplier").length} suppliers · {counterparties.filter((c) => c.type === "customer").length} customers
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowAdd(false)} />
          <div className="relative bg-bg-800 border border-border rounded-xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-white text-lg">New Counterparty</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-bg-900 p-1 rounded-lg">
                {(["supplier", "customer"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`py-2 rounded-md text-sm font-semibold transition-all capitalize ${form.type === t ? "bg-accent-blue text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {[
                { label: "Name", key: "name", placeholder: "Company or person name" },
                { label: "Contact", key: "contact", placeholder: "+1 555 000 0000" },
                { label: "Email", key: "email", placeholder: "contact@company.com" },
                { label: "Location", key: "location", placeholder: "City, Country" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-bg-700 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent-blue/50"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-border rounded-lg text-gray-400 hover:text-white text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 bg-accent-blue hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all">Add Counterparty</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search counterparties..."
            className="bg-bg-700 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent-blue/50"
          />
        </div>
        <div className="flex gap-1 bg-bg-700 border border-border rounded-lg p-1">
          {(["all", "supplier", "customer"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${filter === f ? "bg-accent-blue text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cp) => (
          <Link
            key={cp.id}
            href={`/counterparties/${cp.id}`}
            className="bg-bg-700 border border-border rounded-xl p-5 hover:border-border-light transition-all group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2.5 rounded-lg ${cp.type === "supplier" ? "bg-cyan-500/10" : "bg-purple-500/10"}`}>
                {cp.type === "supplier"
                  ? <Building2 size={18} className="text-cyan-400" />
                  : <Users size={18} className="text-purple-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-white text-sm group-hover:text-accent-blue transition-colors truncate">{cp.name}</h3>
                <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${cp.type === "supplier" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"}`}>
                  {cp.type}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Trades</p>
                <p className="text-gray-300 font-mono mt-0.5">{cp.totalTrades}</p>
              </div>
              <div>
                <p className="text-gray-600">{cp.type === "supplier" ? "Payable" : "Receivable"}</p>
                <p className="text-gray-300 font-mono mt-0.5">{fmtCurrency(cp.type === "supplier" ? cp.totalBuyAmount : cp.totalSellAmount, true)}</p>
              </div>
              {cp.location && (
                <div className="col-span-2">
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-400 mt-0.5">{cp.location}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">No counterparties found.</div>
      )}
    </div>
  );
}
