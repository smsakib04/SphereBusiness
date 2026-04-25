// src/hooks/usePriceFluctuation.ts
"use client";
import { useEffect } from "react";
import { useStore } from "@/store";

export function usePriceFluctuation(intervalMs = 3000) {
  const updateProductPrices = useStore((s) => s.updateProductPrices);
  useEffect(() => {
    const id = setInterval(updateProductPrices, intervalMs);
    return () => clearInterval(id);
  }, [updateProductPrices, intervalMs]);
}
