"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-ink text-white">
        <main className="grid min-h-screen place-items-center px-5">
          <div className="w-full max-w-md rounded-xl border border-red-400/25 bg-black p-8 text-center">
            <h1 className="text-3xl">Application error</h1>
            <p className="mt-4 text-sm text-white/60">
              {error.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 w-full rounded-lg bg-[#d9ad62] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-black"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
