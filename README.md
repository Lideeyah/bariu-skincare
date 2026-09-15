# Bariu Skincare Test

A two-sided skincare quiz:

- **`/`** and **`/test`** — Bariu takes the test on his phone/computer. Questions
  are checkbox-style (more than one option can be picked, though the test
  doesn't advertise that so it stays quick to fill out). He sees a
  confirmation screen once it's submitted.
- **`/results`** — password-protected page where you can see every submission
  and Bariu's full set of answers.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, with Supabase as the
database.

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run the contents of `supabase/schema.sql` to
   create the `submissions` table.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase
     project's **Settings → API** page.
   - `ADMIN_PASSWORD` — whatever password you want to use to view results.
   - `ADMIN_SESSION_SECRET` — any long random string
     (`openssl rand -hex 32` works well).
4. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:3000` for the test, and
   `http://localhost:3000/results` to view submissions (you'll be asked for
   `ADMIN_PASSWORD`).

## Deploying

This app works on any Next.js host (Vercel, Netlify, etc.) since all data
lives in Supabase rather than on local disk — set the same four environment
variables in your host's project settings.

## Adding more questions

All quiz content lives in `src/data/quiz.ts` as a list of sections, each with
a list of questions. Add a new section/question there and it automatically
shows up in the test flow and in the results view — no other files need to
change unless a question needs custom conditional logic like question 9's
follow-up.

The service role key in `SUPABASE_SERVICE_ROLE_KEY` is only ever used from
server-side code (API routes and server components) and is never sent to the
browser, so submissions stay private to whoever knows `ADMIN_PASSWORD`.
