"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              HB
            </span>
            <span className="text-lg font-semibold tracking-tight">
              HabitBlitz
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800/60 hover:text-slate-50"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-400">
            You&apos;re signed in as{" "}
            <span className="font-medium text-emerald-400">
              {user?.email}
            </span>
          </p>
          <p className="mt-6 text-sm text-slate-500">
            Your dashboard. Habit tracking and streaks will live here.
          </p>
        </div>
      </main>

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
