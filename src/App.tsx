import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowUpRight, Bookmark, CalendarDays, ChevronLeft, ChevronRight, CircleUserRound, Compass, Heart, House, Landmark, MapPin, Search, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react'
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
  const [step, setStep] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [homeQuery, setHomeQuery] = useState('')
  const [discoverQuery, setDiscoverQuery] = useState('')
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pathway-saved') ?? '[]') }
    catch { return [] }
  })
  const results = useMemo(() => filterOpportunities(view === 'saved' ? opportunities.filter((item) => saved.includes(item.id)) : opportunities, filters), [filters, saved, view])
  const hasFilters = Boolean(filters.search || filters.state !== 'All Malaysia' || filters.district || filters.category !== 'All categories' || filters.education || filters.budget || filters.difficulty || filters.audience || filters.interest)
  const pageSize = 4
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize))
  const visibleResults = results.slice(page * pageSize, (page + 1) * pageSize)
  const featuredOpportunity = opportunities.find((item) => item.featured) ?? opportunities[0]
  const showFeatured = view === 'discover' && results.some((item) => item.id === featuredOpportunity.id)
  const update = (key: keyof Filters, value: string) => { setPage(0); setFilters((current) => ({ ...current, [key]: value })) }
  const selectSignal = (interest: string) => {
    setFilters((current) => ({ ...current, interest, search: '' }))
    setHomeQuery('')
    setDiscoverQuery('')
    setPage(0)
    setView('discover')
    setStep(3)
  }
  const toggleSaved = (id: string) => setSaved((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    try { localStorage.setItem('pathway-saved', JSON.stringify(next)) } catch { /* session state still works without storage */ }
    return next
  })
  const clear = () => { setPage(0); setFilters(initialFilters); setHomeQuery(''); setDiscoverQuery('') }
  const submitDiscoverSearch = () => {
    setFilters({ ...initialFilters, search: discoverQuery })
    setPage(0)
    setShowFilters(false)
  }
  const goHome = () => { setStep(0); setView('discover'); setShowFilters(false); setSelected(null); setPage(0) }

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selected) setSelected(null)
      else if (showFilters) setShowFilters(false)
      else if (step > 0 && step < 3) setStep(0)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [selected, showFilters, step])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Compass size={19} /></div><div className="brand-text">AIM OPP<small>Opportunity instrument</small></div></div>
      <div className="rail-label">Workspace</div>
      <nav className="nav" aria-label="Main navigation">
        <button className={step === 0 && view === 'discover' ? 'active' : ''} onClick={goHome}><House size={16} /><span>Home</span></button>
        <button className={step >= 3 && view === 'discover' ? 'active' : ''} onClick={() => { setPage(0); setView('discover'); setStep(3) }}><Compass size={16} /><span>Discover</span></button>
        <button className={view === 'saved' ? 'active' : ''} onClick={() => { setPage(0); setView('saved'); setStep(3) }}><Bookmark size={16} /><span>Saved paths</span><b>{saved.length}</b></button>
      </nav>
      <div className="rail-divider" />
      <button className="profile-button" onClick={() => window.alert('Profile tools are coming in the next prototype milestone.')}><CircleUserRound size={16} /><span>My profile</span></button>
      <div className="sidebar-note"><span className="status-dot" />Live directory<br /><strong>Built for Malaysia</strong><br />Small signals. Better directions.</div>
    </aside>

    <main className={`main ${step >= 3 ? 'results-mode' : ''}`}>
      <header className="topbar"><span className="topbar-kicker">AIM / 01</span><span className="topbar-status"><span className="status-dot" />Directory synced <span className="topbar-time">09:41 MYT</span></span></header>
      {step < 3 && <><p className="eyebrow">A clearer way forward · Malaysia</p><div className="hero-row"><div><h1>Find your next <em>opportunity.</em></h1><p className="hero-copy">A considered directory of competitions, work, learning and community paths.</p></div>{step === 0 && <button className="primary-button find-job-button" onClick={() => setStep(2)}>Tune my search <ArrowUpRight size={16} /></button>}</div></>}

      {step === 0 && <section className="home-console">
        <div className="console-head"><span className="console-index">01</span><div><strong>Start with a signal</strong><span>Search the directory, then refine at your own pace.</span></div><span className="console-light" /></div>
        <div className="home-search"><label className="search"><Search size={17} /><input value={homeQuery} onChange={(event) => setHomeQuery(event.target.value)} placeholder="Search skills, providers, or opportunities" /></label><button className="primary-button search-button" onClick={() => { setFilters((current) => ({ ...current, search: homeQuery })); setPage(0); setStep(2) }}>Search <Search size={15} /></button></div>
        <div className="quick-signals"><span>Try a signal</span>{['Technology', 'Community service', 'Career development'].map((item) => <button key={item} onClick={() => selectSignal(item)}>{item}</button>)}</div>
      </section>}

      {step === 2 && <Wizard title="Tune your opportunity search" description="Choose the same controls available in Discover, then explore your matching paths." label="Step 1 of 1" onClose={() => setStep(0)}><FilterControls filters={filters} update={update} /><button className="primary-button" onClick={() => setStep(3)}>Show my paths <ArrowUpRight size={16} /></button></Wizard>}

      {step >= 3 && <section className="programme-section">
        <div className="results-toolbar"><div><p className="eyebrow">Directory view / {view === 'saved' ? 'Saved paths' : 'All signals'}</p><h2>{view === 'saved' ? 'Your saved paths' : 'Opportunities worth your attention'}</h2><p className="programme-count">{results.length} {results.length === 1 ? 'path' : 'paths'} in the current view</p></div><div className="results-controls"><label className="discover-search"><Search size={15} /><input aria-label="Search discover results" value={discoverQuery} onChange={(event) => setDiscoverQuery(event.target.value)} placeholder="Search the directory" onKeyDown={(event) => { if (event.key === 'Enter') submitDiscoverSearch() }} /></label><button className="primary-button discover-search-button" onClick={submitDiscoverSearch}><Search size={15} /> Search</button><button className="control filter-trigger" onClick={() => setShowFilters(true)}><SlidersHorizontal size={15} /> Refine view</button></div></div>
        {showFeatured && <FeaturedOpportunity opportunity={featuredOpportunity} onOpen={() => setSelected(featuredOpportunity)} onSave={() => toggleSaved(featuredOpportunity.id)} saved={saved.includes(featuredOpportunity.id)} />}
        <div className="results-head"><div><span className="section-label">Browse the collection</span><h3>{hasFilters ? 'Filtered results' : 'Freshly mapped paths'}</h3></div><label className="sort">Sort by <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}><option value="recommended">Recommended</option><option value="soonest">Soonest</option><option value="free">Free first</option></select></label></div>
        <div className="opportunity-grid">{visibleResults.length ? visibleResults.map((item) => <OpportunityCard key={item.id} opportunity={item} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} />) : <div className="empty"><Compass size={25} /><strong>No paths on this setting yet.</strong><span>Try clearing a filter or searching another signal.</span><button className="clear" onClick={clear}>Reset view</button></div>}</div>
        {pageCount > 1 && <div className="pagination"><button className="control" disabled={page === 0} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={15} /> Previous</button><span>Page {page + 1} of {pageCount}</span><button className="control" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)}>Next <ChevronRight size={15} /></button></div>}
      </section>}
    </main>

    {showFilters && <div className="filter-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowFilters(false)}><section className="filter-panel" role="dialog" aria-modal="true"><div className="filter-panel-head"><div><p className="eyebrow">Control surface</p><h2>Refine your view</h2></div><button className="icon-button" onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={18} /></button></div><FilterControls filters={filters} update={update} /><div className="filter-actions"><button className="clear" onClick={clear}>Clear all</button><button className="primary-button" onClick={() => setShowFilters(false)}>Apply settings <ArrowUpRight size={15} /></button></div></section></div>}
    {selected && <DetailDrawer opportunity={selected} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} onClose={() => setSelected(null)} />}
  </div>
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const emptyValue = label === 'State' ? 'All Malaysia' : label === 'Category' ? 'All categories' : ''
  const selectValue = value === 'All Malaysia' || value === 'All categories' ? '' : value
  return <label className="filter-field"><span>{label}</span><select className="filter-select" aria-label={label} value={selectValue} onChange={(event) => onChange(event.target.value || emptyValue)}><option value="">{label === 'State' ? 'All Malaysia' : label === 'Category' ? 'All categories' : `Any ${label.toLowerCase()}`}</option>{options.filter((option) => option !== 'All Malaysia' && option !== 'All categories').map((option) => <option key={option}>{option}</option>)}</select></label>
}

function FilterControls({ filters, update }: { filters: Filters; update: (key: keyof Filters, value: string) => void }) {
  return <div className="filters shared-filters"><FilterSelect label="State" value={filters.state} onChange={(value) => update('state', value)} options={states} /><FilterSelect label="Category" value={filters.category} onChange={(value) => update('category', value)} options={categories} /><FilterSelect label="Interest" value={filters.interest} onChange={(value) => update('interest', value)} options={interests} /><FilterSelect label="Education" value={filters.education} onChange={(value) => update('education', value)} options={['Secondary', 'Pre-university', 'University', 'Graduate', 'Open to all']} /><FilterSelect label="Difficulty" value={filters.difficulty} onChange={(value) => update('difficulty', value)} options={['Beginner', 'Intermediate', 'Advanced']} /><FilterSelect label="Budget" value={filters.budget} onChange={(value) => update('budget', value)} options={['Free', 'Paid']} /><label className="filter-field filter-search-field"><span>Search</span><div className="filter-search"><Search size={14} /><input aria-label="Search opportunities" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Skills, providers, or titles" /></div></label></div>
}

function Wizard({ title, description, label, onClose, children }: { title: string; description: string; label: string; onClose: () => void; children: ReactNode }) {
  return <div className="wizard-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="wizard-step" aria-label={title}><button className="icon-button wizard-close" aria-label="Close" onClick={onClose}><X size={18} /></button><span className="tag">{label}</span><h2>{title}</h2><p>{description}</p>{children}</section></div>
}

function FeaturedOpportunity({ opportunity, saved, onSave, onOpen }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return <article className="featured"><div className="featured-copy"><span className="tag"><Sparkles size={12} /> Recommended signal</span><h2>{opportunity.title}</h2><p>{opportunity.description}</p><div className="meta-line"><span><MapPin size={13} /> {opportunity.state}</span><span><CalendarDays size={13} /> {opportunity.date}</span><span className="amber-text">{opportunity.fee === 0 ? 'Free to join' : `RM${opportunity.fee}`}</span></div><div className="featured-actions"><button className="primary-button" onClick={onOpen}>Inspect path <ArrowUpRight size={15} /></button><button className="icon-button" aria-label={saved ? 'Remove from saved' : 'Save path'} onClick={onSave}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div></div><div className="featured-art" aria-hidden="true"><span className="dial dial-one" /><span className="dial dial-two" /><span className="needle" /><span className="art-label">AIM / 01</span></div></article>
}

function OpportunityCard({ opportunity, saved, onSave, onOpen }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onOpen: () => void }) {
  const Icon = iconFor[opportunity.category]
  return <article className="opportunity"><div className="opportunity-top"><div className="category-icon"><Icon size={17} /></div><button className={`bookmark ${saved ? 'saved' : ''}`} aria-label={saved ? `Remove ${opportunity.title} from saved` : `Save ${opportunity.title}`} onClick={onSave}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><span className="card-index">{opportunity.category}</span><h3>{opportunity.title}</h3><p className="provider">{opportunity.provider}</p><div className="opportunity-footer"><div><div><MapPin size={11} /> {opportunity.state}</div><div><CalendarDays size={11} /> {opportunity.date}</div></div><div className="card-end"><div className="fee">{opportunity.fee === 0 ? 'Free' : `RM${opportunity.fee}`}</div><button className="details-button" onClick={onOpen}>Details <ChevronRight size={13} /></button></div></div></article>
}

function DetailDrawer({ opportunity, saved, onSave, onClose }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onClose: () => void }) {
  const Icon = iconFor[opportunity.category]
  const safeUrl = /^https?:\/\//i.test(opportunity.registrationUrl) ? opportunity.registrationUrl : null
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="icon-button drawer-close" aria-label="Close details" onClick={onClose}><X /></button><div className="category-icon"><Icon size={20} /></div><span className="tag drawer-tag">{opportunity.category}</span><h2 id="detail-title">{opportunity.title}</h2><p className="provider">{opportunity.provider} · {opportunity.state}, {opportunity.district}</p><p className="description">{opportunity.description}</p><div className="detail-list"><div><CalendarDays /><span><strong>{opportunity.date}</strong><br />Registration closes {opportunity.deadline}</span></div><div><MapPin /><span><strong>{opportunity.venue}</strong><br />{opportunity.format}</span></div><div><Users /><span><strong>{opportunity.audience}</strong><br />{opportunity.difficulty} level · {opportunity.fee === 0 ? 'Free' : `RM${opportunity.fee}`}</span></div><div><Heart /><span><strong>What to bring</strong><br />{opportunity.materials}</span></div></div>{safeUrl ? <a className="primary-button" href={safeUrl} target="_blank" rel="noreferrer noopener">View registration link <ArrowUpRight size={16} /></a> : <p>Registration link unavailable.</p>}<button className="control save-button" onClick={onSave}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved to your paths' : 'Save this path'}</button><p className="sample-note">Sample opportunity: this prototype record is for demonstration only. Details are not verified.</p></aside></div>
}

export default App
