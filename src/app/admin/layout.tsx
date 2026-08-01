"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Star, Bell, LogOut, Menu, X, ChevronLeft, Zap, Headphones, Settings, Tags, Store } from "lucide-react";
import { getAdminProfile, signOutAdmin } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الفئات", icon: Tags },
  { href: "/admin/accessories", label: "الإكسسوارات", icon: Headphones },
  { href: "/admin/flash-deals", label: "عروض الوميض", icon: Zap },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/reviews", label: "التقييمات", icon: Star },
  { href: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { href: "/admin/settings/store", label: "إعدادات المتجر", icon: Store },
  { href: "/admin/settings/payments", label: "إعدادات الدفع", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getAdminProfile()
      .then((profile) => {
        if (!profile) {
          router.replace("/login");
          return;
        }
        setIsAdmin(true);
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  if (checking || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-text-muted">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOutAdmin();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 right-0 z-50 h-full w-64 border-l border-border bg-surface transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="text-lg font-black text-foreground">TechVault</span>
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "accent-gradient text-white shadow-lg shadow-primary/25"
                      : "text-text-muted hover:bg-surface-dark hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronLeft className="mr-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-3">
            <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-dark hover:text-foreground transition-all mb-1">
              <span className="text-sm">🏪</span>
              العودة للمتجر
            </Link>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/80 backdrop-blur-md px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-text-muted hover:bg-surface-dark">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-sm font-bold text-foreground">لوحة التحكم</h2>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
