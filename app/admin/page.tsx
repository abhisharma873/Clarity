import { notFound } from "next/navigation";
import type { Feedback } from "@/lib/plans/types";
import { estimateCostUsd, getModelRate } from "@/lib/admin/pricing";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";

export const instant = false;

const WINDOW_DAYS = 30;
const FEEDBACK_LABELS: Record<Feedback, string> = { yes: "Yes", somewhat: "Somewhat", no: "No" };

function formatPercent(part: number, total: number): string {
  if (total === 0) {
    return "—";
  }
  return `${Math.round((part / total) * 100)}%`;
}

async function getFunnelData() {
  const supabase = getServiceRoleClient();
  const windowStart = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: sessionsStarted }, { count: sessionsCompleted }, { count: signups }, { count: cardsDownloaded }] =
    await Promise.all([
      supabase.from("sessions").select("*", { count: "exact", head: true }).gte("created_at", windowStart),
      supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("created_at", windowStart),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", windowStart),
      supabase.from("plans").select("*", { count: "exact", head: true }).gte("card_downloaded_at", windowStart),
    ]);

  const { data: feedbackRows } = await supabase
    .from("plans")
    .select("feedback")
    .gte("created_at", windowStart)
    .not("feedback", "is", null);

  const feedbackCounts: Record<Feedback, number> = { yes: 0, somewhat: 0, no: 0 };
  for (const row of feedbackRows ?? []) {
    const feedback = row.feedback as Feedback | null;
    if (feedback) {
      feedbackCounts[feedback] += 1;
    }
  }

  const { data: sessionsInWindow } = await supabase
    .from("sessions")
    .select("id")
    .gte("created_at", windowStart);
  const sessionIds = (sessionsInWindow ?? []).map((row) => row.id as string);

  let avgCostUsd: number | null = null;
  if (sessionIds.length > 0) {
    const { data: usageRows } = await supabase
      .from("usage")
      .select("session_id, input_tokens, output_tokens")
      .in("session_id", sessionIds);

    const bySession = new Map<string, { input: number; output: number }>();
    for (const row of usageRows ?? []) {
      const entry = bySession.get(row.session_id) ?? { input: 0, output: 0 };
      entry.input += row.input_tokens;
      entry.output += row.output_tokens;
      bySession.set(row.session_id, entry);
    }

    if (bySession.size > 0) {
      const model = process.env.CLAUDE_MODEL;
      const totalCost = Array.from(bySession.values()).reduce(
        (sum, { input, output }) => sum + estimateCostUsd(input, output, model),
        0,
      );
      avgCostUsd = totalCost / bySession.size;
    }
  }

  return {
    sessionsStarted: sessionsStarted ?? 0,
    sessionsCompleted: sessionsCompleted ?? 0,
    signups: signups ?? 0,
    cardsDownloaded: cardsDownloaded ?? 0,
    feedbackCounts,
    avgCostUsd,
  };
}

function StatCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-50">{value}</p>
      {caption && <p className="mt-1 text-xs text-stone-400">{caption}</p>}
    </div>
  );
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user?.email || user.email !== process.env.ADMIN_EMAIL) {
    notFound();
  }

  const data = await getFunnelData();
  const model = process.env.CLAUDE_MODEL;
  const rate = getModelRate(model);
  const totalFeedback = data.feedbackCounts.yes + data.feedbackCounts.somewhat + data.feedbackCounts.no;

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-2xl flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Funnel — last {WINDOW_DAYS} days
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">From Clarity&apos;s own database.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Sessions started" value={String(data.sessionsStarted)} />
          <StatCard label="Sessions completed" value={String(data.sessionsCompleted)} />
          <StatCard
            label="Completion rate"
            value={formatPercent(data.sessionsCompleted, data.sessionsStarted)}
          />
          <StatCard
            label="Signups / completions"
            value={`${data.signups} / ${data.sessionsCompleted}`}
            caption={formatPercent(data.signups, data.sessionsCompleted)}
          />
          <StatCard label="Cards downloaded" value={String(data.cardsDownloaded)} />
          <StatCard
            label="Avg. token cost / session"
            value={data.avgCostUsd === null ? "—" : `$${data.avgCostUsd.toFixed(4)}`}
            caption={`Estimated at ${model ?? "unset"} rates ($${rate.inputPer1M}/$${rate.outputPer1M} per 1M)`}
          />
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Did this help?
          </h2>
          {totalFeedback === 0 ? (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">No feedback yet.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {(Object.keys(FEEDBACK_LABELS) as Feedback[]).map((key) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-stone-700 dark:text-stone-200">{FEEDBACK_LABELS[key]}</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {data.feedbackCounts[key]} ({formatPercent(data.feedbackCounts[key], totalFeedback)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-stone-400">
          Token cost is an estimate based on the currently configured model — usage rows don&apos;t
          record which model priced them, so a past change to CLAUDE_MODEL would skew this.
        </p>
      </div>
    </div>
  );
}
