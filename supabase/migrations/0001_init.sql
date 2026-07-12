create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  department text,
  created_at timestamptz not null default now()
);

alter table teams enable row level security;
drop policy if exists "teams_v1_read" on teams;
create policy "teams_v1_read" on teams for select using (true);
drop policy if exists "teams_v1_write" on teams;
create policy "teams_v1_write" on teams for all using (true) with check (true);

insert into teams (id, name, department) values
  ('a1000000-0000-0000-0000-000000000001', 'EHS Operations', 'Environment Health & Safety'),
  ('a1000000-0000-0000-0000-000000000002', 'Facilities & Maintenance', 'Operations')
on conflict (id) do nothing;

create table if not exists gemba_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  team_id uuid references teams(id),
  title text not null,
  location text not null,
  finding_text text not null,
  severity text not null default 'medium',
  status text not null default 'open',
  assigned_to text,
  reported_by text,
  due_date date,
  finding_category text,
  finding_category_source text,
  finding_category_confidence numeric,
  finding_category_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table gemba_reports enable row level security;
drop policy if exists "gemba_reports_v1_read" on gemba_reports;
create policy "gemba_reports_v1_read" on gemba_reports for select using (true);
drop policy if exists "gemba_reports_v1_write" on gemba_reports;
create policy "gemba_reports_v1_write" on gemba_reports for all using (true) with check (true);

insert into gemba_reports (id, team_id, title, location, finding_text, severity, status, assigned_to, reported_by, due_date, finding_category, finding_category_source, finding_category_confidence, finding_category_review_status) values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Spill kit missing from Line 3', 'Production Floor – Line 3', 'Spill containment kit was not present at the designated station. Area lead unaware of last inspection date.', 'high', 'open', 'Maria Santos', 'James Owusu', current_date + 3, 'Spill Prevention', 'ai', 0.91, 'unreviewed'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Blocked emergency exit – Warehouse B', 'Warehouse B – East Wing', 'Stacked pallets partially obstructing emergency exit door. Fire door cannot open fully.', 'critical', 'in_progress', 'Derek Chow', 'Maria Santos', current_date + 1, 'Emergency Egress', 'ai', 0.97, 'accepted'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'PPE station restocking needed', 'Assembly Area – Station 7', 'Glove dispenser empty, safety glasses low. Workers observed without PPE.', 'medium', 'open', 'Priya Nair', 'Derek Chow', current_date + 5, 'PPE Compliance', 'ai', 0.88, 'unreviewed'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Forklift charging cables on walkway', 'Logistics Bay – Charging Zone', 'Two forklift charging cables lying across the pedestrian walkway, creating a trip hazard.', 'high', 'in_progress', 'James Owusu', 'Priya Nair', current_date + 2, 'Trip Hazard', 'ai', 0.93, 'accepted'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Chemical SDS sheets outdated', 'Chemical Storage Room', 'Safety Data Sheets for three solvents are from 2019. Current versions required per policy.', 'medium', 'closed', 'Maria Santos', 'James Owusu', current_date - 2, 'Chemical Safety', 'ai', 0.85, 'accepted'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Noise level signage missing – Compressor Room', 'Compressor Room', 'No hearing protection required signage at room entry. Noise readings consistently above 85 dB.', 'medium', 'open', 'Derek Chow', 'Maria Santos', current_date + 7, 'Noise Exposure', 'ai', 0.89, 'unreviewed')
on conflict (id) do nothing;

create table if not exists report_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references gemba_reports(id) on delete cascade,
  activity_type text not null,
  old_value text,
  new_value text,
  note text,
  actor_name text,
  created_at timestamptz not null default now()
);

alter table report_activities enable row level security;
drop policy if exists "report_activities_v1_read" on report_activities;
create policy "report_activities_v1_read" on report_activities for select using (true);
drop policy if exists "report_activities_v1_write" on report_activities;
create policy "report_activities_v1_write" on report_activities for all using (true) with check (true);

insert into report_activities (report_id, activity_type, old_value, new_value, actor_name, note) values
  ('b1000000-0000-0000-0000-000000000002', 'status_change', 'open', 'in_progress', 'Derek Chow', 'Pallets being relocated to storage, will clear by end of shift.'),
  ('b1000000-0000-0000-0000-000000000004', 'status_change', 'open', 'in_progress', 'James Owusu', 'Maintenance notified; cable management clips ordered.'),
  ('b1000000-0000-0000-0000-000000000005', 'status_change', 'open', 'closed', 'Maria Santos', 'Updated SDS sheets printed and posted. Verified correct versions.'),
  ('b1000000-0000-0000-0000-000000000005', 'comment', null, null, 'James Owusu', 'Good catch — scheduling quarterly SDS audit going forward.')
on conflict (id) do nothing;