'use client'

import { ACTION_ICONS } from '@/lib/rpg'

interface HistoryEntry {
  id: string
  xp_earned: number
  stats_earned: Record<string, number>
  completed_at: string
  actions: {
    name: string
    icon: string
  }
}

interface ActivityCalendarProps {
  history: HistoryEntry[]
}

export function ActivityCalendar({ history }: ActivityCalendarProps) {
  if (history.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-text-muted text-sm">
          No activities logged yet. Start logging actions to build your history.
        </p>
      </div>
    )
  }

  // Group by date
  const grouped: Record<string, HistoryEntry[]> = {}
  for (const entry of history) {
    const date = new Date(entry.completed_at).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(entry)
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, entries]) => (
        <div key={date} className="animate-fade-in-up">
          <h3 className="font-heading text-sm font-semibold text-magic mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-magic animate-pulse-glow" />
            {date}
          </h3>
          <div className="space-y-2 ml-4 border-l border-border pl-4">
            {entries.map((entry) => {
              const statsText = Object.entries(entry.stats_earned || {})
                .map(([stat, val]) => `+${val} ${stat}`)
                .join(', ')
              const time = new Date(entry.completed_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div
                  key={entry.id}
                  className="glass rounded-lg p-3 glass-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {ACTION_ICONS[entry.actions?.icon] || '\u2694\uFE0F'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {entry.actions?.name || 'Unknown Action'}
                        </div>
                        <div className="text-xs text-text-muted">
                          {time}
                          {statsText && ` \u2022 ${statsText}`}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-success">
                      +{entry.xp_earned} XP
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
