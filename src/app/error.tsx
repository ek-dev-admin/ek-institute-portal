"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-white">
      <div className="w-full max-w-md rounded-xl border border-red-400/25 bg-panel p-8 text-center">
        <h1 className="font-display text-3xl text-gold">Something went wrong</h1>
        <p className="mt-4 text-sm text-white/60">
          An unexpected error occurred. Please try again.
        </p>
        <Button type="button" onClick={reset} className="mt-8 w-full">
          Try again
        </Button>
      </div>
    </main>
  );
}
