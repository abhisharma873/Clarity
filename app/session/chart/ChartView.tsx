"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { setNumerologySystem, startConversation } from "@/app/session/actions";
import type { NumerologySystem } from "@/lib/numerology";
import type { StoredChart } from "@/lib/sessions/types";

const CARDS: { key: keyof Omit<StoredChart["pythagorean"], "system">; label: string }[] = [
  { key: "lifePath", label: "Life Path" },
  { key: "birthdayNumber", label: "Birthday Number" },
  { key: "destiny", label: "Destiny" },
  { key: "soulUrge", label: "Soul Urge" },
  { key: "personality", label: "Personality" },
];

const SYSTEMS: { value: NumerologySystem; label: string }[] = [
  { value: "pythagorean", label: "Pythagorean" },
  { value: "chaldean", label: "Chaldean" },
];

export function ChartView({
  sessionId,
  chart,
  initialSystem,
}: {
  sessionId: string;
  chart: StoredChart;
  initialSystem: NumerologySystem;
}) {
  const [system, setSystem] = useState<NumerologySystem>(initialSystem);
  const current = chart[system];

  useEffect(() => {
    posthog.capture("chart_viewed");
  }, []);

  function handleToggle(next: NumerologySystem) {
    setSystem(next);
    void setNumerologySystem(sessionId, next);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-semibold text-stone-900 dark:text-stone-50">
        Your numbers
      </h1>

      <div className="flex justify-center gap-2 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
        {SYSTEMS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              system === option.value
                ? "bg-white text-amber-700 shadow-sm dark:bg-stone-900 dark:text-amber-300"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {CARDS.map(({ key, label }) => {
          const entry = current[key];
          return (
            <div
              key={key}
              className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  {label}
                </span>
                <span className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
                  {entry.value}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                {entry.meaning.strengths} {entry.meaning.growthAreas}
              </p>
            </div>
          );
        })}
      </div>

      <form action={startConversation}>
        <input type="hidden" name="sessionId" value={sessionId} />
        <button
          type="submit"
          className="w-full rounded-full bg-amber-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-amber-700"
        >
          Start my clarity session
        </button>
      </form>
    </div>
  );
}
