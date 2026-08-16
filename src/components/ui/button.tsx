import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "gold" | "outline" | "ghost";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsLinkProps = ButtonBaseProps & {
  href: string;
  type?: never;
  disabled?: never;
};

type ButtonAsButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  gold: "bg-gradient-to-r from-[#ad7932] via-[#ddb86e] to-[#ad7932] text-black hover:brightness-110",
  outline:
    "border border-gold/50 bg-black/20 text-white hover:border-gold hover:bg-gold/10",
  ghost: "text-[#d9ad62] hover:text-[#f2ca80]",
};

const baseClasses =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

export function Button(props: ButtonProps) {
  const { children, variant = "gold", className } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", disabled, ...rest } = props as ButtonAsButtonProps;

  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
