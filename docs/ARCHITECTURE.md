# Architecture

## Stack
- **Frontend:** Next.js (App Router) + Tailwind CSS — deployed on Vercel
- **Database + Auth:** Supabase (Postgres, RLS, Auth added Sprint 4)
- **AI features:** OpenAI API, Sprint 5 only — app runs fully without it

## What to Build Now vs Later
**Now:** report CRUD, status transitions, activity log, shared dashboard
**Next:** comments, filters, auth lock-down
**Later:** AI auto-tagging, notifications, trend charts, export

## Key User Action — Step-by-Step
1. Team member opens `/reports` (no login required in v1)
2. Clicks "Log New Report" → form renders
3. Fills in: location, finding text, severity, assigned_to, due_date
4. Submit → Next.js server action calls Supabase `insert` on `gemba_reports`
5. Success → row stored; activity entry written to `report_activities`
6. UI redirects to report detail page; dashboard list updates on next render
7. Any team member opens dashboard — sees the new report in real time

## Layer Plan
1. **Data layer first** — tables, constraints, RLS policies, seed rows
2. **App logic** — forms, status machine (open→in_progress→closed), activity writes
3. **Smart features** — AI category tagging added on top in Sprint 5; removing it leaves the core intact

## Why the Core Runs Without AI
All fields are human-entered. `finding_category` is optional and nullable. Status transitions are enforced by app logic, not the AI model.
