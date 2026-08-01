"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, SlidersHorizontal, Clock, Trash2 } from "lucide-react";
import type { Product, Accessory } from "@/data/products";

const brandAliases: Record<string, string[]> = {
  Apple: ["Ø§ÙŠØ¨ÙˆÙ†", "Ø§ÙŠÙÙˆÙ†", "Ø¢ÙŠÙÙˆÙ†", "Ø§Ø¨Ù„", "Ø£Ø¨Ù„", "iphone", "apple", "Ø§ÙŠØ¨Ø§Ø¯"],
  Samsung: ["Ø³Ø§Ù…Ø³ÙˆÙ†Ø¬", "Ø³Ø§Ù…Ø³ÙˆÙ†Øº", "Ø³Ø§Ù…Ø³ÙˆÙ†Ùƒ", "Ø³Ø§Ù…", "ØºØ§Ù„Ø§ÙƒØ³ÙŠ", "galaxy", "samsung", "sams", "s24", "s25", "s23", "Ø§Ù„ØªÙŠØ±Ø§", "Ø§ÙˆÙ„ØªØ±Ø§", "ultra"],
  Xiaomi: ["Ø´Ø§ÙˆÙ…ÙŠ", "Ø´ÙŠØ§ÙˆÙ…ÙŠ", "Ø´Ø§ÙˆÙ…", "xiaomi", "xiomi", "Ù…ÙŠ", "mi"],
  Redmi: ["Ø±ÙŠØ¯Ù…ÙŠ", "Ø±ÙŠØ¯ÙŠÙ…ÙŠ", "Ø±Ø¯Ù…ÙŠ", "redmi", "Ù†ÙˆØª", "note"],
  POCO: ["Ø¨ÙˆÙƒÙˆ", "poco", "poko"],
  Huawei: ["Ù‡ÙˆØ§ÙˆÙŠ", "Ù‡ÙˆØ§ÙˆÙŠ", "huawei"],
  Honor: ["Ø§ÙˆÙ†ÙˆØ±", "ÙˆÙ†ÙˆØ±", "honor", "Ù‡Ù†ÙˆØ±"],
  Oppo: ["Ø§ÙˆØ¨Ùˆ", "oppo"],
  Realme: ["Ø±ÙŠÙ„Ù…ÙŠ", "Ø±ÙŠÙ„Ù…", "realme", "realm"],
  Vivo: ["ÙÙŠÙÙˆ", "vivo"],
  OnePlus: ["ÙˆÙ† Ø¨Ù„Ø³", "ÙˆÙ† Ø¨Ù„Ø§Ø³", "ÙˆÙ†", "oneplus", "one"],
  "Google Pixel": ["Ø¨ÙŠÙƒØ³Ù„", "Ø¬ÙˆØ¬Ù„", "Ø¨ÙƒØ³Ù„", "pixel", "google", "pix", "gmail"],
  Motorola: ["Ù…ÙˆØªÙˆØ±ÙˆÙ„Ø§", "Ù…ÙˆØªÙˆØ±", "motorola", "moto", "Ù…ÙˆØªÙˆ"],
  Nokia: ["Ù†ÙˆÙƒÙŠØ§", "nokia"],
  Infinix: ["Ø§Ù†ÙÙŠÙ†ÙƒØ³", "Ø§Ù†ÙÙŠÙ†ÙŠÙƒØ³", "infinix"],
  Tecno: ["ØªÙƒÙ†Ùˆ", "techno", "tecno", "ÙƒØ§Ù…ÙˆÙ†", "camon"],
  Nothing: ["Ù†Ø§Ø«ÙŠÙ†Ø¬", "nothing", "Ù†Ø§Ø«Ù†Ù‚"],
};

function normalizeArabic(text: string): string {
  return text
    .replace(/[Ù‹ÙŒÙÙŽÙÙÙ‘Ù’]/g, "")
    .replace(/Ù‰/g, "ÙŠ")
    .replace(/Ø©/g, "Ù‡")
    .replace(/Ø¤/g, "Ùˆ")
    .replace(/Ø¦/g, "ÙŠ")
    .replace(/Ø¥/g, "Ø§")
    .replace(/Ø£/g, "Ø§")
    .replace(/Ø¢/g, "Ø§")
    .toLowerCase();
}

function normalizeChar(c: string): string {
  const map: Record<string, string> = {
    "Ø¥": "Ø§", "Ø£": "Ø§", "Ø¢": "Ø§", "Ù‰": "ÙŠ", "Ø©": "Ù‡", "Ø¤": "Ùˆ", "Ø¦": "ÙŠ",
    "Ã©": "e", "Ã¨": "e", "Ãª": "e", "Ã«": "e",
    "Ã ": "a", "Ã¢": "a", "Ã¤": "a",
    "Ã¹": "u", "Ã»": "u", "Ã¼": "u",
    "Ã´": "o", "Ã¶": "o",
    "Ã®": "i", "Ã¯": "i",
    "Ã§": "c",
  };
  return map[c] || c;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .split("")
    .map(normalizeChar)
    .join("");
}

function getSearchTexts(text: string): [string, string] {
  const en = normalize(text);
  const ar = normalizeArabic(text.toLowerCase().trim());
  return [en, ar];
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
  if (!query.trim()) return true;
  const [qEn, qAr] = getSearchTexts(query);
  const [tEn, tAr] = getSearchTexts(text);

  if (tEn.includes(qEn) || tAr.includes(qAr)) return true;
  if (tAr.includes(qEn) || tEn.includes(qAr)) return true;

  const qWords = [...new Set([...qEn.split(/\s+/).filter(Boolean), ...qAr.split(/\s+/).filter(Boolean)])];
  if (qWords.length === 0) return true;

  const tWords = [...new Set([...tEn.split(/\s+/).filter(Boolean), ...tAr.split(/\s+/).filter(Boolean)])];

  return qWords.every((qw) =>
    tWords.some((tw) => tw.includes(qw) || qw.includes(tw) || (qw.length >= 2 && levenshtein(qw.slice(0, 6), tw.slice(0, 6)) <= 1))
  );
}

function matchesBrand(query: string, brand: string): boolean {
  const [qEn, qAr] = getSearchTexts(query);
  const [bEn, bAr] = getSearchTexts(brand);

  if (bAr.includes(qAr) || bEn.includes(qEn)) return true;
  if (bAr.includes(qEn) || bEn.includes(qAr)) return true;

  const aliases = brandAliases[brand] || [];
  for (const alias of aliases) {
    const [aEn, aAr] = getSearchTexts(alias);
    if (aAr.includes(qAr) || aEn.includes(qEn)) return true;
    if (aAr.includes(qEn) || aEn.includes(qAr)) return true;
  }

  return false;
}

const RECENT_KEY = "tv-recent-searches";

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const [qEn] = getSearchTexts(query);
  const [tEn] = getSearchTexts(text);
  if (!qEn) return text;
  const escaped = qEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    normalize(part) === qEn
      ? <mark key={i} className="bg-primary/12 text-primary font-semibold rounded-sm not-italic">{part}</mark>
      : part
  );
}

type SearchItem = { type: "product"; data: Product } | { type: "accessory"; data: Accessory };

const popularSearches = ["iPhone 16 Pro Max", "Samsung Galaxy S25 Ultra", "Google Pixel 10", "Xiaomi Redmi Note 14", "512 GB", "Ø´Ø§Ø­Ù† Ø³Ø±ÙŠØ¹", "Ø³Ù…Ø§Ø¹Ø§Øª Ø¨Ù„ÙˆØªÙˆØ«"];

interface Props {
  open: boolean;
  onClose: () => void;
  products?: Product[];
  accessories?: Accessory[];
}

export default function SearchOverlay({ open, onClose, products = [], accessories = [] }: Props) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return getRecent();
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setSelectedIndex(-1);
      setQuery("");
      setBrand("");
      setRam("");
      setStorage("");
      setColor("");
      setMinPrice("");
      setMaxPrice("");
      setShowFilters(false);
    }
  }

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtersKey = `${query}|${brand}|${ram}|${storage}|${color}|${minPrice}|${maxPrice}`;
  const [lastFiltersKey, setLastFiltersKey] = useState(filtersKey);
  if (filtersKey !== lastFiltersKey) {
    setLastFiltersKey(filtersKey);
    setSelectedIndex(-1);
  }

  const persistRecent = useCallback((next: string[]) => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addRecentLocal = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setRecentSearches((prev) => {
        const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
        persistRecent(next);
        return next;
      });
    },
    [persistRecent]
  );

  const clearRecentLocal = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  }, []);

  const uniqueBrands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);
  const uniqueRams = useMemo(() => [...new Set(products.map((p) => p.ram))], [products]);
  const uniqueStorage = useMemo(() => [...new Set(products.map((p) => p.storage))], [products]);
  const uniqueColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))], [products]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q && !brand && !ram && !storage && !color && !minPrice && !maxPrice) return [];

    const productResults: SearchItem[] = products
      .filter((p) => {
        if (q) {
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
      })
      .map((p) => ({ type: "product" as const, data: p }));

    const accessoryResults: SearchItem[] = q
      ? accessories
          .filter((a) => fuzzyMatch(q, a.name) || fuzzyMatch(q, a.brand) || fuzzyMatch(q, a.description) || fuzzyMatch(q, a.category))
          .map((a) => ({ type: "accessory" as const, data: a }))
      : [];

    const all = [...productResults, ...accessoryResults];
    if (!q && brand) return productResults;
    return all;
  }, [query, brand, ram, storage, color, minPrice, maxPrice, products, accessories]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const el = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < results.length && query.trim()) {
        addRecentLocal(query.trim());
        const item = results[selectedIndex];
        if (item.type === "product") {
          window.location.href = `/product/${item.data.id}`;
        } else {
          window.location.href = `/accessories#${item.data.id}`;
        }
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [results, selectedIndex, query, onClose, addRecentLocal]);

  const handleResultClick = useCallback((item: SearchItem) => {
    if (query.trim()) addRecentLocal(query.trim());
  }, [query, addRecentLocal]);

  const handlePopularClick = useCallback((term: string) => {
    setQuery(term);
    addRecentLocal(term);
  }, [addRecentLocal]);

  const handleRecentClick = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const hasActiveFilters = brand || ram || storage || color || minPrice || maxPrice;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-0 right-0 left-0 z-[90] mx-auto max-w-2xl pt-3 sm:pt-6 px-3 sm:px-4" onKeyDown={handleKeyDown}>
            <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-border p-3 sm:p-4">
                <SearchIcon className="h-5 w-5 text-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ø§Ø¨Ø­Ø« Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠ Ø£Ùˆ Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ..."
                  className="flex-1 bg-transparent text-base sm:text-lg !text-[#111111] dark:!text-white placeholder-[#9ca3af] dark:placeholder-[#6b7280] caret-[#2563eb] focus:outline-none min-w-0"
                />
                <button onClick={() => setShowFilters(!showFilters)} className={`flex-shrink-0 rounded-lg p-2 transition-colors ${showFilters ? "bg-primary text-white" : "text-text-muted hover:bg-surface"}`}>
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <button onClick={onClose} className="flex-shrink-0 rounded-lg p-2 text-text-muted hover:bg-surface">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {query.length === 0 && !showFilters && !hasActiveFilters && (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="mb-2.5 text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø­Ø« Ø­Ø¯ÙŠØ«Ø©
                    </p>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term) => (
                          <button key={term} onClick={() => handleRecentClick(term)} className="group rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-primary/30 hover:text-primary flex items-center gap-1.5">
                            {term}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Ã—</span>
                          </button>
                        ))}
                        <button onClick={clearRecentLocal} className="rounded-full px-3 py-1.5 text-xs text-red-500/60 hover:text-red-500 transition-colors flex items-center gap-1">
                          <Trash2 className="h-3 w-3" />
                          Ù…Ø³Ø­
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted/50">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø­Ø« Ø³Ø§Ø¨Ù‚Ø©</p>
                    )}
                  </div>
                  <div>
                    <p className="mb-2.5 text-xs font-semibold text-text-muted">Ø¹Ù…Ù„ÙŠØ§Øª Ø¨Ø­Ø« Ø´Ø§Ø¦Ø¹Ø©</p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((term) => (
                        <button key={term} onClick={() => handlePopularClick(term)} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-primary/30 hover:text-primary">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted/40 pt-1">Ø§Ø³ØªØ®Ø¯Ù… â†‘ â†“ Ù„Ù„ØªÙ†Ù‚Ù„ Ùˆ â†µ Ù„Ù„Ø§Ø®ØªÙŠØ§Ø±</p>
                </div>
              )}

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b border-border">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª</option>
                        {uniqueBrands.map((b) => (<option key={b} value={b}>{b}</option>))}
                      </select>
                      <select value={ram} onChange={(e) => setRam(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø±Ø§Ù…</option>
                        {uniqueRams.map((r) => (<option key={r} value={r}>{r}</option>))}
                      </select>
                      <select value={storage} onChange={(e) => setStorage(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">Ø¬Ù…ÙŠØ¹ Ø§Ù„ØªØ®Ø²ÙŠÙ†</option>
                        {uniqueStorage.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                      <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                        <option value="">Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ù„ÙˆØ§Ù†</option>
                        {uniqueColors.map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                      <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Ø§Ù„Ø³Ø¹Ø± Ù…Ù†" className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted/50 focus:border-primary focus:outline-none" />
                      <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Ø§Ù„Ø³Ø¹Ø± Ø¥Ù„Ù‰" className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-text-muted/50 focus:border-primary focus:outline-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {(query || showFilters || hasActiveFilters) && (
                <div ref={listRef} className="max-h-[50vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg className="mx-auto mb-3 h-16 w-16 text-text-muted/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        <circle cx="10" cy="10" r="3" fill="currentColor" opacity={0.08} />
                      </svg>
                      <p className="text-sm font-medium text-text-muted">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù†ØªØ§Ø¦Ø¬</p>
                      <p className="text-xs text-text-muted/40 mt-0.5">Ø¬Ø±Ù‘Ø¨ ÙƒÙ„Ù…Ø© Ø¨Ø­Ø« Ù…Ø®ØªÙ„ÙØ©</p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="p-2">
                      {results.slice(0, 15).map((item, i) => {
                        const isSelected = i === selectedIndex;
                        if (item.type === "product") {
                          const p = item.data;
                          return (
                            <Link
                              key={`p-${p.id}`}
                              href={`/product/${p.id}`}
                              onClick={() => { handleResultClick(item); onClose(); }}
                              className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-150 ${isSelected ? "bg-primary/8 shadow-sm border border-primary/10" : "hover:bg-surface border border-transparent"}`}
                              onMouseEnter={() => setSelectedIndex(i)}
                            >
                              <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{highlightText(p.name, query)}</p>
                                <p className="text-xs text-text-muted">{p.brand} â€¢ {p.ram} â€¢ {p.storage}</p>
                              </div>
                              <p className="text-sm font-bold text-primary whitespace-nowrap flex-shrink-0">{p.price.toLocaleString()} Ø¯Ø±Ù‡Ù…</p>
                            </Link>
                          );
                        }
                        const a = item.data;
                        return (
                          <Link
                            key={`a-${a.id}`}
                            href={`/accessories#${a.id}`}
                            onClick={() => { handleResultClick(item); onClose(); }}
                            className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-150 ${isSelected ? "bg-primary/8 shadow-sm border border-primary/10" : "hover:bg-surface border border-transparent"}`}
                            onMouseEnter={() => setSelectedIndex(i)}
                          >
                            <img src={a.image} alt={a.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{highlightText(a.name, query)}</p>
                              <p className="text-xs text-text-muted">Ø¥ÙƒØ³Ø³ÙˆØ§Ø± â€¢ {a.brand}</p>
                            </div>
                            <p className="text-sm font-bold text-primary whitespace-nowrap flex-shrink-0">{a.price.toLocaleString()} Ø¯Ø±Ù‡Ù…</p>
                          </Link>
                        );
                      })}
                      {results.length > 15 && (
                        <p className="text-xs text-text-muted/50 text-center py-2">Ùˆ {results.length - 15} Ù†ØªÙŠØ¬Ø© Ø£Ø®Ø±Ù‰...</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
