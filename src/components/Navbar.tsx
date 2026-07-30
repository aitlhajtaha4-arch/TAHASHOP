"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";

export default function Navbar({ onSearchOpen, onCartOpen }: { onSearchOpen?: () => void; onCartOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "الرئيسية", href: "/" },
    { label: "الهواتف", href: "#products" },
    { label: "العروض", href: "#deals" },
    { label: "العلامات التجارية", href: "#brands" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border-b border-border shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white">
              TV
            </div>
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              <span className="text-primary">Tech</span>
              <span className="text-foreground">Vault</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 mx-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-text-muted transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onSearchOpen}
              className="relative p-2 rounded-lg text-text-muted transition-colors duration-200 hover:text-foreground"
              aria-label="بحث"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg text-text-muted transition-colors duration-200 hover:text-foreground"
              aria-label="تبديل الوضع"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="h-[18px] w-[18px]" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="h-[18px] w-[18px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              className="relative p-2 rounded-lg text-text-muted transition-colors duration-200 hover:text-foreground hidden sm:flex"
              aria-label="حسابي"
            >
              <User className="h-[18px] w-[18px]" />
            </button>

            <button
              onClick={onCartOpen}
              className="relative p-2 rounded-lg text-text-muted transition-colors duration-200 hover:text-foreground"
              aria-label="السلة"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white px-[3px]"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-text-muted transition-colors duration-200 hover:text-foreground lg:hidden"
              aria-label="القائمة"
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border overflow-hidden bg-white dark:bg-[#1d1d1f] lg:hidden"
          >
            <div className="px-4 py-3 space-y-0.5">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
