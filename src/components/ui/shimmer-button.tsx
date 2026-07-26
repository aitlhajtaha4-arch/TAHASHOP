"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  background?: string;
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      className,
      children,
      shimmerColor = "rgba(255, 255, 255, 0.4)",
      shimmerSize = "200px",
      shimmerDuration = "2s",
      background = "linear-gradient(135deg, #2563eb, #8b5cf6)",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative z-0 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        style={{ background }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        <span
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(110deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
            backgroundSize: `${shimmerSize} 100%`,
            animation: `shimmer ${shimmerDuration} infinite linear`,
          }}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
export default ShimmerButton;
