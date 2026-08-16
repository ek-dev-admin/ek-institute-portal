import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertProps = {
  children: ReactNode;
  variant?: "error" | "success" | "info";
  className?: string;
};

const variantClasses = {
  error: "border-red-400/25 bg-red-400/10 text-red-300",
  success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  info: "border-white/15 bg-white/5 text-white/70",
};

export function Alert({
  children,
  variant = "error",
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
