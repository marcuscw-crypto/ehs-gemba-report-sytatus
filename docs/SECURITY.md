# Security

## Secret Handling
- `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` stored in Vercel environment variables only
- Frontend uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only — no service key ever sent to browser
- All AI calls made server-side (Next.js server actions or API routes)

## Permission Model (v1 → lock-down)
- **v1:** permissive RLS (read/write open) for demo — no sensitive data yet
- **Sprint 4 lock-down:** `auth.uid() = user_id` RLS policies replace v1 policies; writes require authenticated session; service role used only in server actions, never in client code

## Approved Tools Rule
- Agents may only call named tools (`categorise_finding`, `flag_overdue_reports`, `draft_status_change`)
- No `run_any` / `eval` / raw SQL execution from agent context
- Every agent action inherits the calling user's session permissions

## Audit Principle
- Every status change, assignee change, and AI action writes a row to `report_activities` with `actor_name`, `activity_type`, `old_value`, `new_value`, and `created_at`
- Audit rows are append-only; no delete policy on `report_activities`
- Before adding real sensitive data: complete Sprint 4 lock-down and have a second person verify RLS policies are not permissive
