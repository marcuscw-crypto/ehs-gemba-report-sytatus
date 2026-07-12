# Test Plan

## v1 Success Scenario (manual)
1. Open `/reports` — confirm 6 seed reports visible with status badges and severity chips
2. Click "Log New Report" — confirm form loads with all fields (title, location, finding_text, severity, assigned_to, due_date)
3. Submit a new report with severity=high, status defaults to 'open' — confirm redirect to `/reports/[id]`
4. On detail page: confirm all submitted fields display correctly
5. Change status to "In Progress" — confirm DB row updated, activity log shows the change with old/new values
6. Change assignee — confirm activity log records the change
7. Return to `/reports` — confirm new report appears in list with correct status badge
8. Confirm dashboard cards show updated Open/In Progress counts

## Empty States
- Delete all reports (or filter to zero results) → `/reports` shows "No reports yet — log the first one" message and Log button
- Open a report with no activity → detail page shows "No activity yet" placeholder, not a blank section

## Error Cases
- Submit Log form with required fields blank → inline validation messages appear; no DB call made
- Simulate Supabase offline (disable network) → `/reports` shows error toast "Could not load reports. Try refreshing."
- Navigate to `/reports/nonexistent-id` → 404 page with "Report not found" message and link back to dashboard

## Data Integrity
- After status update: query `report_activities` in Supabase — confirm row exists with correct `report_id`, `old_value`, `new_value`, `actor_name`
- Confirm no `service_role` key appears in browser Network tab on any page load

## Overdue Flag
- Set a report's `due_date` to yesterday with status='open' → confirm red overdue indicator appears on dashboard list and detail page
