import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "mt-2 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#c99b4d]/70 focus:ring-2 focus:ring-[#c99b4d]/15",
        className,
      )}
      {...props}
    />
  );
}

export const authInputClassName =
  "mt-2 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-[#c99b4d]/70 focus:ring-2 focus:ring-[#c99b4d]/15";
