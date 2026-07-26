import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-black text-foreground mb-2">الصفحة غير موجودة</h1>
        <p className="text-text-muted mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl accent-gradient px-6 py-3 text-sm font-bold text-white">
          <ArrowRight className="h-4 w-4" />
          العودة للمتجر
        </Link>
      </div>
    </div>
  );
}
