'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ActivityCalendar } from '@/components/ActivityCalendar'

export default function HistoryPage() {
  const [history, setHistory] = useState<never[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchHistory = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('action_history')
      .select('*, actions(name, icon)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(200)

    if (data) setHistory(data as never[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-text-muted text-sm">Loading history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Activity Chronicle
        </h2>
        <span className="text-xs text-text-muted">
          {history.length} entries
        </span>
      </div>

      <ActivityCalendar history={history} />
    </div>
  )
}
