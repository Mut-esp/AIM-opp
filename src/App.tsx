import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Bookmark, CalendarDays, ChevronRight, CircleUserRound, Compass, Filter, Heart, Landmark, MapPin, Search, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react'
import { categories, interests, opportunities, states } from './data/opportunities'
import { filterOpportunities } from './utils/filterOpportunities'
import type { Filters, Opportunity } from './types'
import './styles/global.css'

const initialFilters: Filters = { state: 'All Malaysia', district: '', category: 'All categories', education: '', budget: '', difficulty: '', audience: '', interest: '', search: '', sort: 'recommended' }
const iconFor: Record<Opportunity['category'], typeof Compass> = { Competition: Sparkles, Workshop: Landmark, Scholarship: Compass, Community: Heart, Spiritual: Landmark, 'Odd job': Users }

function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [view, setView] = useState<'discover' | 'saved'>('discover')
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [saved, setSaved] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('pathway-saved') ?? '[]') } catch { return [] } })
  const results = useMemo(() => filterOpportunities(view === 'saved' ? opportunities.filter((item) => saved.includes(item.id)) : opportunities, filters), [filters, saved, view])
  const featured = results.find((item) => item.featured) ?? results[0]
  const update = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const toggleSaved = (id: string) => setSaved((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; try { localStorage.setItem('pathway-saved', JSON.stringify(next)) } catch { /* unavailable storage should not block this session */ } return next })
  const clear = () => setFilters(initialFilters)

  useEffect(() => { if (selected) { const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null); window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) } }, [selected])
  return <div className="app-shell">
    <div className="workspace">
      <aside className="sidebar glass">
        <div className="brand"><div className="brand-mark"><Compass size={17} /></div><div className="brand-text">pathway<small>Malaysia / 01</small></div></div>
        <nav className="nav" aria-label="Main navigation">
          <button className={view === 'discover' ? 'active' : ''} onClick={() => setView('discover')}><Compass size={17} /><span>Discover</span></button>
          <button className={view === 'saved' ? 'active' : ''} aria-label="Saved" data-count={saved.length || undefined} onClick={() => setView('saved')}><Bookmark size={17} /><span>Saved {saved.length > 0 && `(${saved.length})`}</span></button>
          <button onClick={() => window.alert('Profile tools are coming in the next prototype milestone.')}><CircleUserRound size={17} /><span>My profile</span></button>
        </nav>
        <div className="sidebar-note"><strong>Built for Malaysia</strong><br />A small signal can change a young person’s direction.</div>
      </aside>
      <main className="main">
        <p className="eyebrow">A clearer way forward · 2025 sample</p>
        <h1>Your next opportunity is <em>closer</em> than you think.</h1>
        <p className="hero-copy">Explore meaningful things to do, learn and contribute — mapped to your corner of Malaysia.</p>
        <div className="control-bar">
          <label className="search"><Search size={17} color="var(--color-cyan)" /><input value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search opportunities, skills, providers..." /></label>
          <label className="control"><MapPin size={16} color="var(--color-cyan)" /><select aria-label="State" value={filters.state} onChange={(event) => update('state', event.target.value)}>{states.map((state) => <option key={state}>{state}</option>)}</select></label>
          <button className="control" onClick={() => document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth' })}><SlidersHorizontal size={16} /> Filters</button>
        </div>
        <section id="filters" className="filters" aria-label="Opportunity filters">
          <select className="filter-select" aria-label="Interest" value={filters.interest} onChange={(event) => update('interest', event.target.value)}><option value="">Any interest</option>{interests.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="filter-select" aria-label="Category" value={filters.category} onChange={(event) => update('category', event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <select className="filter-select" aria-label="Education level" value={filters.education} onChange={(event) => update('education', event.target.value)}><option value="">Any education level</option>{['Secondary', 'Pre-university', 'University', 'Graduate', 'Open to all'].map((item) => <option key={item}>{item}</option>)}</select>
          <select className="filter-select" aria-label="Budget" value={filters.budget} onChange={(event) => update('budget', event.target.value)}><option value="">Any budget</option><option>Free</option><option>Under RM50</option><option>RM50+</option></select>
          <select className="filter-select" aria-label="Difficulty" value={filters.difficulty} onChange={(event) => update('difficulty', event.target.value)}><option value="">Any difficulty</option>{['Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item}>{item}</option>)}</select>
          <button className="clear" onClick={clear}><X size={13} /> Reset filters</button>
        </section>
        {view === 'discover' && featured && <section className="featured" aria-label="Featured opportunity">
          <div className="featured-copy"><span className="tag"><Sparkles size={12} /> Featured pathway</span><h2>{featured.title}</h2><p>{featured.description}</p><div className="meta-line"><span><MapPin size={13} />{featured.state}</span><span><CalendarDays size={13} />{featured.date}</span><span className="fee">{featured.fee === 0 ? 'Free to join' : `RM${featured.fee}`}</span></div><button className="details-button" style={{ marginTop: 24 }} onClick={() => setSelected(featured)}>View pathway <ArrowUpRight size={14} /></button></div><div className="featured-art" aria-hidden="true" /></section>}
        <div className="results-head"><div><h2>{view === 'saved' ? 'Your saved paths' : 'Around your orbit'}</h2><p>{results.length} {results.length === 1 ? 'opportunity' : 'opportunities'} matching your current view</p></div><label className="sort"><Filter size={13} /> Sort by <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}><option value="recommended">Recommended</option><option value="soonest">Soonest deadline</option><option value="free">Lowest cost</option></select></label></div>
        <div className="opportunity-grid">
          {results.filter((item) => item.id !== featured?.id || view === 'saved').map((item) => <OpportunityCard key={item.id} opportunity={item} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} />)}
          {results.length === 0 && <div className="empty"><Compass size={26} color="var(--color-cyan)" /><p>No paths found in this orbit.</p><button className="clear" onClick={clear}>Reset filters and explore again</button></div>}
        </div>
      </main>
    </div>
    {selected && <DetailDrawer opportunity={selected} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} onClose={() => setSelected(null)} />}
  </div>
}

function OpportunityCard({ opportunity, saved, onSave, onOpen }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onOpen: () => void }) {
  const Icon = iconFor[opportunity.category]
  return <article className="opportunity"><div className="opportunity-top"><div className="category-icon"><Icon size={18} /></div><button className={`bookmark ${saved ? 'saved' : ''}`} aria-label={saved ? `Remove ${opportunity.title} from saved` : `Save ${opportunity.title}`} onClick={onSave}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><h3>{opportunity.title}</h3><p className="provider">{opportunity.provider} · {opportunity.category}</p><div className="opportunity-footer"><div><div><MapPin size={11} /> {opportunity.state}</div><div style={{ marginTop: 5 }}><CalendarDays size={11} /> {opportunity.date}</div></div><div style={{ textAlign: 'right' }}><div className="fee">{opportunity.fee === 0 ? 'Free' : `RM${opportunity.fee}`}</div><button className="details-button" onClick={onOpen}>Details <ChevronRight size={13} /></button></div></div></article>
}

function DetailDrawer({ opportunity, saved, onSave, onClose }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onClose: () => void }) {
  const Icon = iconFor[opportunity.category]
  const safeUrl = /^https?:\/\//i.test(opportunity.registrationUrl) ? opportunity.registrationUrl : null
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="drawer-close" aria-label="Close details" onClick={onClose}><X /></button><div className="category-icon"><Icon size={20} /></div><span className="tag" style={{ marginTop: 20 }}>{opportunity.category}</span><h2 id="detail-title">{opportunity.title}</h2><p className="provider">{opportunity.provider} · {opportunity.state}, {opportunity.district}</p><p className="description">{opportunity.description}</p><div className="detail-list"><div><CalendarDays /> <span><strong>{opportunity.date}</strong><br />Registration closes {opportunity.deadline}</span></div><div><MapPin /> <span><strong>{opportunity.venue}</strong><br />{opportunity.format}</span></div><div><Users /> <span><strong>{opportunity.audience}</strong><br />{opportunity.difficulty} level · {opportunity.fee === 0 ? 'Free' : `RM${opportunity.fee}`}</span></div><div><Heart /> <span><strong>What to bring</strong><br />{opportunity.materials}</span></div></div>{safeUrl ? <a className="primary-button" href={safeUrl} target="_blank" rel="noreferrer noopener">View registration link <ArrowUpRight size={16} /></a> : <p>Registration link unavailable.</p>}<button className="control" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={onSave}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved to your paths' : 'Save this path'}</button><p className="sample-note">Sample opportunity: this prototype record is for demonstration only. Dates, fees, availability and registration details are not verified.</p></aside></div>
}

export default App
