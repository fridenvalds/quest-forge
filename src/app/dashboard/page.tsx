'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getTitle } from '@/lib/rpg'
import { XPBar } from '@/components/XPBar'
import { StatsGrid } from '@/components/StatsGrid'
import { CustomStatManager } from '@/components/CustomStatManager'
import { ActionLogger } from '@/components/ActionLogger'

interface Profile {
  id: string
  display_name: string
  total_xp: number
  level: number
  title: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<never[]>([])
  const [actions, setActions] = useState<never[]>([])
  const [customStatCount, setCustomStatCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [profileRes, statsRes, actionsRes, customCountRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('user_stats')
        .select('*, stat_types(*)')
        .eq('user_id', user.id)
        .order('stat_type_id'),
      supabase
        .from('actions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at'),
      supabase
        .from('stat_types')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_custom', true),
    ])

    if (profileRes.data) setProfile(profileRes.data)
    if (statsRes.data) setStats(statsRes.data as never[])
    if (actionsRes.data) setActions(actionsRes.data as never[])
    setCustomStatCount(customCountRes.count || 0)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-glow">&#x2694;&#xFE0F;</div>
          <p className="text-text-muted text-sm">Loading your quest data...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const title = getTitle(profile.level)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              {profile.display_name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-heading font-semibold text-action-glow">
                Level {profile.level}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-magic/20 text-magic font-heading">
                {title}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-heading text-success">
              {profile.total_xp.toLocaleString()}
            </div>
            <div className="text-xs text-text-muted">Total XP</div>
          </div>
        </div>
        <XPBar totalXp={profile.total_xp} level={profile.level} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats + Custom Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span>&#x1F4CA;</span> Character Stats
            </h3>
            <StatsGrid stats={stats} />
          </div>
        </div>

        {/* Right column: Action Logger + Custom Stat */}
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span>&#x26A1;</span> Quick Log
            </h3>
            <ActionLogger actions={actions} onActionLogged={fetchData} />
          </div>

          <CustomStatManager
            userId={profile.id}
            customStatCount={customStatCount}
            onStatAdded={fetchData}
          />
        </div>
      </div>
    </div>
  )
}
