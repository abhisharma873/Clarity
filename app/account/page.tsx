import Link from "next/link";
import { SignInCard } from "@/app/components/SignInCard";
import { getProfile } from "@/lib/profiles/repository";
import type { ClarityPlan } from "@/lib/plans/types";
import { getUserClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { CheckInEmailsToggle } from "./CheckInEmailsToggle";
import { DeleteAccountButton } from "./DeleteAccountButton";

export const instant = false;

type PlanListRow = {
  id: string;
  plan: ClarityPlan;
  created_at: string;
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 font-sans">
        <div className="w-full max-w-sm">
          <SignInCard redirectTo="/account" title="Sign in to see your saved plans" />
        </div>
      </div>
    );
  }

  // RLS-scoped: this client only ever sees rows this user owns.
  const supabase = await getUserClient();
  const { data } = await supabase
    .from("plans")
    .select("id, plan, created_at")
    .order("created_at", { ascending: false });
  const plans = (data ?? []) as PlanListRow[];

  const profile = await getProfile(user.id);

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <h1 className="text-center text-2xl font-semibold text-stone-900 dark:text-stone-50">
          My plans
        </h1>

        <section className="flex flex-col gap-3">
          {plans.length === 0 && (
            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
              You don&apos;t have any saved plans yet.
            </p>
          )}
          {plans.map((row) => (
            <Link
              key={row.id}
              href={`/plan/${row.id}`}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-amber-400 dark:border-stone-800 dark:bg-stone-900"
            >
              <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                {row.plan.decision}
              </span>
              <span className="text-xs text-stone-400">
                {new Date(row.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <CheckInEmailsToggle initialEnabled={profile?.check_in_emails ?? true} />
        </section>

        <DeleteAccountButton />
      </div>
    </div>
  );
}
