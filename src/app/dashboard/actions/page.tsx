'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ACTION_ICONS } from '@/lib/rpg'

interface StatType {
  id: string
  name: string
  abbreviation: string
}

interface Action {
  id: string
  name: string
  description: string | null
  xp_reward: number
  icon: string
  action_stat_rewards: {
    stat_type_id: string
    value: number
    stat_types: StatType
  }[]
}

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([])
  const [statTypes, setStatTypes] = useState<StatType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [xpReward, setXpReward] = useState(10)
  const [icon, setIcon] = useState('sword')
  const [selectedStats, setSelectedStats] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [actionsRes, statsRes] = await Promise.all([
      supabase
        .from('actions')
        .select('*, action_stat_rewards(*, stat_types(*))')
        .eq('user_id', user.id)
        .order('created_at'),
      supabase
        .from('stat_types')
        .select('id, name, abbreviation')
        .eq('user_id', user.id),
    ])

    if (actionsRes.data) setActions(actionsRes.data as unknown as Action[])
    if (statsRes.data) setStatTypes(statsRes.data)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: action, error: actError } = await supabase
        .from('actions')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          xp_reward: xpReward,
          icon,
        })
        .select()
        .single()

      if (actError) throw actError

      // Insert stat rewards
      const rewards = Object.entries(selectedStats)
        .filter(([, val]) => val > 0)
        .map(([statId, val]) => ({
          action_id: action.id,
          stat_type_id: statId,
          value: val,
        }))

      if (rewards.length > 0) {
        const { error: rwError } = await supabase
          .from('action_stat_rewards')
          .insert(rewards)
        if (rwError) throw rwError
      }

      setName('')
      setDescription('')
      setXpReward(10)
      setIcon('sword')
      setSelectedStats({})
      setShowForm(false)
      fetchData()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create action'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(actionId: string) {
    await supabase.from('action_stat_rewards').delete().eq('action_id', actionId)
    await supabase.from('actions').delete().eq('id', actionId)
    fetchData()
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Quest Actions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-action-glow text-white text-sm font-semibold hover:bg-action-glow-dim glow-action transition-all"
        >
          {showForm ? 'Cancel' : '+ New Action'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-fade-in-up">
          <h3 className="font-heading text-lg font-semibold text-magic mb-4">
            Forge New Action
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Action Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Weight Training"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-magic transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">XP Reward</label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={1000}
                  className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary focus:outline-none focus:border-magic transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this action involve?"
                className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-magic transition-all"
              />
            </div>

            {/* Icon selector */}
            <div>
              <label className="block text-xs text-text-secondary mb-1">Icon</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ACTION_ICONS).map(([key, emoji]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                      icon === key
                        ? 'bg-magic/30 border border-magic glow-magic'
                        : 'bg-bg-primary/50 border border-border hover:border-magic/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Stat rewards */}
            <div>
              <label className="block text-xs text-text-secondary mb-2">
                Stat Rewards (points gained per completion)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {statTypes.map((st) => (
                  <div key={st.id} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-10">{st.abbreviation}</span>
                    <input
                      type="number"
                      value={selectedStats[st.id] || 0}
                      onChange={(e) =>
                        setSelectedStats((prev) => ({
                          ...prev,
                          [st.id]: Math.max(0, parseInt(e.target.value) || 0),
                        }))
                      }
                      min={0}
                      max={10}
                      className="w-16 px-2 py-1 rounded-lg bg-bg-primary/80 border border-border text-xs text-text-primary text-center focus:outline-none focus:border-magic transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-action-glow text-white font-semibold hover:bg-action-glow-dim glow-action transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Forging...' : 'Forge Action'}
            </button>
          </form>
        </div>
      )}

      {/* Actions list */}
      {actions.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">&#x2694;&#xFE0F;</div>
          <p className="text-text-muted text-sm">
            No actions created yet. Click &quot;+ New Action&quot; to forge your first quest action.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <div key={action.id} className="glass rounded-xl p-5 glass-hover transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {ACTION_ICONS[action.icon] || '\u2694\uFE0F'}
                  </span>
                  <div>
                    <h4 className="font-semibold text-text-primary">{action.name}</h4>
                    {action.description && (
                      <p className="text-xs text-text-muted mt-0.5">{action.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(action.id)}
                  className="text-text-muted hover:text-danger text-xs opacity-0 group-hover:opacity-100 transition-all"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-medium">
                  +{action.xp_reward} XP
                </span>
                {action.action_stat_rewards?.map((reward) => (
                  <span
                    key={reward.stat_type_id}
                    className="text-xs px-2 py-1 rounded-full bg-magic/20 text-magic"
                  >
                    +{reward.value} {reward.stat_types?.abbreviation}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
