export type OpportunityCategory = 'Competition' | 'Workshop' | 'Scholarship' | 'Community' | 'Spiritual' | 'Odd job'
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type EducationLevel = 'Secondary' | 'Pre-university' | 'University' | 'Graduate' | 'Open to all'

export interface Opportunity {
  id: string
  title: string
  provider: string
  category: OpportunityCategory
  state: string
  district: string
  interests: string[]
  education: EducationLevel[]
  audience: string
  date: string
  deadline: string
  fee: number
  format: 'In person' | 'Hybrid' | 'Online'
  difficulty: Difficulty
  description: string
  venue: string
  materials: string
  featured?: boolean
  sample: boolean
  registrationUrl: string
  /** Optional cover image URL for the opportunity. Can be a remote URL (e.g. Unsplash)
   *  or a path to a local asset in /public (e.g. '/images/foo.jpg'). When absent, a
   *  category-themed SVG placeholder is rendered instead. */
  image?: string
}

export interface Shop {
  id: string
  name: string
  category: string
  description: string
  state: string
  district: string
  location: string
  price: string
  rating: number
  reviewCount: number
  likes: number
  sample: boolean
}

export interface OrganizerRating {
  stars: number
  feedback: string
  organizer: string
  date: string
}

export interface ProjectEntry {
  id: string
  status: 'registered' | 'completed'
  registeredAt: string
  completedAt?: string
  rating?: OrganizerRating
}

export interface ProfileData {
  entries: Record<string, ProjectEntry>
}

export interface LevelInfo {
  level: number
  title: string
  xp: number
  currentLevelFloor: number
  nextLevelAt: number | null
  intoLevel: number
  levelSpan: number
  progress: number
}

export interface ProfileStats {
  xp: number
  level: LevelInfo
  registeredCount: number
  completedCount: number
  inProgressCount: number
  savedCount: number
  categoriesCompleted: number
  ratings: OrganizerRating[]
  averageRating: number | null
  totalRatings: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold'
}

export interface Filters {
  state: string
  district: string
  category: string
  education: string
  budget: string
  difficulty: string
  audience: string
  interest: string
  search: string
  sort: 'recommended' | 'soonest' | 'free'
}
