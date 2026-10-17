import { Award, Compass, Flame, Gem, Medal, Rocket, Sparkles, Star, Trophy, type LucideIcon } from 'lucide-react'
import type { ProfileStats } from '../types'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: LucideIcon
  tier: 'bronze' | 'silver' | 'gold'
  /** Returns true once the player has earned this badge. */
  earned: (stats: ProfileStats) => boolean
  /** 0–1 progress toward the badge, for the locked state meter. */
  progress: (stats: ProfileStats) => number
}

const ratio = (value: number, target: number) => Math.max(0, Math.min(1, value / target))

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Register for your first opportunity.',
    icon: Compass,
    tier: 'bronze',
    earned: (s) => s.registeredCount >= 1,
    progress: (s) => ratio(s.registeredCount, 1),
  },
  {
    id: 'finisher',
    name: 'Finisher',
    description: 'Complete your first project.',
    icon: Medal,
    tier: 'bronze',
    earned: (s) => s.completedCount >= 1,
    progress: (s) => ratio(s.completedCount, 1),
  },
  {
    id: 'on-a-roll',
    name: 'On a Roll',
    description: 'Complete 3 projects.',
    icon: Flame,
    tier: 'silver',
    earned: (s) => s.completedCount >= 3,
    progress: (s) => ratio(s.completedCount, 3),
  },
  {
    id: 'seasoned',
    name: 'Seasoned',
    description: 'Complete 7 projects.',
    icon: Rocket,
    tier: 'silver',
    earned: (s) => s.completedCount >= 7,
    progress: (s) => ratio(s.completedCount, 7),
  },
  {
    id: 'relentless',
    name: 'Relentless',
    description: 'Complete 12 projects.',
    icon: Trophy,
    tier: 'gold',
    earned: (s) => s.completedCount >= 12,
    progress: (s) => ratio(s.completedCount, 12),
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Complete projects across 3 different categories.',
    icon: Sparkles,
    tier: 'silver',
    earned: (s) => s.categoriesCompleted >= 3,
    progress: (s) => ratio(s.categoriesCompleted, 3),
  },
  {
    id: 'flawless',
    name: 'Flawless',
    description: 'Earn a perfect 5-star organizer rating.',
    icon: Star,
    tier: 'gold',
    earned: (s) => s.ratings.some((r) => r.stars >= 5),
    progress: (s) => ratio(Math.max(0, ...s.ratings.map((r) => r.stars), 0), 5),
  },
  {
    id: 'crowd-favourite',
    name: 'Crowd Favourite',
    description: 'Keep a 4.5+ average across 3 or more ratings.',
    icon: Award,
    tier: 'gold',
    earned: (s) => s.totalRatings >= 3 && (s.averageRating ?? 0) >= 4.5,
    progress: (s) => (s.totalRatings >= 3 ? ratio(s.averageRating ?? 0, 4.5) : ratio(s.totalRatings, 3)),
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Save 5 paths to your collection.',
    icon: Gem,
    tier: 'bronze',
    earned: (s) => s.savedCount >= 5,
    progress: (s) => ratio(s.savedCount, 5),
  },
]
