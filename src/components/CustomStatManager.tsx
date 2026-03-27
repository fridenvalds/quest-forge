'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CustomStatManagerProps {
  userId: string
  customStatCount: number
  onStatAdded: () => void
}

export function CustomStatManager({ userId, customStatCount, onStatAdded }: CustomStatManagerProps) {
  const [name, setName] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleAddCustomStat(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Insert stat_type (trigger will enforce limit)
      const { data: statType, error: stError } = await supabase
        .from('stat_types')
        .insert({
          user_id: userId,
          name: name.trim(),
          abbreviation: abbreviation.toUpperCase().trim(),
          description: description.trim() || null,
          is_custom: true,
        })
        .select()
        .single()

      if (stError) {
        // Catch the PL/pgSQL trigger exception
        if (stError.message.includes('Custom stat limit reached')) {
          setError('You have reached the maximum of 5 custom stats. Upgrade your plan to add more!')
        } else if (stError.message.includes('duplicate')) {
          setError('A stat with this name already exists.')
        } else {
          setError(stError.message)
        }
        return
      }

      // Create corresponding user_stats entry
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          stat_type_id: statType.id,
          value: 0,
        })

      setSuccess(`"${name}" stat forged successfully!`)
      setName('')
      setAbbreviation('')
      setDescription('')
      onStatAdded()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary">
          Forge Custom Stat
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-magic/20 text-magic">
          {customStatCount}/5 used
        </span>
      </div>

      {customStatCount >= 5 ? (
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-warning text-sm">
          Maximum custom stats reached (5/5). A future upgrade will unlock more slots.
        </div>
      ) : (
        <form onSubmit={handleAddCustomStat} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Stat Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Creativity"
                required
                className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-magic transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Abbreviation</label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value.slice(0, 4))}
                placeholder="e.g., CRE"
                required
                maxLength={4}
                className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-magic transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What real-world actions correlate to this stat?"
              className="w-full px-3 py-2 rounded-lg bg-bg-primary/80 border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-magic transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-success text-sm glow-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-magic/20 text-magic font-medium hover:bg-magic/30 border border-magic/30 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? 'Forging...' : 'Forge New Stat'}
          </button>
        </form>
      )}
    </div>
  )
}
