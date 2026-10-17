import type { LevelInfo, OrganizerRating, ProfileData, ProfileStats } from '../types'

const STORAGE_KEY = 'aim-profile'

/** Points awarded for each tracked action. Ratings add a per-star bonus on top. */
export const POINTS = {
  register: 15,
  complete: 60,
  perStar: 10,
}

const LEVELS: Array<{ title: string; floor: number }> = [
  { title: 'Seedling', floor: 0 },
  { title: 'Explorer', floor: 120 },
  { title: 'Pathfinder', floor: 320 },
  { title: 'Trailblazer', floor: 620 },
  { title: 'Luminary', floor: 1020 },
  { title: 'Visionary', floor: 1520 },
]
const LEVEL_STEP = 600

function levelBounds(index: number): { floor: number; next: number | null } {
  const floor = index < LEVELS.length ? LEVELS[index].floor : LEVELS[LEVELS.length - 1].floor + (index - LEVELS.length + 1) * LEVEL_STEP
  const nextIndex = index + 1
  const next = nextIndex < LEVELS.length ? LEVELS[nextIndex].floor : floor + LEVEL_STEP
  return { floor, next }
}

export function levelForXp(xp: number): LevelInfo {
  let index = 0
  // Walk forward while the next threshold is still reached.
  while (true) {
    const { next } = levelBounds(index)
    if (next !== null && xp >= next) index += 1
    else break
  }
  const { floor, next } = levelBounds(index)
  const title = index < LEVELS.length ? LEVELS[index].title : LEVELS[LEVELS.length - 1].title
  const span = (next ?? floor + LEVEL_STEP) - floor
  const intoLevel = xp - floor
  return {
    level: index + 1,
    title,
    xp,
    currentLevelFloor: floor,
    nextLevelAt: next,
    intoLevel,
    levelSpan: span,
    progress: span > 0 ? Math.max(0, Math.min(1, intoLevel / span)) : 1,
  }
}

export function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: {} }
    const parsed = JSON.parse(raw) as ProfileData
    return parsed && typeof parsed === 'object' && parsed.entries ? parsed : { entries: {} }
  } catch {
    return { entries: {} }
  }
}

export function saveProfile(data: ProfileData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* progression still works in-session without storage */
  }
}

/** Stable pseudo-random seed from a string so a project's rating never changes. */
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

const FEEDBACK_POOL = [
  'Reliable, prepared, and a genuine team player throughout the programme.',
  'Brought great energy and followed through on every commitment.',
  'Thoughtful contributor who lifted the people around them.',
  'Punctual, proactive, and a pleasure to have on the crew.',
  'Took initiative without being asked and delivered strong work.',
  'Handled responsibility maturely and left a real impact on the community.',
]

/** Auto-generates a plausible, stable organizer rating for a completed project. */
export function generateRating(opportunityId: string, provider: string): OrganizerRating {
  const seed = hashString(opportunityId)
  const stars = 4 + (seed % 3) * 0.5 // 4.0, 4.5, or 5.0 — strong but varied
  const feedback = FEEDBACK_POOL[seed % FEEDBACK_POOL.length]
  return { stars, feedback, organizer: provider, date: new Date().toISOString() }
}

export function deriveStats(
  data: ProfileData,
  savedCount: number,
  categoryOf: (id: string) => string | undefined,
): ProfileStats {
  const entries = Object.values(data.entries)
  const completed = entries.filter((entry) => entry.status === 'completed')
  const ratings = completed.map((entry) => entry.rating).filter((rating): rating is OrganizerRating => Boolean(rating))
  const registeredCount = entries.length
  const completedCount = completed.length
  const categories = new Set(completed.map((entry) => categoryOf(entry.id)).filter(Boolean))
  const totalRatings = ratings.length
  const averageRating = totalRatings > 0 ? ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings : null
  const xp = registeredCount * POINTS.register + completedCount * POINTS.complete + ratings.reduce((sum, rating) => sum + rating.stars * POINTS.perStar, 0)

  return {
    xp,
    level: levelForXp(xp),
    registeredCount,
    completedCount,
    inProgressCount: registeredCount - completedCount,
    savedCount,
    categoriesCompleted: categories.size,
    ratings,
    averageRating,
    totalRatings,
  }
}
