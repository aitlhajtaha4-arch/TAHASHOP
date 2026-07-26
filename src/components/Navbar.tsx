"use client";

import { useState, useEffect, useCallback } from "react";
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
    { label: "التقييمات", href: "#reviews" },
    { label: "تواصل معنا", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="accent-gradient flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white">TV</div>
              <span className="text-lg font-bold tracking-tight hidden sm:block">
                <span className="text-accent-gradient">Tech</span>
                <span className="text-foreground">Vault</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <a key={link.label} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={onSearchOpen} className="relative p-2.5 rounded-xl text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5">
                <Search className="h-5 w-5" />
              </button>

              <button onClick={toggleTheme} className="relative p-2.5 rounded-xl text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5">
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button className="relative p-2.5 rounded-xl text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5 hidden sm:flex">
                <User className="h-5 w-5" />
              </button>

              <button onClick={onCartOpen} className="relative p-2.5 rounded-xl text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2.5 rounded-xl text-text-muted transition-all duration-200 hover:text-primary hover:bg-primary/5 lg:hidden">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-border overflow-hidden bg-background backdrop-blur-xl lg:hidden">
              <div className="px-4 py-4 space-y-1">
                {links.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:text-primary hover:bg-primary/5">
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
