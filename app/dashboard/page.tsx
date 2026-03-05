"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type HabitId =
  | "exercise"
  | "diet"
  | "deepWork"
  | "personalDev"
  | "lifeAdmin"
  | "money"
  | "housework"
  | "read"
  | "journal"
  | "goodDeed"
  | "friends"
  | "relationship";

type HabitState = "none" | "completed" | "missed";

type Habit = {
  id: HabitId;
  name: string;
  points: number;
  monFriOnly?: boolean;
};

const HABITS: Habit[] = [
  { id: "exercise", name: "Exercise (60min/10k steps)", points: 20 },
  { id: "diet", name: "Diet / 3 good meals", points: 15 },
  { id: "deepWork", name: "Deep Work (4hrs, Mon–Fri)", points: 30, monFriOnly: true },
  {
    id: "personalDev",
    name: "Personal Development (90min, Mon–Fri)",
    points: 15,
    monFriOnly: true,
  },
  { id: "housework", name: "Housework (30min)", points: 5 },
  { id: "read", name: "Read (30min)", points: 5 },
  { id: "journal", name: "Journal (10min)", points: 5 },
  { id: "goodDeed", name: "Good Deed", points: 5 },
  { id: "friends", name: "Friends (30min)", points: 5 },
  { id: "relationship", name: "Good BF/GF/Single", points: 5 },
];

const WEEKLY_HABITS: Habit[] = [
  { id: "lifeAdmin", name: "Life Admin (2hrs)", points: 10 },
  { id: "money", name: "Money Planning (30min)", points: 5 },
];

type PenaltyId = "junk" | "alcohol" | "doom";

const PENALTY_VALUES: Record<PenaltyId, number> = {
  junk: 10,
  alcohol: 10,
  doom: 5,
};

type WeekDay = {
  key: string;
  date: Date;
  label: string;
  isToday: boolean;
  weekdayIndex: number;
};

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0-6, Sun-Sat
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [weekOffset, setWeekOffset] = useState(0);
  const [habitStates, setHabitStates] = useState<Record<string, HabitState>>({});
  const [penalties, setPenalties] = useState<Record<PenaltyId, boolean>>({
    junk: false,
    alcohol: false,
    doom: false,
  });
  const [weeklyHabitStates, setWeeklyHabitStates] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUserEmail(user?.email ?? null);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const weekDays: WeekDay[] = useMemo(() => {
    const baseMonday = getMonday(today);
    const monday = new Date(baseMonday);
    monday.setDate(baseMonday.getDate() + weekOffset * 7);

    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const isToday = d.getTime() === today.getTime();
      const shortDay = d.toLocaleDateString(undefined, { weekday: "short" });
      const dayNum = d.getDate();
      return {
        key: formatKey(d),
        date: d,
        label: `${shortDay} ${dayNum}`,
        isToday,
        weekdayIndex: d.getDay(),
      };
    });
  }, [today, weekOffset]);

  const todayKey = formatKey(today);
  const todayWeekIndex = weekDays.findIndex((d) => d.key === todayKey);

  function cycleHabitState(current: HabitState): HabitState {
    if (current === "none") return "completed";
    if (current === "completed") return "missed";
    return "none";
  }

  function handleCellClick(habit: Habit, day: WeekDay) {
    const isWeekend = day.weekdayIndex === 0 || day.weekdayIndex === 6;
    if (habit.monFriOnly && isWeekend) return;

    const key = `${habit.id}-${day.key}`;
    setHabitStates((prev) => ({
      ...prev,
      [key]: cycleHabitState(prev[key] ?? "none"),
    }));
  }

  function getCellState(habit: Habit, day: WeekDay): HabitState {
    const isWeekend = day.weekdayIndex === 0 || day.weekdayIndex === 6;
    if (habit.monFriOnly && isWeekend) {
      return "none";
    }
    const key = `${habit.id}-${day.key}`;
    return habitStates[key] ?? "none";
  }

  function togglePenalty(id: PenaltyId) {
    setPenalties((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleWeeklyHabit(id: HabitId) {
    const key = `${id}-${todayKey}`;
    setWeeklyHabitStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  const todayScore = useMemo(() => {
    const day = weekDays[todayWeekIndex];
    if (!day) return 0;

    let score = 0;
    HABITS.forEach((habit) => {
      const state = getCellState(habit, day);
      if (state === "completed") {
        score += habit.points;
      }
    });

    WEEKLY_HABITS.forEach((habit) => {
      const key = `${habit.id}-${todayKey}`;
      if (weeklyHabitStates[key]) {
        score += habit.points;
      }
    });

    (Object.keys(penalties) as PenaltyId[]).forEach((id) => {
      if (penalties[id]) score -= PENALTY_VALUES[id];
    });

    return score;
  }, [penalties, todayWeekIndex, weekDays, habitStates, weeklyHabitStates, todayKey]);

  function renderCell(habit: Habit, day: WeekDay) {
    const state = getCellState(habit, day);
    const isWeekend = day.weekdayIndex === 0 || day.weekdayIndex === 6;
    const disabled = habit.monFriOnly && isWeekend;

    let bg = "bg-slate-900/60 border-slate-800/80 text-slate-500";
    if (!disabled) {
      if (state === "completed") {
        bg =
          "bg-emerald-500/80 border-emerald-400/80 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.35)]";
      } else if (state === "missed") {
        bg = "bg-red-500/80 border-red-400/80 text-slate-950";
      }
    }

    return (
      <button
        key={day.key}
        type="button"
        disabled={disabled}
        onClick={() => handleCellClick(habit, day)}
        className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs font-semibold transition ${
          disabled ? "cursor-not-allowed opacity-40" : "hover:scale-[1.02]"
        } ${bg}`}
      >
        {disabled ? "—" : state === "completed" ? "✓" : state === "missed" ? "✕" : ""}
      </button>
    );
  }

  const totalPossibleToday = useMemo(() => {
    const day = weekDays[todayWeekIndex];
    if (!day) return 0;
    return HABITS.reduce((sum, habit) => {
      const isWeekend = day.weekdayIndex === 0 || day.weekdayIndex === 6;
      if (habit.monFriOnly && isWeekend) return sum;
      return sum + habit.points;
    }, 0);
  }, [todayWeekIndex, weekDays]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              HB
            </span>
            <span className="text-lg font-semibold tracking-tight">
              HabitBlitz
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="hidden rounded-full border border-slate-800/80 bg-slate-900/80 px-3 py-1 text-slate-300 sm:inline-flex">
              {userEmail ?? "Loading…"}
            </span>
            <button className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/70 hover:text-slate-50">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
                Today&apos;s score
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {todayScore}
                </p>
                <p className="text-sm text-slate-400">
                  /100{" "}
                  <span className="text-slate-500">
                    (max {totalPossibleToday - (PENALTY_VALUES.junk + PENALTY_VALUES.alcohol + PENALTY_VALUES.doom)}+
                    possible)
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/80 px-3 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Week overview
              </div>
              <p className="text-xs text-slate-500">
                Click a cell once for{" "}
                <span className="text-emerald-300">completed</span>, twice for{" "}
                <span className="text-red-300">missed</span>, again to clear.
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setWeekOffset((v) => v - 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/80"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className="rounded-full px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-slate-400 hover:text-emerald-300"
                >
                  This week
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset((v) => v + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/80"
                >
                  ›
                </button>
              </div>
              <div className="flex gap-2 text-[0.68rem] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Done
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-400" /> Missed
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-600" /> Not
                  logged
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full space-y-2">
                <div className="grid grid-cols-[minmax(0,2.2fr)_repeat(7,minmax(0,1fr))] items-end gap-2 text-xs text-slate-400">
                  <div className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                    Habit
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={day.key}
                      className={`flex flex-col items-center justify-end gap-1 rounded-xl border px-2 py-1 ${
                        day.isToday
                          ? "border-emerald-400/80 bg-emerald-500/5 text-emerald-200"
                          : "border-slate-800/80 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      <span className="text-[0.6rem] uppercase tracking-[0.16em]">
                        {day.date.toLocaleDateString(undefined, {
                          weekday: "short",
                        })}
                      </span>
                      <span className="text-sm font-semibold">
                        {day.date.getDate()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {HABITS.map((habit) => (
                    <div
                      key={habit.id}
                      className="grid grid-cols-[minmax(0,2.2fr)_repeat(7,minmax(0,1fr))] items-center gap-2"
                    >
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/40 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-slate-50">
                            {habit.name}
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-slate-500">
                            {habit.points} pts · Streak{" "}
                            <span className="font-semibold text-emerald-300">
                              0
                            </span>
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-900/90 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          +{habit.points}
                        </span>
                      </div>
                      {weekDays.map((day) => renderCell(habit, day))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-50">
                  Weekly Habits
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Big moves that only need to happen once this week. Tick them on
                  the day you complete them to earn the points.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {WEEKLY_HABITS.map((habit) => {
                const key = `${habit.id}-${todayKey}`;
                const checked = weeklyHabitStates[key] ?? false;
                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => toggleWeeklyHabit(habit.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                      checked
                        ? "border-emerald-400/80 bg-emerald-500/15 text-emerald-50 shadow-[0_0_25px_rgba(52,211,153,0.35)]"
                        : "border-slate-800/80 bg-slate-950/60 text-slate-200 hover:border-slate-600 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-md border text-[0.7rem] font-semibold ${
                          checked
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : "border-slate-600 bg-slate-900 text-slate-500"
                        }`}
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="mt-0.5 text-[0.7rem] text-slate-500">
                          +{habit.points} pts when completed this week
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Weekly
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5">
              <h2 className="text-sm font-semibold tracking-tight text-slate-50">
                Penalties
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Toggle for today. Each penalty subtracts from your daily score.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => togglePenalty("junk")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    penalties.junk
                      ? "border-red-400/80 bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(248,113,113,0.4)]"
                      : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Junk food
                  <span className="text-[0.7rem] text-red-300">-10pts</span>
                </button>
                <button
                  type="button"
                  onClick={() => togglePenalty("alcohol")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    penalties.alcohol
                      ? "border-red-400/80 bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(248,113,113,0.4)]"
                      : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Alcohol
                  <span className="text-[0.7rem] text-red-300">-10pts</span>
                </button>
                <button
                  type="button"
                  onClick={() => togglePenalty("doom")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    penalties.doom
                      ? "border-red-400/80 bg-red-500/20 text-red-200 shadow-[0_0_25px_rgba(248,113,113,0.4)]"
                      : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Doom scroll 30min+
                  <span className="text-[0.7rem] text-red-300">-5pts</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5">
              <h2 className="text-sm font-semibold tracking-tight text-slate-50">
                Today at a glance
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                You&apos;re at{" "}
                <span className="font-semibold text-emerald-300">
                  {todayScore}
                </span>{" "}
                points today. Keep stacking small wins to push your streaks up
                and keep penalties down.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[0.7rem] text-slate-400">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                    Completed
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-300">
                    {
                      HABITS.filter((habit) => {
                        const day = weekDays[todayWeekIndex];
                        if (!day) return false;
                        return getCellState(habit, day) === "completed";
                      }).length
                    }
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                    Missed
                  </p>
                  <p className="mt-1 text-base font-semibold text-red-300">
                    {
                      HABITS.filter((habit) => {
                        const day = weekDays[todayWeekIndex];
                        if (!day) return false;
                        return getCellState(habit, day) === "missed";
                      }).length
                    }
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                    Penalties
                  </p>
                  <p className="mt-1 text-base font-semibold text-red-300">
                    -
                    {(Object.keys(penalties) as PenaltyId[])
                      .filter((id) => penalties[id])
                      .reduce((sum, id) => sum + PENALTY_VALUES[id], 0)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} HabitBlitz. Built for better habits.</p>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500/80">
            One small win at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
