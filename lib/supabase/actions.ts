'use server'

import { createClient } from './server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Severity, Status } from './types'

// ── Reports ─────────────────────────────────────────────────────────────────

export async function getReports() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gemba_reports')
    .select('*, teams(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getReport(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gemba_reports')
    .select('*, teams(name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getActivities(reportId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('report_activities')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getTeams() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('teams').select('*')
  if (error) throw error
  return data ?? []
}

// ── Create report ────────────────────────────────────────────────────────────

export async function createReport(formData: FormData) {
  const supabase = await createClient()

  const teams = await supabase.from('teams').select('id').limit(1).single()
  const teamId = teams.data?.id ?? null

  const payload = {
    team_id: teamId,
    title: formData.get('title') as string,
    location: formData.get('location') as string,
    finding_text: formData.get('finding_text') as string,
    severity: formData.get('severity') as Severity,
    assigned_to: formData.get('assigned_to') as string || null,
    reported_by: formData.get('reported_by') as string || null,
    due_date: formData.get('due_date') as string || null,
    status: 'open' as Status,
  }

  const { data, error } = await supabase
    .from('gemba_reports')
    .insert(payload)
    .select()
    .single()

  if (error) throw error

  // Write creation activity
  await supabase.from('report_activities').insert({
    report_id: data.id,
    activity_type: 'status_change',
    old_value: null,
    new_value: 'open',
    actor_name: payload.reported_by ?? 'Team Member',
    note: 'Report created',
  })

  redirect(`/reports/${data.id}`)
}

// ── Update status ────────────────────────────────────────────────────────────

export async function updateStatus(
  reportId: string,
  oldStatus: string,
  newStatus: Status,
  actorName: string,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('gemba_reports')
    .update({ status: newStatus })
    .eq('id', reportId)
  if (error) throw error

  await supabase.from('report_activities').insert({
    report_id: reportId,
    activity_type: 'status_change',
    old_value: oldStatus,
    new_value: newStatus,
    actor_name: actorName || 'Team Member',
  })

  revalidatePath(`/reports/${reportId}`)
  revalidatePath('/reports')
}

// ── Update assignee ──────────────────────────────────────────────────────────

export async function updateAssignee(
  reportId: string,
  oldAssignee: string | null,
  newAssignee: string,
  actorName: string,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('gemba_reports')
    .update({ assigned_to: newAssignee })
    .eq('id', reportId)
  if (error) throw error

  await supabase.from('report_activities').insert({
    report_id: reportId,
    activity_type: 'assignee_change',
    old_value: oldAssignee,
    new_value: newAssignee,
    actor_name: actorName || 'Team Member',
  })

  revalidatePath(`/reports/${reportId}`)
  revalidatePath('/reports')
}

// ── Add comment ──────────────────────────────────────────────────────────────

export async function addComment(
  reportId: string,
  note: string,
  actorName: string,
) {
  const supabase = await createClient()

  const { error } = await supabase.from('report_activities').insert({
    report_id: reportId,
    activity_type: 'comment',
    note,
    actor_name: actorName || 'Team Member',
  })
  if (error) throw error

  revalidatePath(`/reports/${reportId}`)
}
