'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ACTION_ICONS } from '@/lib/rpg'

interface Action {
  id: string
  name: string
  xp_reward: number
  icon: string
}

interface ActionLoggerProps {
  actions: Action[]
  onActionLogged: () => void
}

export function ActionLogger({ actions, onActionLogged }: ActionLoggerProps) {
  const [logging, setLogging] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const supabase = createClient()

  async function handleLogAction(actionId: string) {
    setLogging(actionId)
    setFeedback(null)

    try {
      const { data, error } = await supabase.rpc('log_action', { p_action_id: actionId })

      if (error) throw error

      const result = data as { xp_earned: number; level: number; title: string; stats_earned: Record<string, number> }
      const statsText = Object.entries(result.stats_earned || {})
        .map(([stat, val]) => `+${val} ${stat}`)
        .join(', ')

      setFeedback({
        type: 'success',
        message: `+${result.xp_earned} XP${statsText ? ` | ${statsText}` : ''} | Level ${result.level} ${result.title}`,
      })

      onActionLogged()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to log action'
      setFeedback({ type: 'error', message })
    } finally {
      setLogging(null)
    }
  }

  if (actions.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-text-muted text-sm">
          No actions created yet. Visit the{' '}
          <a href="/dashboard/actions" className="text-magic hover:underline">
            Actions page
          </a>{' '}
          to create your first quest action.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feedback && (
        <div
          className={`p-3 rounded-lg text-sm animate-fade-in-up ${
            feedback.type === 'success'
              ? 'bg-success/10 border border-success/30 text-success glow-success'
              : 'bg-danger/10 border border-danger/30 text-danger'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleLogAction(action.id)}
            disabled={logging === action.id}
            className="glass rounded-xl p-4 text-left glass-hover transition-all duration-300 group disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {ACTION_ICONS[action.icon] || '\u2694\uFE0F'}
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-primary group-hover:text-action-glow transition-colors">
                    {action.name}
                  </div>
                  <div className="text-xs text-text-muted">
                    +{action.xp_reward} XP
                  </div>
                </div>
              </div>
              <div className="text-action-glow text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {logging === action.id ? 'Logging...' : 'LOG'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
