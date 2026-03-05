"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccessMessage(
      "Please check your email and click the confirmation link to activate your account"
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
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter your email and a password to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {successMessage}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-500">
                At least 6 characters
              </p>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-slate-700/80 bg-slate-800/60 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} HabitBlitz
        </div>
      </footer>
    </div>
  );
}
