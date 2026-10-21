#!/usr/bin/env node
// Proves one user cannot read another user's plan under RLS.
//
// Needs a REAL Supabase project with this app's migrations applied —
// cannot run in a sandboxed/no-DB environment. The app itself only offers
// Google and magic-link sign-in, but this script authenticates with
// email+password (via the admin API) purely as the simplest way to get
// two real, isolated auth sessions to test RLS against.
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... \
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
//   SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/verify-rls.mjs
//
// Exits non-zero (and prints what went wrong) if cross-user access is NOT
// blocked, or if anything in setup fails. Cleans up both test users
// afterward either way.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

function randomEmail(label) {
  return `rls-test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

async function createTestUser(label) {
  const email = randomEmail(label);
  const password = `Test-${Math.random().toString(36).slice(2)}-pw!`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create test user ${label}: ${error?.message}`);
  }
  return { id: data.user.id, email, password };
}

async function signInAsUser(user) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });
  if (error) {
    throw new Error(`Failed to sign in as ${user.email}: ${error.message}`);
  }
  return client;
}

async function main() {
  const userA = await createTestUser("a");
  const userB = await createTestUser("b");
  let failures = 0;

  try {
    const clientA = await signInAsUser(userA);

    const { data: session, error: sessionError } = await clientA
      .from("sessions")
      .insert({
        decision_type: "Career",
        decision_text: "RLS verification session",
        status: "completed",
        anon_token: "rls-test",
        user_id: userA.id,
      })
      .select("id")
      .single();
    if (sessionError || !session) {
      throw new Error(`Failed to create test session as user A: ${sessionError?.message}`);
    }

    const { data: plan, error: planError } = await clientA
      .from("plans")
      .insert({
        session_id: session.id,
        user_id: userA.id,
        plan: {
          decision: "Test decision",
          why_it_fits: ["a", "b", "c"],
          first_step: "Do the thing",
          watch_out_for: "Nothing in particular",
          reflection_line: "You've got this.",
        },
      })
      .select("id")
      .single();
    if (planError || !plan) {
      throw new Error(`Failed to create test plan as user A: ${planError?.message}`);
    }

    console.log(`User A created plan ${plan.id}. Confirming user A can read it back...`);
    const { data: ownRead, error: ownReadError } = await clientA
      .from("plans")
      .select("id")
      .eq("id", plan.id)
      .maybeSingle();
    if (ownReadError || !ownRead) {
      console.error("FAIL: user A could not read their own plan — RLS policy is too strict.");
      failures += 1;
    } else {
      console.log("PASS: user A can read their own plan.");
    }

    console.log("Attempting to read user A's plan as user B...");
    const clientB = await signInAsUser(userB);
    const { data: crossRead, error: crossReadError } = await clientB
      .from("plans")
      .select("id")
      .eq("id", plan.id)
      .maybeSingle();

    if (crossReadError) {
      console.log(`PASS: cross-user read errored as expected (${crossReadError.message}).`);
    } else if (crossRead) {
      console.error("FAIL: user B was able to read user A's plan. RLS is not working.");
      failures += 1;
    } else {
      console.log("PASS: cross-user read returned no rows.");
    }
  } finally {
    await admin.auth.admin.deleteUser(userA.id).catch(() => {});
    await admin.auth.admin.deleteUser(userB.id).catch(() => {});
    console.log("Cleaned up test users.");
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll RLS checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
