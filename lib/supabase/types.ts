export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type Status = 'open' | 'in_progress' | 'closed'
export type ActivityType = 'status_change' | 'assignee_change' | 'comment'

export interface Team {
  id: string
  user_id: string | null
  name: string
  department: string | null
  created_at: string
}

export interface GembaReport {
  id: string
  user_id: string | null
  team_id: string | null
  title: string
  location: string
  finding_text: string
  severity: Severity
  status: Status
  assigned_to: string | null
  reported_by: string | null
  due_date: string | null
  finding_category: string | null
  finding_category_source: string | null
  finding_category_confidence: number | null
  finding_category_review_status: string | null
  created_at: string
  teams?: { name: string } | null
}

export interface ReportActivity {
  id: string
  user_id: string | null
  report_id: string
  activity_type: ActivityType
  old_value: string | null
  new_value: string | null
  note: string | null
  actor_name: string | null
  created_at: string
}
