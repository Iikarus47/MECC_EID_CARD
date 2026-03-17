export default function NotFound() {
  return (
    <main className="min-h-screen px-5 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200/70 bg-white/70 p-8 text-center shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
          Page not found
        </p>
        <h1 className="mt-3 font-display text-3xl text-slate-950 dark:text-slate-50">
          This path isn’t part of the celebration.
        </h1>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/90">
          Return to the Eid page and continue your wish.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}

