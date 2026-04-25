// src/components/Toasts.tsx
"use client";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useStore } from "@/store";

export default function Toasts() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-slide-up max-w-xs
            ${t.type === "success" ? "bg-emerald-900/90 border-emerald-700/50 text-emerald-200" : ""}
            ${t.type === "error" ? "bg-red-900/90 border-red-700/50 text-red-200" : ""}
            ${t.type === "info" ? "bg-bg-700 border-border text-gray-200" : ""}
          `}
        >
          {t.type === "success" && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
          {t.type === "error" && <XCircle size={16} className="text-red-400 shrink-0" />}
          {t.type === "info" && <Info size={16} className="text-accent-blue shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
