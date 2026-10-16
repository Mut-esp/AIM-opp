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
