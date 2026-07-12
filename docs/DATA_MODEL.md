# Data Model

## teams
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable; owner at lock-down |
| name | text | e.g. "EHS Operations" |
| department | text | |
| created_at | timestamptz | |

## gemba_reports
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable; set to auth.uid() at lock-down |
| team_id | uuid FK → teams | |
| title | text | short label for the finding |
| location | text | e.g. "Warehouse B – East Wing" |
| finding_text | text | full description |
| severity | text | low / medium / high / critical |
| status | text | open / in_progress / closed |
| assigned_to | text | team member name (free text v1) |
| reported_by | text | |
| due_date | date | |
| finding_category | text | **AI field** |
| finding_category_source | text | 'ai' or 'human' |
| finding_category_confidence | numeric | 0–1 |
| finding_category_review_status | text | unreviewed / accepted / overridden |
| created_at | timestamptz | |

## report_activities
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| report_id | uuid FK → gemba_reports ON DELETE CASCADE | |
| activity_type | text | status_change / assignee_change / comment |
| old_value | text | nullable |
| new_value | text | nullable |
| note | text | nullable |
| actor_name | text | who made the change |
| created_at | timestamptz | |

## RLS
All tables: permissive v1 policies (select/all using true). Replaced with `auth.uid() = user_id` at Sprint 4 lock-down.
