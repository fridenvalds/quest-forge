// ============================================
// RPG MATH ENGINE
// ============================================

/**
 * Total XP required to reach a given level.
 * Formula: 100 * level^1.5
 */
export function xpRequiredForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

/**
 * Calculate current level from total XP.
 * Inverse of: xp = 100 * level^1.5
 * level = floor((xp / 100)^(2/3))
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1
  const level = Math.floor(Math.pow(totalXp / 100, 2 / 3))
  return Math.max(1, level)
}

/**
 * XP progress percentage towards next level.
 */
export function xpProgress(totalXp: number, currentLevel: number): number {
  const currentLevelXp = xpRequiredForLevel(currentLevel)
  const nextLevelXp = xpRequiredForLevel(currentLevel + 1)
  const range = nextLevelXp - currentLevelXp
  if (range <= 0) return 0
  const progress = ((totalXp - currentLevelXp) / range) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * XP remaining to reach the next level.
 */
export function xpToNextLevel(totalXp: number, currentLevel: number): number {
  return Math.max(0, xpRequiredForLevel(currentLevel + 1) - totalXp)
}

/**
 * Get title based on level.
 */
export function getTitle(level: number): string {
  if (level >= 100) return 'Grandmaster'
  if (level >= 75) return 'Expert'
  if (level >= 50) return 'Adept'
  if (level >= 25) return 'Journeyman'
  if (level >= 10) return 'Apprentice'
  if (level >= 5) return 'Initiate'
  return 'Novice'
}

/**
 * Stat descriptions for tooltips.
 */
export const STAT_DESCRIPTIONS: Record<string, string> = {
  Strength: 'Physical fitness, weight training, sports',
  Intelligence: 'Study, reading, problem-solving',
  Dexterity: 'Agility, flexibility, hand-eye coordination',
  Constitution: 'Endurance, health habits, sleep quality',
  Wisdom: 'Meditation, reflection, mindfulness',
  Charisma: 'Social interactions, public speaking, networking',
}

/**
 * Stat abbreviation map.
 */
export const STAT_ABBREVIATIONS: Record<string, string> = {
  Strength: 'STR',
  Intelligence: 'INT',
  Dexterity: 'DEX',
  Constitution: 'CON',
  Wisdom: 'WIS',
  Charisma: 'CHA',
}

/**
 * Action icon options.
 */
export const ACTION_ICONS: Record<string, string> = {
  sword: '\u2694\uFE0F',
  book: '\uD83D\uDCD6',
  run: '\uD83C\uDFC3',
  meditate: '\uD83E\uDDD8',
  heart: '\u2764\uFE0F',
  star: '\u2B50',
  fire: '\uD83D\uDD25',
  shield: '\uD83D\uDEE1\uFE0F',
  potion: '\uD83E\uDDEA',
  scroll: '\uD83D\uDCDC',
}
