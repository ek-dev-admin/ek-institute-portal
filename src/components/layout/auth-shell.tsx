import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#03080f] px-5 py-16 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,155,75,0.14),transparent_40%)]"
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-[#c99b4d]/25 bg-black/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-serif text-3xl tracking-[0.18em] text-[#d9ad62]"
          >
            EK
          </Link>

          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#bca77f]">
            Executive Cooperation
          </p>

          <h1 className="mt-8 font-serif text-3xl sm:text-4xl">{title}</h1>

          {description && (
            <p className="mt-3 text-sm leading-6 text-white/60">
              {description}
            </p>
          )}
        </div>

        {children}

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </main>
  );
}
