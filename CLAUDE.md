# Quest Forge - Modern Fantasy RPG Habit Tracker

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend/Database**: Supabase (PostgreSQL 17), Supabase Auth, RLS
- **Deployment**: Vercel, GitHub CLI
- **Supabase Project ID**: ksnmzaiqoyxnkofiycvc
- **Supabase Region**: eu-central-1

## RPG Mathematical Formulas

### XP & Leveling (Polynomial Curve)
```
Total_XP_Required(level) = 100 * level^1.5
```
- Level 1: 100 XP
- Level 2: 283 XP
- Level 5: 1,118 XP
- Level 10: 3,162 XP
- Level 50: 35,355 XP
- Level 100: 100,000 XP

### XP for Next Level
```
XP_for_next_level = Total_XP_Required(current_level + 1) - Total_XP_Required(current_level)
```

### Level Progress Percentage
```
progress = (current_xp - Total_XP_Required(current_level)) / (Total_XP_Required(current_level + 1) - Total_XP_Required(current_level)) * 100
```

### Title Milestones
| Level | Title        |
|-------|-------------|
| 1     | Novice      |
| 5     | Initiate    |
| 10    | Apprentice  |
| 25    | Journeyman  |
| 50    | Adept       |
| 75    | Expert      |
| 100   | Grandmaster |

## Core Stats (Base 6)
- **Strength** (STR) - Physical fitness, weight training, sports
- **Intelligence** (INT) - Study, reading, problem-solving
- **Dexterity** (DEX) - Agility, flexibility, hand-eye coordination
- **Constitution** (CON) - Endurance, health habits, sleep quality
- **Wisdom** (WIS) - Meditation, reflection, mindfulness
- **Charisma** (CHA) - Social interactions, public speaking, networking

## Custom Stat Constraint
- Users may create up to 5 custom stat types (is_custom = true)
- Enforced via PL/pgSQL BEFORE INSERT trigger on user_stats table
- Prepares for future paywall system

## UI Color Palette (Modern Fantasy)
| Token           | Value     | Usage                        |
|-----------------|-----------|------------------------------|
| bg-primary      | #050517   | Primary background           |
| surface-card    | #0a1f44   | Card/panel backgrounds       |
| action-glow     | #ff6b35   | CTAs, primary action buttons |
| magic-accent    | #BE8CFF   | Magical accents, highlights  |
| success-growth  | #5fd38d   | XP gains, success states     |

## Fonts
- **Headings/Titles**: Cinzel (serif)
- **Body/Stats/Logs**: Inter (sans-serif)

## Design Patterns
- Glassmorphism: translucent dark backgrounds + backdrop-blur
- Glowing box-shadows on hover states
- Dark-first, immersive fantasy aesthetic
