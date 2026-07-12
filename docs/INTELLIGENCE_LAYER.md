# Intelligence Layer

## Messy Input
Free-text `finding_text` entered by team members: "spill kit missing," "blocked exit," "PPE low" — inconsistent phrasing, no enforced vocabulary.

## Auto-Structure Schema (AI output)
```json
{
  "finding_category": "Spill Prevention",
  "source": "ai",
  "confidence": 0.91,
  "review_status": "unreviewed"
}
```
Stored directly on `gemba_reports`. Human can accept or override in the review queue.

## Events to Track
- Report created (trigger AI categorisation)
- Category accepted or overridden (feedback for future tuning)
- Status unchanged for 7+ days (overdue flag)

## Scoring Rules (rule-based first)
- **Overdue score:** days_open > due_date → flagged red, surfaced at top of dashboard
- **Severity weight:** critical=4, high=3, medium=2, low=1 — used for sort order
- AI confidence < 0.75 → always stays `review_status = unreviewed`; surfaced for human review

## What Gets Ranked
- Dashboard default sort: severity weight DESC, then overdue flag, then created_at DESC

## v1 vs Later
- **v1:** rule-based overdue flag and severity sort only
- **Sprint 5:** AI `finding_category` tagging + review queue
- **Later:** pattern detection across locations (recurring hazard areas)
