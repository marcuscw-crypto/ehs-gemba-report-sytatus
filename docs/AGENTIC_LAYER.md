# Agentic Layer

## Risk Levels & Actions

### Low risk — auto-execute
- Tag `finding_category` from `finding_text` via OpenAI (stored with confidence + review_status)
- Flag report as overdue when due_date passes with status ≠ closed
- Sort/rank dashboard list by severity + overdue

### Medium risk — light approval before execution
- Reassign report to a different team member (agent drafts, user confirms)
- Change report status in bulk (agent proposes, user approves list)

### High risk — explicit human approval required
- Send external notification (email/Slack) about an overdue finding
- Escalate a critical finding to department head

### Critical — human-only, no agent involvement
- Delete a report or permanently close a finding with data loss
- Any action with regulatory/legal audit implications

## Named Tools (approved)
- `categorise_finding(finding_text)` → returns category, confidence
- `flag_overdue_reports()` → returns list of report IDs past due_date
- `draft_status_change(report_id, new_status)` → draft for human approval

## Audit Log Fields (report_activities)
`activity_type`, `old_value`, `new_value`, `actor_name`, `created_at` — every meaningful change written here.

## v1 vs Later
- **v1:** no agentic actions; rule-based overdue flag only
- **Sprint 5:** auto-categorisation (low risk, auto)
- **Later:** approval flows for reassign and escalate
