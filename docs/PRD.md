# EHS Gemba Report Status — PRD

## Problem
The EHS team tracks gemba walk findings, corrective action owners, and closure statuses across spreadsheets and chat messages. The shared view is always stale; nothing is auditable; follow-up falls through the cracks.

## Target User
EHS team members and supervisors in a single department — 3–10 people logging and resolving findings daily.

## Core Objects
- **Gemba Report** — the unit of work: a finding from a walk with location, severity, owner, status, and due date.
- **Report Activity** — every status change, assignee change, and comment on a report.
- **Team** — the department context linking members and reports.

## MVP Must-Haves (v1)
- [ ] Log a new gemba report (location, finding, severity, assigned to, due date)
- [ ] Dashboard list of all reports with status badges
- [ ] Update a report's status (Open → In Progress → Closed) and assignee
- [ ] Activity log visible on each report detail page
- [ ] Seed demo data so the app is usable on first load without a login

## Non-Goals (v1)
- Email or Slack notifications
- Per-user login and data isolation (scheduled for Sprint 4)
- PDF/CSV export
- AI auto-tagging (Sprint 5)
- Mobile-native app

## Success Criteria
**End-to-end pass:** A team member opens the app, sees existing open reports on the dashboard, clicks "Log New Report," fills in a finding from today's walk, submits it, and immediately sees it appear in the shared list with status "Open" — without refreshing the page or touching a spreadsheet.

## Definition of Done
The above scenario completes against the live database. Every status update button persists and reflects in the UI. No screen is read-only seed data only. Empty, loading, and error states render correctly on every page.
