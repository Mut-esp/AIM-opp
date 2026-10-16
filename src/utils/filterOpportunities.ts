import type { Filters, Opportunity } from '../types'

export function filterOpportunities(items: Opportunity[], filters: Filters): Opportunity[] {
  const query = filters.search.trim().toLowerCase()
  const result = items.filter((item) => {
    const text = `${item.title} ${item.provider} ${item.description} ${item.interests.join(' ')}`.toLowerCase()
    const matchesBudget = !filters.budget || (filters.budget === 'Free' ? item.fee === 0 : filters.budget === 'Under RM50' ? item.fee < 50 : item.fee >= 50)
    return (!filters.state || filters.state === 'All Malaysia' || item.state === filters.state)
      && (!filters.district || item.district === filters.district)
      && (!filters.category || filters.category === 'All categories' || item.category === filters.category)
      && (!filters.education || item.education.includes(filters.education as never))
      && matchesBudget
      && (!filters.difficulty || item.difficulty === filters.difficulty)
      && (!filters.audience || item.audience.toLowerCase().includes(filters.audience.toLowerCase()))
      && (!filters.interest || item.interests.includes(filters.interest))
      && (!query || text.includes(query))
  })
  return [...result].sort((a, b) => filters.sort === 'free' ? a.fee - b.fee : filters.sort === 'soonest' ? a.deadline.localeCompare(b.deadline) : Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
}
