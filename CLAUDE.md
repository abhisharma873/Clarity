# Clarity
A clarity app for big life decisions (career, job offers, moving abroad,
what to study). Positioning: "A clarity session, not a prediction."

## Lenses
- Reflection: no numbers, values and decision questions only.
- Numerology: Pythagorean and Chaldean numbers as a starting point for reflection.

## Stack
Next.js App Router + TypeScript + Tailwind, Supabase (database + auth),
Anthropic Claude API (model id from env var CLAUDE_MODEL), Resend (email),
PostHog (analytics), Vercel (hosting).

## Hard rules
- Numerology math is pure TypeScript with unit tests. The AI never calculates numbers.
- The AI only asks reflective questions and writes the clarity plan.
- No predictions, no remedies, no gemstones, no fear language.
- No religious claims, no scripture quotes, no religious rulings.
- No medical, legal, or financial advice. If a user sounds distressed,
  respond with care and point them to real help.
- Max 10 AI messages per session, enforced on the server.
- Store minimal personal data. Users can delete everything with one click.
- All secrets in .env.local only. Never commit secrets.
- Mobile first. Simple, calm, warm design.

## Workflow
- Build one phase at a time. Propose a plan before writing code.
- Write tests for logic. Run lint and tests before finishing a phase.
