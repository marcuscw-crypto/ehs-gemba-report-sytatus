# Tasks & Sprints

## Sprint 1 — Database, seed data, and report logging
**Goal:** The database is live, demo data is visible, and a real report can be logged.

- [ ] Apply migration SQL to Supabase project
- [ ] Verify 6 seed reports appear in Supabase table viewer
- [ ] Build `/reports` page: table of all gemba_reports, status badge, severity chip, assigned_to, due_date
- [ ] Handle all states on `/reports`: loading skeleton, empty ("No reports yet — log the first one"), error toast
- [ ] Build "Log New Report" form: title, location, finding_text, severity (select), assigned_to, due_date
- [ ] Form submits → inserts row into `gemba_reports` → redirects to `/reports/[id]`
- [ ] Build `/reports/[id]` detail page: all fields + activity log from `report_activities`
- [ ] Handle empty activity log state on detail page

**Definition of Done:** Visiting `/reports` without login shows seed data. Submitting the form creates a real DB row that appears in the list. `/reports/[id]` loads the correct report.

---

## Sprint 2 — Status updates and shared dashboard ✦ v1 functional milestone ✦
**Goal:** The core workflow runs end-to-end: log → update → shared view.

- [ ] Status update control on detail page (Open / In Progress / Closed) — persists to DB
- [ ] Assignee update dropdown on detail page — persists to DB
- [ ] Every status/assignee change writes a row to `report_activities` with actor_name, old_value, new_value
- [ ] Dashboard summary cards at top of `/reports`: Open count, In Progress count, Closed count, Overdue count
- [ ] Overdue flag: reports where due_date < today and status ≠ 'closed' shown with red indicator
- [ ] Default sort: critical/high severity first, then overdue, then newest
- [ ] No dead buttons — every interactive element does something and reflects in UI

**Definition of Done:** Full success scenario passes — log report, update status, see change in shared list and activity log, all without login.

---

## Sprint 3 — Comments, filters, and team context
**Goal:** Team can communicate on a finding and find records quickly.

- [ ] Comment input on detail page → inserts into `report_activities` with `activity_type='comment'`
- [ ] Comments render chronologically in activity log with actor_name and timestamp
- [ ] Filter bar on `/reports`: status, severity, location (text match), assigned_to
- [ ] Empty state when filters return no results: "No reports match these filters"
- [ ] Team name from `teams` table displayed in app header

**Definition of Done:** User can post a comment and filter the list; both persist and reflect correctly.

---

## Sprint 4 — Lock it down (auth + per-user RLS)
**Goal:** Real users can log in; data is owner-scoped; app is safe for real operational data.

- [ ] Supabase Auth enabled; `/login` and `/signup` pages built
- [ ] `user_id` set to `auth.uid()` on all new inserts
- [ ] Replace all `v1` permissive RLS policies with `auth.uid() = user_id` policies
- [ ] Unauthenticated users redirected from write actions; read-only public view optional
- [ ] Verify no service role key in any client bundle (check Network tab)
- [ ] Second-person review of RLS policies before any real data is entered

**Definition of Done:** An unauthenticated request cannot insert or update rows. Two logged-in users each see only their team's data. No secrets in browser.

---

## Sprint 5 — AI auto-tagging and smart features
**Goal:** AI reduces manual categorisation burden; overdue logic is automated.

- [ ] Server action calls `categorise_finding(finding_text)` on report creation
- [ ] Result stored in `finding_category`, `_source`, `_confidence`, `_review_status`
- [ ] Review queue on dashboard: findings with `review_status='unreviewed'` and confidence < 0.75
- [ ] Accept / Override buttons write to DB and set `review_status`
- [ ] Trend mini-chart: findings closed per week (last 8 weeks)

**Definition of Done:** A new report gets an AI category within 3 seconds. Accept/Override persists. Chart renders with real data.

---

## Gantt (sprint → deliverable)
```
Sprint 1  |  DB schema · seed data · /reports list · log form · detail page
Sprint 2  |  Status updates · activity log · dashboard cards · overdue flag  ← v1 functional
Sprint 3  |  Comments · filters · team header
Sprint 4  |  Auth · RLS lock-down · security audit
Sprint 5  |  AI tagging · review queue · trend chart
```
