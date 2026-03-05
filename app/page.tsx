import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              HB
            </span>
            <span className="text-lg font-semibold tracking-tight">
              HabitBlitz
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300/90 sm:flex">
            <button className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Build better habits
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <section className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-8 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/90">
              Lightning-fast habit tracking
            </p>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Build habits that
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                  {" "}
                  actually stick
                </span>
                .
              </h1>
              <p className="text-balance text-base leading-relaxed text-slate-300/90 sm:text-lg">
                HabitBlitz turns your goals into daily wins with clean
                visual streaks, smart reminders, and just enough structure to
                keep you moving—without getting in your way.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_60px_rgba(16,185,129,0.35)] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Get Started
              </Link>
              <p className="text-xs text-slate-400">
                No clutter. No noise. Just your next habit.
              </p>
            </div>
            <dl className="grid w-full gap-4 text-left text-xs text-slate-300/90 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                  Streak focus
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-50">
                  Visual chains that make progress obvious.
                </dd>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                  Micro wins
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-50">
                  Design your day around tiny, repeatable actions.
                </dd>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                  Calm clarity
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-50">
                  A focused view that keeps distractions out.
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
            <div className="absolute inset-x-6 -top-10 h-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live streaks
                </span>
                <span>Today</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-3">
                  <div>
                    <p className="font-medium text-slate-50">Morning run</p>
                    <p className="text-[0.7rem] text-slate-400">
                      12-day streak · 7:00 AM
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="h-6 w-2 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-3">
                  <div>
                    <p className="font-medium text-slate-50">Deep work</p>
                    <p className="text-[0.7rem] text-slate-400">
                      8-day streak · 90 min
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <span
                        key={i}
                        className="h-5 w-2 rounded-full bg-slate-700"
                      />
                    ))}
                    <span className="h-6 w-2 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-3">
                  <div>
                    <p className="font-medium text-slate-50">Evening reset</p>
                    <p className="text-[0.7rem] text-slate-400">
                      Starts today · 9:30 PM
                    </p>
                  </div>
                  <button className="rounded-full border border-dashed border-slate-600/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-300">
                    Arm habit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} HabitBlitz. Built for better habits.</p>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500/80">
            One small win at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
