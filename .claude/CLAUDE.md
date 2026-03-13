# FlexAI — Claude Code Guide

> AI-powered workout plan generator built with Next.js, Groq AI, and Supabase.

---

## What This App Does

FlexAI lets users generate personalized workout plans in seconds. A user provides their name, age, and fitness goal — the app calls the Groq AI API (Llama 3.3-70B), parses the structured response, and renders an exercise plan with YouTube tutorial links. Plans can be saved to Supabase and browsed later.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack React Query v5 |
| Database | Supabase (PostgreSQL) |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## Project Structure

```
flexai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (nav + footer)
│   ├── providers.tsx               # React Query provider
│   ├── api/
│   │   └── generate-workout/
│   │       └── route.ts            # POST — AI workout generation
│   └── workouts/
│       ├── page.tsx                # Saved workouts list
│       ├── new/
│       │   ├── page.tsx            # Workout creation form + result
│       │   ├── types.ts            # Exercise type definitions
│       │   └── schema/
│       │       └── formSchema.ts   # Zod validation schema
│       └── [id]/
│           └── page.tsx            # Workout detail view
├── components/
│   └── ui/                         # shadcn/ui component library
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── workout.ts                  # DB operations (save / fetch / fetchById)
│   ├── utils.ts                    # cn() helper + AI response parser
│   ├── youtube.ts                  # YouTube thumbnail extraction
│   ├── types.ts                    # Shared TypeScript types
│   └── constants.ts                # App-wide constants
└── public/                         # Static assets
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

---

## Key Data Flow

```
User submits form (name, age, goal)
  → POST /api/generate-workout
  → Groq API generates structured workout text
  → parseWorkoutPlanText() in lib/utils.ts parses exercises
  → UI renders exercises with YouTube thumbnails
  → User saves → saveWorkout() in lib/workout.ts → Supabase
```

### AI Response Format

The Groq prompt instructs the model to use `---` as a block delimiter, with each exercise block using:

```
EXERCISE: Push-ups
SETS: 3
REPS: 15
VIDEO: https://www.youtube.com/watch?v=IODxDxX7oi4
---
```

`parseWorkoutPlanText()` in `lib/utils.ts` splits on `---`, regex-extracts the four markers, and returns `{ introText, exercises }`. The first block without markers becomes `introText`.

---

## Database Schema

The `workout_plans` table in Supabase (table name defined in `lib/constants.ts`):

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key (auto-generated) |
| `username` | text | User's name |
| `age` | int | User's age |
| `workout_goal` | text | Fitness goal |
| `intro_text` | text | AI-generated intro paragraph |
| `plan_text` | text | Raw full AI response |
| `exercises` | jsonb | Parsed `Exercise[]` array |
| `created_at` | timestamp | Auto-generated |

---

## Component Conventions

- **Server Components** by default — add `"use client"` only when hooks or browser APIs are needed.
- **shadcn/ui** for all base UI — extend via Tailwind classes, never override component internals.
- **Framer Motion** for page transitions and interactive element animations.
- **React Query** handles all async data fetching — avoid `useEffect` for data calls.
- **Zod schemas** live in `schema/` subdirectories next to the forms they validate.

---

## Coding Guidelines

- Keep API routes thin — business logic belongs in `lib/`.
- Use `cn()` from `lib/utils.ts` for conditional class merging.
- All database operations go through `lib/workout.ts` — no direct Supabase calls in components.
- YouTube utilities are isolated in `lib/youtube.ts` — use `getYouTubeThumbnail(url)` for thumbnails.
- Prefer `pnpm` — do not use `npm` or `yarn`.

---

## Improvements & TODOs

- [ ] Add user authentication (Supabase Auth)
- [ ] Workout history per user
- [ ] Exercise difficulty filtering
- [ ] Export workout plan as PDF
- [ ] Dark mode support
- [ ] Rate limiting on the AI generation endpoint
- [ ] Add `NEXT_PUBLIC_` env validation with `zod`
