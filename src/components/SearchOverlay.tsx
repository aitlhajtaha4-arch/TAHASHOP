"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/data/products";

const brandAliases: Record<string, string[]> = {
  Apple: ["ايبون", "ايفون", "آيفون", "ابل", "أبل", "iphone"],
  Samsung: ["سامسونج", "سامسونك", "غالاكسي", "galaxy"],
  Xiaomi: ["شاومي", "شياومي", "xiaomi"],
  Redmi: ["ريدمي", "ريديمي", "redmi"],
  POCO: ["بوكو", "poco"],
  Huawei: ["هواوي", "huawei"],
  Honor: ["اونور", "ونور", "honor"],
  Oppo: ["اوبو", "oppo"],
  Realme: ["ريلمي", "realme"],
  Vivo: ["فيفو", "vivo"],
  OnePlus: ["ون بلس", "ون بلاس", "oneplus"],
  "Google Pixel": ["بيكسل", "جوجل", "pixel", "google"],
  Motorola: ["موتورولا", "موتور", "motorola", "moto"],
  Nokia: ["نوكيا", "nokia"],
  Infinix: ["انفينكس", "infinix"],
  Tecno: ["تكنو", "techno", "tecno"],
  Nothing: ["ناثينج", "nothing"],
};

function normalizeArabic(text: string): string {
  return text
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/إ/g, "ا")
    .replace(/أ/g, "ا")
    .replace(/آ/g, "ا")
    .toLowerCase();
}

function normalize(text: string): string {
  return `${text.toLowerCase().trim()} ${normalizeArabic(text.toLowerCase().trim())}`;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[m][n];
}

function fuzzyMatch(query: string, text: string): boolean {
  const nq = normalize(query);
  const nt = normalize(text);
  if (nt.includes(nq) || nq.includes(nt)) return true;
  const words = nq.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  return words.every((w) => {
    return nt.split(/\s+/).some((tw) => tw.includes(w) || w.includes(tw) || (w.length >= 3 && levenshtein(w, tw) <= 1));
  });
}

function matchesBrand(query: string, brand: string): boolean {
  const nq = normalize(query);
  const nb = normalize(brand);
  if (nb.includes(nq) || nq.includes(nb)) return true;
  return (brandAliases[brand] || []).some((alias) => {
    const na = normalize(alias);
    return na.includes(nq) || nq.includes(na);
  });
}

const popularSearches = ["iPhone", "Samsung", "Pixel", "Xiaomi", "512 GB", "16 GB RAM"];

export default function SearchOverlay({ open, onClose, products = [] }: { open: boolean; onClose: () => void; products?: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const uniqueBrands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);
  const uniqueRams = useMemo(() => [...new Set(products.map((p) => p.ram))], [products]);
  const uniqueStorage = useMemo(() => [...new Set(products.map((p) => p.storage))], [products]);
  const uniqueColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products]);

  const results = useMemo(() => {
    return products.filter((p) => {
      if (query) {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        if (matchesBrand(q, p.brand)) return true;
        if (fuzzyMatch(q, p.name)) return true;
        if (fuzzyMatch(q, p.processor)) return true;
        if (fuzzyMatch(q, p.ram)) return true;
        if (fuzzyMatch(q, p.storage)) return true;
        if (p.colors.some((c) => fuzzyMatch(q, c))) return true;
        if (fuzzyMatch(q, p.description)) return true;
        return false;
      }
      if (brand && p.brand !== brand) return false;
      if (ram && p.ram !== ram) return false;
      if (storage && p.storage !== storage) return false;
      if (color && !p.colors.includes(color)) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [query, brand, ram, storage, color, minPrice, maxPrice, products]);

  const handlePopularClick = useCallback((term: string) => setQuery(term), []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-0 right-0 left-0 z-[90] mx-auto max-w-2xl pt-4 sm:pt-8 px-4">
            <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border p-3 sm:p-4">
                <SearchIcon className="h-5 w-5 text-text-muted flex-shrink-0" />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالعربي أو الإنجليزي... مثلاً: سامسونج، غالاكسي، pixel" className="flex-1 bg-transparent text-base sm:text-lg text-foreground placeholder-text-muted focus:outline-none min-w-0" />
                <button onClick={() => setShowFilters(!showFilters)} className={`flex-shrink-0 rounded-lg p-2 transition-colors ${showFilters ? "bg-primary text-white" : "text-text-muted hover:bg-surface"}`}>
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <button onClick={onClose} className="flex-shrink-0 rounded-lg p-2 text-text-muted hover:bg-surface">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {query.length === 0 && !showFilters && (
                <div className="p-4">
                  <p className="mb-3 text-xs font-semibold text-text-muted">عمليات بحث شائعة</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button key={term} onClick={() => handlePopularClick(term)} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-primary/30 hover:text-primary">{term}</button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b border-border">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">جميع العلامات</option>
                        {uniqueBrands.map((b) => (<option key={b} value={b}>{b}</option>))}
                      </select>
                      <select value={ram} onChange={(e) => setRam(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">جميع الرام</option>
                        {uniqueRams.map((r) => (<option key={r} value={r}>{r}</option>))}
                      </select>
                      <select value={storage} onChange={(e) => setStorage(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">جميع التخزين</option>
                        {uniqueStorage.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                      <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">جميع الألوان</option>
                        {uniqueColors.map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="السعر من" className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none" />
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="السعر إلى" className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="max-h-[50vh] overflow-y-auto">
                {query.length === 0 && !showFilters ? null : results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-text-muted">لا توجد نتائج</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {results.slice(0, 10).map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-surface">
                        <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{p.name}</p>
                          <p className="text-xs text-text-muted">{p.brand} • {p.ram} • {p.storage}</p>
                        </div>
                        <p className="text-sm font-bold text-primary whitespace-nowrap flex-shrink-0">{p.price.toLocaleString()} درهم</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
