import type { ProfileData } from '../types'

/** Fictional person used to present the gamified profile with populated stats. */
export interface DemoPerson {
  name: string
  handle: string
  initials: string
  headline: string
  location: string
  joined: string
}

export const demoPerson: DemoPerson = {
  name: 'Muhammad Imran Yusoff Bin Mutsanna',
  handle: '@imran_yusof',
  initials: 'MI',
  headline: 'Community builder · STEM mentor · chasing the next opportunity',
  location: 'Petaling Jaya, Selangor',
  joined: 'Member since Jan 2025',
}

/** Pre-completed projects that give the demo person a full set of stats and badges. */
export const demoProfile: ProfileData = {
  entries: {
    'my-digital': { id: 'my-digital', status: 'completed', registeredAt: '2025-01-04T09:00:00.000Z', completedAt: '2025-01-19T18:00:00.000Z', rating: { stars: 5, feedback: 'Led her team to a standout prototype and mentored first-timers along the way.', organizer: 'MDEC', date: '2025-01-19T18:00:00.000Z' } },
    'sabah-ocean': { id: 'sabah-ocean', status: 'completed', registeredAt: '2025-04-02T09:00:00.000Z', completedAt: '2025-05-11T12:00:00.000Z', rating: { stars: 5, feedback: 'Fearless in the field and a natural at translating science into stories.', organizer: 'Borneo Ocean Network', date: '2025-05-11T12:00:00.000Z' } },
    'sarawak-scholar': { id: 'sarawak-scholar', status: 'completed', registeredAt: '2025-01-10T09:00:00.000Z', completedAt: '2025-03-02T10:00:00.000Z', rating: { stars: 5, feedback: 'An outstanding candidate with a clear sense of purpose.', organizer: 'Yayasan Sarawak', date: '2025-03-02T10:00:00.000Z' } },
    'johor-tutor': { id: 'johor-tutor', status: 'completed', registeredAt: '2025-02-01T09:00:00.000Z', completedAt: '2025-04-26T12:00:00.000Z', rating: { stars: 4.5, feedback: 'Patient, consistent, and genuinely cared about her students’ progress.', organizer: 'KitaBantu Learning Hub', date: '2025-04-26T12:00:00.000Z' } },
    'qurban-aid': { id: 'qurban-aid', status: 'completed', registeredAt: '2025-05-20T09:00:00.000Z', completedAt: '2025-06-07T16:00:00.000Z', rating: { stars: 4.5, feedback: 'Reliable and warm with neighbours throughout a long distribution day.', organizer: 'Masjid Al-Hidayah', date: '2025-06-07T16:00:00.000Z' } },
    'penang-maker': { id: 'penang-maker', status: 'completed', registeredAt: '2025-02-10T09:00:00.000Z', completedAt: '2025-02-22T17:00:00.000Z', rating: { stars: 4.5, feedback: 'Picked up the hardware fast and helped the whole bench finish on time.', organizer: 'Penang Science Cluster', date: '2025-02-22T17:00:00.000Z' } },
    'melaka-heritage': { id: 'melaka-heritage', status: 'completed', registeredAt: '2025-03-01T09:00:00.000Z', completedAt: '2025-03-15T17:00:00.000Z', rating: { stars: 4.5, feedback: 'Interviewed elders with real care and produced a lovely digital story.', organizer: 'Ruang Seni Melaka', date: '2025-03-15T17:00:00.000Z' } },
    'kl-crew': { id: 'kl-crew', status: 'completed', registeredAt: '2025-03-20T09:00:00.000Z', completedAt: '2025-04-13T22:00:00.000Z', rating: { stars: 4.5, feedback: 'Kept the check-in desk calm during the busiest hours of the festival.', organizer: 'Kuala Lumpur Youth Co.', date: '2025-04-13T22:00:00.000Z' } },
    'perak-biz': { id: 'perak-biz', status: 'completed', registeredAt: '2025-04-05T09:00:00.000Z', completedAt: '2025-05-02T15:00:00.000Z', rating: { stars: 4, feedback: 'A promising idea backed by a tidy budget and a confident pitch.', organizer: 'Perak Entrepreneur Centre', date: '2025-05-02T15:00:00.000Z' } },
    'imam-assist': { id: 'imam-assist', status: 'registered', registeredAt: '2025-06-15T09:00:00.000Z' },
  },
}

/** Saved opportunity ids for the demo person, so the Curator badge is earned. */
export const demoSaved: string[] = ['penang-maker', 'perak-biz', 'melaka-heritage', 'sabah-ocean', 'qurban-aid', 'johor-tutor']
