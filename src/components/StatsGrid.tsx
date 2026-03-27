'use client'

import { STAT_DESCRIPTIONS } from '@/lib/rpg'

interface StatType {
  id: string
  name: string
  abbreviation: string
  description: string | null
  is_custom: boolean
}

interface UserStat {
  stat_type_id: string
  value: number
  stat_types: StatType
}

interface StatsGridProps {
  stats: UserStat[]
}

const STAT_COLORS: Record<string, string> = {
  STR: 'text-red-400',
  INT: 'text-blue-400',
  DEX: 'text-green-400',
  CON: 'text-yellow-400',
  WIS: 'text-purple-400',
  CHA: 'text-pink-400',
}

const STAT_ICONS: Record<string, string> = {
  STR: '\uD83D\uDCAA',
  INT: '\uD83E\uDDE0',
  DEX: '\uD83C\uDFF9',
  CON: '\uD83D\uDEE1\uFE0F',
  WIS: '\uD83D\uDD2E',
  CHA: '\u2728',
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const abbr = stat.stat_types.abbreviation
        const colorClass = STAT_COLORS[abbr] || 'text-magic'
        const icon = STAT_ICONS[abbr] || '\u2B50'
        const tooltip = stat.stat_types.description || STAT_DESCRIPTIONS[stat.stat_types.name] || ''

        return (
          <div
            key={stat.stat_type_id}
            className="stat-card glass rounded-xl p-4 glass-hover transition-all duration-300 group relative"
            title={tooltip}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{icon}</span>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {abbr}
              </span>
              {stat.stat_types.is_custom && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-magic/20 text-magic ml-auto">
                  Custom
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold font-heading ${colorClass}`}>
              {stat.value}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {stat.stat_types.name}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-bg-primary border border-border text-xs text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )
      })}
    </div>
  )
}
