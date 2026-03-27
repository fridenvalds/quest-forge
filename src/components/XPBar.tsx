'use client'

import { xpProgress, xpRequiredForLevel, xpToNextLevel } from '@/lib/rpg'

interface XPBarProps {
  totalXp: number
  level: number
}

export function XPBar({ totalXp, level }: XPBarProps) {
  const progress = xpProgress(totalXp, level)
  const nextLevelXp = xpRequiredForLevel(level + 1)
  const remaining = xpToNextLevel(totalXp, level)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-text-secondary font-medium">
          {totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
        </span>
        <span className="text-xs text-magic font-medium">
          {remaining.toLocaleString()} XP to next level
        </span>
      </div>
      <div className="xp-bar-track h-4 rounded-full">
        <div
          className="xp-bar-fill h-full glow-xp-bar"
          style={{ width: `${Math.max(2, progress)}%` }}
        />
      </div>
    </div>
  )
}
