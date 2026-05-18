## 📌 Project Overview
KnowMe is a zero-friction, no-login viral text game designed to test how well friends know each other. A Host creates a 10-question flashcard quiz about themselves, shares a unique link, and watches a real-time leaderboard as friends try to guess the correct answers.

---

## 🎨 UI/UX Design & Aesthetic
- **Theme:** Premium Dark Mode ("Dark Vibe") with a Light/Dark toggle.
- **Base Colors:** Background `#09090b` (zinc-950), Text `zinc-50` / `zinc-400`.
- **Accents:** Neon violet/purple gradients (`from-violet-600 to-purple-600`) with soft glowing drop shadows.
- **Components:** Shadcn-inspired. Glassmorphic translucent cards (`bg-zinc-900/30`), subtle borders (`border-zinc-800`).
- **Animations:** Hardware-accelerated micro-interactions using `framer-motion` (`AnimatePresence` with `mode="wait"` to prevent layout shift).
- **Structure:** Minimalist top navbar, centered hero/wizard floating card, 3-column bento-box feature grid.

---

## 🏗️ Current Architecture
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`.
- **State/Auth:** **Dual Token Obfuscation.** Zero user accounts. The host receives a public `quizId` and a private `ownerToken` saved in `localStorage`. 
- **Backend:** Next.js Server Actions. Uses Supabase Service Role Key to bypass RLS and execute secure server-side mutations.
- **Database:** Supabase (Managed PostgreSQL).
- **Validation:** Zod (Strict server and client payload validation).

---

## ✅ Completed Features
1. **Database Foundation:** PostgreSQL schema designed, provisioned, and indexed on Supabase.
2. **Static Asset Engine:** 150-question flat array randomized dynamically on the client (`Math.random()`).
3. **Core Primitives:** Accessible, dark-theme-ready `Button`, `Input`, and `ThemeToggle` (using `next-themes`).
4. **Server Actions (API Contracts):**
   - `createQuiz`: Batch inserts root quiz and 10+ questions securely.
   - `submitResponse`: Grades guest answers server-side to prevent client-side network inspection cheating.
5. **Host Creation Wizard (`/`):** Framer-motion powered multi-step form (Name capture -> 10 randomized questions -> Answer lockdown).
6. **Host Dashboard (`/host/[quizId]`):** Real-time leaderboard view and clipboard-enabled share card.
7. **Guest Gameplay Engine (`/play/[quizId]`):** Secure flashcard runner. Fetches questions (without correct answers), captures guest inputs, and reveals final score.

---

## 🚧 Pending Tasks & Next Steps
1. **Security & Rate Limiting:** Implement Next.js Middleware to throttle IP requests (e.g., max 5 quizzes/hr, 20 submissions/min) to prevent database spam.
2. **Production Deployment:** Push to GitHub and deploy to Vercel. Ensure Vercel Environment Variables match local `.env.local`.
3. **Social Sharing Metadata:** Add OpenGraph (OG) image generation for rich link previews in iMessage/WhatsApp.
4. **Real-time Sync (Optional):** Upgrade the Host Dashboard from a static Server Component to a Supabase Realtime subscription to watch scores roll in live without refreshing.

---

## 🔑 Key Architectural Decisions & Constraints
- **Zero Accounts:** Frictionless entry. No passwords, no emails.
- **Server-Side Anti-Cheat:** The `GET /play/[quizId]` route explicitly omits the `correct_answer` column. Scoring logic runs securely inside the `submitResponse` Server Action using a temporary Map lookup.
- **Batch Insertion:** Quiz questions are inserted via a single network round-trip array payload to prevent Supabase connection lags.
- **Error Boundaries & Cleanup:** If a question batch fails to insert, the root quiz record is deleted to prevent orphaned data.

---

## 🗄️ Database Structure (Supabase PostgreSQL)
```sql
-- 1. quizzes
id (UUID, PK) | host_name (VARCHAR) | owner_token (UUID) | created_at (TIMESTAMP)

-- 2. quiz_questions
id (BIGINT, PK) | quiz_id (UUID, FK) | question_text (TEXT) | correct_answer (TEXT) | sort_order (INT)

-- 3. guest_responses
id (BIGINT, PK) | quiz_id (UUID, FK) | guest_name (VARCHAR) | score (INT) | total_questions (INT) | completed_at (TIMESTAMP)