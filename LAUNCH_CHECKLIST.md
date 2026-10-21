# Launch checklist

Everything to confirm before pointing real traffic at Clarity in production.

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)

Set all of these for the **Production** environment (and Preview, if you want preview deploys to work against a real/staging Supabase project).

| Variable | Where it comes from | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API | Public, safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API | Public, RLS-governed |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API | **Secret.** Bypasses RLS — never expose client-side (already confined to server-only code; see §6 below) |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Secret |
| `CLAUDE_MODEL` | e.g. `claude-opus-4-8` | Pick a real model id — the app throws on startup if this is unset. `lib/admin/pricing.ts` has rates for the Claude 5/4.6+ family; if you pick something outside that list, admin cost estimates silently fall back to Sonnet 5 rates |
| `RESEND_API_KEY` | resend.com → API Keys | Secret |
| `RESEND_FROM_EMAIL` | e.g. `Clarity <checkins@yourdomain.com>` | Must be an address on a domain verified in Resend (§4) |
| `CHECK_IN_TOKEN_SECRET` | generate a long random string (`openssl rand -hex 32`) | Secret — signs the 30-day check-in email links. Never rotate this without expecting all outstanding check-in links to stop verifying |
| `NEXT_PUBLIC_POSTHOG_KEY` | posthog.com project settings | Public |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://us.i.posthog.com` | Public |
| `CRON_SECRET` | generate a long random string | Secret — protects `/api/cron/check-ins`. Vercel Cron sends this automatically as a Bearer token if the var is set; nothing else to configure |
| `ADMIN_EMAIL` | your own email | Gates `/admin` — must exactly match the email on your Supabase auth account |
| `DAILY_AI_CALL_LIMIT` | a number, e.g. `500` | **Set this before launch.** If unset, there's no cap at all — see §5 |
| `NEXT_PUBLIC_SITE_URL` | your production domain, e.g. `https://clarity.app` | Used for `metadataBase` (Open Graph/Twitter image URLs) and the OAuth/magic-link callback URL. Must be the real production URL, not `localhost` |

`NODE_ENV=production` is set automatically by Vercel — don't set it manually.

## 2. Database migrations

Run every file in `supabase/migrations/` against the production Supabase project, in order, via the Supabase CLI (`supabase db push`) or the SQL editor:

```
20260101000000_create_waitlist.sql
20260103000000_create_sessions.sql
20260104000000_create_messages_and_usage.sql
20260105000000_create_plans.sql
20260107000000_add_auth_and_profiles.sql
20260109000000_add_check_ins.sql
20260111000000_add_card_downloaded.sql
```

Confirm RLS afterward (Supabase dashboard → Database → Tables → each table should show the RLS badge as **on**): `waitlist`, `sessions`, `messages`, `usage`, `plans`, `profiles`, `check_ins` all enable RLS. `profiles`, `sessions`, `plans`, `messages`, `usage` additionally carry real `auth.uid()`-scoped policies; the rest are deliberately deny-all (service-role only).

## 3. Supabase Auth settings

In the Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: your production domain (same value as `NEXT_PUBLIC_SITE_URL`)
- **Redirect URLs**: add `https://yourdomain.com/auth/callback` (the exact route `app/auth/callback/route.ts` handles). Keep `http://localhost:3000/auth/callback` in the list too if you still want local dev sign-in to work against this project.

In Authentication → Providers → Google:
- Enable the provider, add your Google OAuth Client ID/Secret (from Google Cloud Console → APIs & Services → Credentials).
- In the Google Cloud Console OAuth client, add `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI (this is Supabase's own callback, not the app's — Supabase then forwards to your app's `/auth/callback`).

Email (magic link) sign-in uses Supabase's built-in email OTP — no extra provider setup needed, but confirm Authentication → Email templates / rate limits are reasonable for your expected volume (Supabase has its own project-wide OTP rate limit independent of this app's own per-IP limiter in `lib/auth/rate-limit.ts`).

## 4. Resend domain

- Add and verify your sending domain in the Resend dashboard (SPF/DKIM DNS records). Don't send from an unverified domain — those sends fail or land in spam.
- `RESEND_FROM_EMAIL` must use that verified domain.
- Send a real test via the dev-only `/api/dev/test-check-in` route locally against a staging Supabase project before relying on the scheduled cron.

## 5. Cost-safety settings

- **`DAILY_AI_CALL_LIMIT`**: set this to a real number before launch. Unset means unlimited — the app won't stop you from an unbounded Anthropic bill. The limit counts rows in the `usage` table created since UTC midnight, which both the message route and the plan-generation route now write to on every Claude call.
- The 10-message-per-session cap (`lib/messages/validate.ts`) and both routes' `max_tokens` (400 for messages, 1000 for plan generation) are already hardcoded server-side — no action needed there.
- Rate limits are in-memory per server instance (`lib/rate-limit.ts`) — they reset on redeploy/cold start and aren't shared across serverless instances. Fine as a basic deterrent at launch scale; if abuse becomes a real problem, swap in a shared store (e.g. Upstash Redis).

## 6. Cron job

`vercel.json` already defines a daily cron hitting `/api/cron/check-ins` at 13:00 UTC. This activates automatically on deploy to Vercel — no dashboard configuration needed beyond having `CRON_SECRET` set. Confirm it fired by checking Vercel → your project → Cron Jobs after the first scheduled run, or by hitting the route manually with `Authorization: Bearer $CRON_SECRET` first.

## 7. Final pre-launch checks

- [ ] `npm run lint && npm run typecheck && npm test` all pass
- [ ] `npm run build` succeeds with real production env vars set (not just this sandbox's absent ones)
- [ ] `scripts/verify-rls.mjs` run once against the production Supabase project, confirming one user genuinely can't read another's plan
- [ ] A real sign-in (Google and magic link) completes end-to-end against the production domain and lands on `/account`
- [ ] A real check-in email sends and its Yes/Partly/Not-yet links work
- [ ] `/admin` opens for `ADMIN_EMAIL` and 404s for everyone else
- [ ] `/privacy` and `/terms` have been reviewed and the "Draft — not yet reviewed" banners removed once that review happens
