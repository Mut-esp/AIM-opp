import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, Bookmark, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleUserRound, Clock, Compass, Heart, House, Landmark, Lock, MapPin, Search, SlidersHorizontal, Sparkles, Star, TrendingUp, Trophy, Users, X, Zap } from 'lucide-react'
import { categories, districts, interests, opportunities, shops, states } from './data/opportunities'
import { filterOpportunities } from './utils/filterOpportunities'
import { badgeDefinitions } from './data/badges'
import { demoPerson, demoProfile, demoSaved, type DemoPerson } from './data/demoProfile'
import { POINTS, deriveStats, generateRating, loadProfile, saveProfile } from './utils/profile'
import type { Filters, Opportunity, ProfileData, ProfileStats, ProjectEntry, Shop } from './types'
import './styles/global.css'

const initialFilters: Filters = { state: 'Selangor', district: '', category: 'All categories', education: '', budget: '', difficulty: '', audience: '', interest: '', search: '', sort: 'recommended' }
const iconFor: Record<Opportunity['category'], typeof Compass> = { Competition: Sparkles, Workshop: Landmark, Scholarship: Compass, Community: Heart, Spiritual: Landmark, 'Odd job': Users }

function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [view, setView] = useState<'discover' | 'saved' | 'shops' | 'profile'>('discover')
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [step, setStep] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [homeQuery, setHomeQuery] = useState('')
  const [discoverQuery, setDiscoverQuery] = useState('')
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pathway-saved')
      if (stored) return JSON.parse(stored)
      // Seed the demo person's saved paths for presentation.
      localStorage.setItem('pathway-saved', JSON.stringify(demoSaved))
      return demoSaved
    } catch { return demoSaved }
  })
  const [profile, setProfile] = useState<ProfileData>(() => {
    const stored = loadProfile()
    if (Object.keys(stored.entries).length > 0) return stored
    // Seed the demo person's progress for presentation.
    saveProfile(demoProfile)
    return demoProfile
  })
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string }>>([])
  const categoryById = useMemo(() => {
    const map: Record<string, Opportunity['category']> = {}
    opportunities.forEach((item) => { map[item.id] = item.category })
    return map
  }, [])
  const stats = useMemo(() => deriveStats(profile, saved.length, (id) => categoryById[id]), [profile, saved.length, categoryById])
  const earnedBadges = useMemo(() => badgeDefinitions.filter((badge) => badge.earned(stats)), [stats])
  const pushToast = (msg: string) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, msg }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3600)
  }
  const knownBadges = useRef(new Set(earnedBadges.map((badge) => badge.id)))
  useEffect(() => {
    earnedBadges.forEach((badge) => {
      if (!knownBadges.current.has(badge.id)) pushToast(`Badge unlocked — ${badge.name}`)
    })
    knownBadges.current = new Set(earnedBadges.map((badge) => badge.id))
  }, [stats])
  const registerFor = (opportunity: Opportunity) => {
    if (profile.entries[opportunity.id]) return
    const next: ProfileData = { entries: { ...profile.entries, [opportunity.id]: { id: opportunity.id, status: 'registered', registeredAt: new Date().toISOString() } } }
    setProfile(next); saveProfile(next)
    pushToast(`Registered · +${POINTS.register} XP`)
  }
  const completeProject = (opportunity: Opportunity) => {
    const entry = profile.entries[opportunity.id]
    if (!entry || entry.status === 'completed') return
    const rating = generateRating(opportunity.id, opportunity.provider)
    const next: ProfileData = { entries: { ...profile.entries, [opportunity.id]: { ...entry, status: 'completed', completedAt: new Date().toISOString(), rating } } }
    setProfile(next); saveProfile(next)
    pushToast(`Completed · rated ${rating.stars}★ · +${POINTS.complete + rating.stars * POINTS.perStar} XP`)
  }
  const results = useMemo(() => filterOpportunities(view === 'saved' ? opportunities.filter((item) => saved.includes(item.id)) : opportunities, filters), [filters, saved, view])
  const hasFilters = Boolean(filters.search || filters.state !== 'All Malaysia' || filters.district || filters.category !== 'All categories' || filters.education || filters.budget || filters.difficulty || filters.audience || filters.interest)
  const pageSize = 4
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize))
  const visibleResults = results.slice(page * pageSize, (page + 1) * pageSize)
  const featuredOpportunity = opportunities.find((item) => item.featured) ?? opportunities[0]
  const showFeatured = view === 'discover' && results.some((item) => item.id === featuredOpportunity.id)
  const visibleShops = useMemo(() => shops.filter((shop) => {
    const matchesState = filters.state === 'All Malaysia' || shop.state === filters.state
    const matchesDistrict = !filters.district || shop.district === filters.district
    const query = filters.search.trim().toLowerCase()
    const matchesSearch = !query || [shop.name, shop.category, shop.description, shop.location, shop.district].some((value) => value.toLowerCase().includes(query))
    return matchesState && matchesDistrict && matchesSearch
  }), [filters.district, filters.search, filters.state])
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
  const goToShops = () => { setStep(3); setView('shops'); setShowFilters(false); setSelected(null); setPage(0) }

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
        <button className={view === 'shops' ? 'active' : ''} onClick={goToShops}><Landmark size={16} /><span>Local shops</span><b>{shops.length}</b></button>
        <button className={view === 'saved' ? 'active' : ''} onClick={() => { setPage(0); setView('saved'); setStep(3) }}><Bookmark size={16} /><span>Saved paths</span><b>{saved.length}</b></button>
      </nav>
      <div className="rail-divider" />
      <button className={`profile-button ${view === 'profile' ? 'active' : ''}`} onClick={() => { setView('profile'); setShowFilters(false); setSelected(null) }}>
        <CircleUserRound size={16} />
        <span>My profile</span>
        <b className="profile-level">Lv {stats.level.level}</b>
      </button>
      <div className="sidebar-note"><span className="status-dot" />Live directory<br /><strong>Built for Malaysia</strong><br />Small signals. Better directions.</div>
    </aside>

    <main className={`main ${step >= 3 || view === 'profile' ? 'results-mode' : ''}`}>
      <header className="topbar"><span className="topbar-kicker">AIM / 01</span><span className="topbar-status"><span className="status-dot" />Directory synced <span className="topbar-time">09:41 MYT</span></span></header>
      {view === 'profile' && <ProfilePage person={demoPerson} stats={stats} profile={profile} onOpen={(item) => setSelected(item)} onExplore={() => { setView('discover'); setStep(3); setPage(0) }} />}
      {view !== 'profile' && step < 3 && <><p className="eyebrow">A clearer way forward · Malaysia</p><div className="hero-row"><div><h1>Find your next <em>opportunity.</em></h1><p className="hero-copy">A considered directory of competitions, work, learning and community paths.</p></div>{step === 0 && <button className="primary-button find-job-button" onClick={() => setStep(2)}>Tune my search <ArrowUpRight size={16} /></button>}</div></>}

      {view !== 'profile' && step === 0 && <section className="home-console">
        <div className="console-head"><span className="console-index">01</span><div><strong>Start with a signal</strong><span>Search the directory, then refine at your own pace.</span></div><span className="console-light" /></div>
        <div className="home-search"><label className="search"><Search size={17} /><input value={homeQuery} onChange={(event) => setHomeQuery(event.target.value)} placeholder="Search skills, providers, or opportunities" /></label><button className="primary-button search-button" onClick={() => { setFilters((current) => ({ ...current, search: homeQuery })); setPage(0); setStep(2) }}>Search <Search size={15} /></button></div>
        <div className="quick-signals"><span>Try a signal</span>{['Technology', 'Community service', 'Career development'].map((item) => <button key={item} onClick={() => selectSignal(item)}>{item}</button>)}</div>
      </section>}

      {view !== 'profile' && step === 2 && <Wizard title="Tune your opportunity search" description="Choose the same controls available in Discover, then explore your matching paths." label="Step 1 of 1" onClose={() => setStep(0)}><FilterControls filters={filters} update={update} /><button className="primary-button" onClick={() => setStep(3)}>Show my paths <ArrowUpRight size={16} /></button></Wizard>}

      {view !== 'profile' && view !== 'shops' && step >= 3 && <section className="programme-section">
        <div className="results-toolbar"><div><p className="eyebrow">Directory view / {view === 'saved' ? 'Saved paths' : 'All signals'}</p><h2>{view === 'saved' ? 'Your saved paths' : 'Opportunities worth your attention'}</h2><p className="programme-count">{results.length} {results.length === 1 ? 'path' : 'paths'} in the current view</p></div><div className="results-controls"><label className="discover-search"><Search size={15} /><input aria-label="Search discover results" value={discoverQuery} onChange={(event) => setDiscoverQuery(event.target.value)} placeholder="Search the directory" onKeyDown={(event) => { if (event.key === 'Enter') submitDiscoverSearch() }} /></label><button className="primary-button discover-search-button" onClick={submitDiscoverSearch}><Search size={15} /> Search</button><button className="control filter-trigger" onClick={() => setShowFilters(true)}><SlidersHorizontal size={15} /> Refine view</button></div></div>
        {showFeatured && <FeaturedOpportunity opportunity={featuredOpportunity} onOpen={() => setSelected(featuredOpportunity)} onSave={() => toggleSaved(featuredOpportunity.id)} saved={saved.includes(featuredOpportunity.id)} />}
        <div className="results-head"><div><span className="section-label">Browse the collection</span><h3>{hasFilters ? 'Filtered results' : 'Freshly mapped paths'}</h3></div><label className="sort">Sort by <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}><option value="recommended">Recommended</option><option value="soonest">Soonest</option><option value="free">Free first</option></select></label></div>
        <div className="opportunity-grid">{visibleResults.length ? visibleResults.map((item) => <OpportunityCard key={item.id} opportunity={item} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} />) : <div className="empty"><Compass size={25} /><strong>No paths on this setting yet.</strong><span>Try clearing a filter or searching another signal.</span><button className="clear" onClick={clear}>Reset view</button></div>}</div>
        {pageCount > 1 && <div className="pagination"><button className="control" disabled={page === 0} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={15} /> Previous</button><span>Page {page + 1} of {pageCount}</span><button className="control" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)}>Next <ChevronRight size={15} /></button></div>}
      </section>}
      {view === 'shops' && <ShopDirectory filters={filters} update={update} shops={visibleShops} clear={clear} />}
    </main>

    {showFilters && <div className="filter-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowFilters(false)}><section className="filter-panel" role="dialog" aria-modal="true"><div className="filter-panel-head"><div><p className="eyebrow">Control surface</p><h2>Refine your view</h2></div><button className="icon-button" onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={18} /></button></div><FilterControls filters={filters} update={update} /><div className="filter-actions"><button className="clear" onClick={clear}>Clear all</button><button className="primary-button" onClick={() => setShowFilters(false)}>Apply settings <ArrowUpRight size={15} /></button></div></section></div>}
    {selected && <DetailDrawer opportunity={selected} saved={saved.includes(selected.id)} onSave={() => toggleSaved(selected.id)} onClose={() => setSelected(null)} entry={profile.entries[selected.id]} onRegister={() => registerFor(selected)} onComplete={() => completeProject(selected)} />}
    {toasts.length > 0 && <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className="toast"><Zap size={14} /> {toast.msg}</div>)}</div>}
  </div>
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const emptyValue = label === 'State' ? 'All Malaysia' : label === 'Category' ? 'All categories' : ''
  const selectValue = value === 'All Malaysia' || value === 'All categories' ? '' : value
  return <label className="filter-field"><span>{label}</span><select className="filter-select" aria-label={label} value={selectValue} onChange={(event) => onChange(event.target.value || emptyValue)}><option value="">{label === 'State' ? 'All Malaysia' : label === 'Category' ? 'All categories' : `Any ${label.toLowerCase()}`}</option>{options.filter((option) => option !== 'All Malaysia' && option !== 'All categories').map((option) => <option key={option}>{option}</option>)}</select></label>
}

function FilterControls({ filters, update }: { filters: Filters; update: (key: keyof Filters, value: string) => void }) {
  const districtOptions = filters.state === 'All Malaysia' ? districts : districts.filter((district) => opportunities.some((item) => item.state === filters.state && item.district === district))
  return <div className="filters shared-filters"><FilterSelect label="State" value={filters.state} onChange={(value) => { update('state', value); update('district', '') }} options={states} /><FilterSelect label="District" value={filters.district} onChange={(value) => update('district', value)} options={districtOptions} /><FilterSelect label="Category" value={filters.category} onChange={(value) => update('category', value)} options={categories} /><FilterSelect label="Interest" value={filters.interest} onChange={(value) => update('interest', value)} options={interests} /><FilterSelect label="Education" value={filters.education} onChange={(value) => update('education', value)} options={['Secondary', 'Pre-university', 'University', 'Graduate', 'Open to all']} /><FilterSelect label="Difficulty" value={filters.difficulty} onChange={(value) => update('difficulty', value)} options={['Beginner', 'Intermediate', 'Advanced']} /><FilterSelect label="Budget" value={filters.budget} onChange={(value) => update('budget', value)} options={['Free', 'Paid']} /><label className="filter-field filter-search-field"><span>Search</span><div className="filter-search"><Search size={14} /><input aria-label="Search opportunities" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Skills, providers, shops, or titles" /></div></label></div>
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

function ShopCard({ shop }: { shop: Shop }) {
  return <article className="shop-card"><div className="shop-card-top"><div><span className="tag"><Heart size={11} /> Local shop</span><h3>{shop.name}</h3><p className="provider">{shop.category}</p></div><div className="shop-rating"><Star size={14} fill="currentColor" /> {shop.rating.toFixed(1)}<small>{shop.reviewCount} ratings</small></div></div><p className="shop-description">{shop.description}</p><div className="shop-metrics"><span><Heart size={13} /> <strong>{formatLikes(shop.likes)}</strong> likes</span><span className="fee">{shop.price}</span></div><div className="shop-location-line"><MapPin size={13} /> {shop.location}<span>·</span>{shop.district}</div><div className="shop-recognition"><TrendingUp size={13} /> High recognition can open doors with bigger companies.</div></article>
}

function ShopDirectory({ filters, update, shops: visibleShops, clear }: { filters: Filters; update: (key: keyof Filters, value: string) => void; shops: Shop[]; clear: () => void }) {
  const shopDistricts = districts.filter((district) => shops.some((shop) => shop.district === district) || district === filters.district)
  return <section className="shop-page"><div className="results-toolbar"><div><p className="eyebrow">Local business directory / Selangor</p><h2>Shops worth discovering</h2><p className="programme-count">Support local businesses and help great work get noticed.</p></div><span className="shop-location"><MapPin size={13} /> {filters.district || filters.state}</span></div><div className="shop-controls"><FilterSelect label="State" value={filters.state} onChange={(value) => { update('state', value); update('district', '') }} options={states} /><FilterSelect label="District" value={filters.district} onChange={(value) => update('district', value)} options={shopDistricts} /><label className="discover-search shop-search"><Search size={15} /><input aria-label="Search local shops" value={filters.search} onChange={(event) => update('search', event.target.value)} placeholder="Search local shops" /></label><button className="control" onClick={clear}>Reset</button></div><div className="shop-grid">{visibleShops.length ? visibleShops.map((shop) => <ShopCard key={shop.id} shop={shop} />) : <div className="empty"><MapPin size={25} /><strong>No local shops on this setting yet.</strong><span>Try another Selangor district.</span><button className="clear" onClick={clear}>Reset view</button></div>}</div></section>
}

function formatLikes(likes: number) {
  if (likes >= 1000000) return `${(likes / 1000000).toFixed(likes % 1000000 === 0 ? 0 : 1)}M`
  if (likes >= 1000) return `${(likes / 1000).toFixed(likes % 1000 === 0 ? 0 : 1)}k`
  return likes.toString()
}

function DetailDrawer({ opportunity, saved, onSave, onClose, entry, onRegister, onComplete }: { opportunity: Opportunity; saved: boolean; onSave: () => void; onClose: () => void; entry?: ProjectEntry; onRegister: () => void; onComplete: () => void }) {
  const Icon = iconFor[opportunity.category]
  const safeUrl = /^https?:\/\//i.test(opportunity.registrationUrl) ? opportunity.registrationUrl : null
  const status = entry?.status
  return <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="icon-button drawer-close" aria-label="Close details" onClick={onClose}><X /></button><div className="category-icon"><Icon size={20} /></div><span className="tag drawer-tag">{opportunity.category}</span><h2 id="detail-title">{opportunity.title}</h2><p className="provider">{opportunity.provider} · {opportunity.state}, {opportunity.district}</p><p className="description">{opportunity.description}</p><div className="detail-list"><div><CalendarDays /><span><strong>{opportunity.date}</strong><br />Registration closes {opportunity.deadline}</span></div><div><MapPin /><span><strong>{opportunity.venue}</strong><br />{opportunity.format}</span></div><div><Users /><span><strong>{opportunity.audience}</strong><br />{opportunity.difficulty} level · {opportunity.fee === 0 ? 'Free' : `RM${opportunity.fee}`}</span></div><div><Heart /><span><strong>What to bring</strong><br />{opportunity.materials}</span></div></div>

    <div className="progress-block">
      {!status && <>
        <p className="progress-hint">Register to track this path and start earning points.</p>
        <button className="primary-button" onClick={onRegister}><Zap size={15} /> Register & track · +{POINTS.register} XP</button>
      </>}
      {status === 'registered' && <>
        <p className="progress-hint"><Clock size={14} /> Registered — mark it complete once you've finished to get your organizer rating.</p>
        <button className="primary-button" onClick={onComplete}><CheckCircle2 size={15} /> Mark as complete · +{POINTS.complete}+ XP</button>
      </>}
      {status === 'completed' && entry?.rating && <div className="rating-card">
        <div className="rating-card-head"><span className="tag completed-tag"><CheckCircle2 size={12} /> Completed</span><StarRating value={entry.rating.stars} /></div>
        <p className="rating-feedback">“{entry.rating.feedback}”</p>
        <p className="rating-by">— {entry.rating.organizer}</p>
      </div>}
      {safeUrl ? <a className="control save-button" href={safeUrl} target="_blank" rel="noreferrer noopener">Open official registration link <ArrowUpRight size={15} /></a> : null}
    </div>

    <button className="control save-button" onClick={onSave}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved to your paths' : 'Save this path'}</button><p className="sample-note">Sample opportunity: this prototype record is for demonstration only. Ratings and points are mock data stored on this device.</p></aside></div>
}

function StarRating({ value, size = 15 }: { value: number; size?: number }) {
  return <span className="star-rating" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => {
      const fill = Math.max(0, Math.min(1, value - (n - 1)))
      return <span key={n} className="star-slot" style={{ width: size, height: size }}>
        <Star size={size} className="star-bg" />
        <span className="star-fg" style={{ width: `${fill * 100}%` }}><Star size={size} fill="currentColor" /></span>
      </span>
    })}
  </span>
}

function StatTile({ icon, value, label, accent }: { icon: ReactNode; value: ReactNode; label: string; accent?: boolean }) {
  return <div className={`stat-tile ${accent ? 'stat-accent' : ''}`}><div className="stat-icon">{icon}</div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
}

function ProfilePage({ person, stats, profile, onOpen, onExplore }: { person: DemoPerson; stats: ProfileStats; profile: ProfileData; onOpen: (item: Opportunity) => void; onExplore: () => void }) {
  const level = stats.level
  const ringCircumference = 2 * Math.PI * 52
  const activity = useMemo(() => {
    const byId: Record<string, Opportunity> = {}
    opportunities.forEach((item) => { byId[item.id] = item })
    return Object.values(profile.entries)
      .map((entry) => ({ entry, opportunity: byId[entry.id] }))
      .filter((row) => row.opportunity)
      .sort((a, b) => (b.entry.completedAt ?? b.entry.registeredAt).localeCompare(a.entry.completedAt ?? a.entry.registeredAt))
  }, [profile])
  const xpToNext = level.nextLevelAt !== null ? level.nextLevelAt - level.xp : 0

  return <section className="profile-page">
    <section className="profile-hero">
      <div className="profile-identity">
        <div className="avatar" aria-hidden="true">{person.initials}</div>
        <div className="identity-copy">
          <h1>{person.name}</h1>
          <p className="identity-headline">{person.headline}</p>
          <p className="identity-meta"><MapPin size={13} /> {person.location}<span className="dot-sep">·</span>{person.handle}<span className="dot-sep">·</span>{person.joined}</p>
          <span className="level-chip"><Trophy size={13} /> Level {level.level} · {level.title}</span>
        </div>
        <div className="level-ring" role="img" aria-label={`Level ${level.level}, ${Math.round(level.progress * 100)} percent to next level`}>
          <svg viewBox="0 0 120 120" width="112" height="112">
            <circle cx="60" cy="60" r="52" className="ring-track" />
            <circle cx="60" cy="60" r="52" className="ring-fill" strokeDasharray={ringCircumference} strokeDashoffset={ringCircumference * (1 - level.progress)} transform="rotate(-90 60 60)" />
          </svg>
          <div className="level-ring-center"><span className="level-num">{level.level}</span><span className="level-word">LEVEL</span></div>
        </div>
      </div>
      <div className="xp-bar" role="img" aria-label={`${level.xp} total XP`}><span className="xp-fill" style={{ width: `${level.progress * 100}%` }} /></div>
      <div className="xp-footer">
        <p className="xp-line"><Zap size={14} /> <strong>{level.xp.toLocaleString()} XP</strong>{level.nextLevelAt !== null ? <span className="muted"> · {xpToNext.toLocaleString()} XP to Level {level.level + 1}</span> : <span className="muted"> · max tier reached</span>}</p>
        <button className="primary-button" onClick={onExplore}><Compass size={15} /> Find a project to grind</button>
      </div>
    </section>

    <div className="stat-row">
      <StatTile icon={<Zap size={18} />} value={level.xp.toLocaleString()} label="Total XP" accent />
      <StatTile icon={<CheckCircle2 size={18} />} value={stats.completedCount} label="Completed" />
      <StatTile icon={<Clock size={18} />} value={stats.inProgressCount} label="In progress" />
      <StatTile icon={<Bookmark size={18} />} value={stats.savedCount} label="Saved" />
      <StatTile icon={<Star size={18} />} value={stats.averageRating !== null ? stats.averageRating.toFixed(1) : '—'} label={`Avg rating${stats.totalRatings ? ` · ${stats.totalRatings}` : ''}`} />
      <StatTile icon={<TrendingUp size={18} />} value={stats.categoriesCompleted} label="Categories" />
    </div>

    <section className="profile-block">
      <div className="profile-block-head"><div><span className="section-label">Collection</span><h3>Badges</h3></div><p className="muted">{badgeDefinitions.filter((b) => b.earned(stats)).length} of {badgeDefinitions.length} unlocked</p></div>
      <div className="badge-grid">{badgeDefinitions.map((badge) => {
        const earned = badge.earned(stats)
        const BadgeIcon = badge.icon
        const prog = Math.round(badge.progress(stats) * 100)
        return <div key={badge.id} className={`badge ${earned ? `earned tier-${badge.tier}` : 'locked'}`} title={badge.description}>
          <div className="badge-icon">{earned ? <BadgeIcon size={22} /> : <Lock size={18} />}</div>
          <div className="badge-name">{badge.name}</div>
          <div className="badge-desc">{badge.description}</div>
          {!earned && <div className="badge-progress"><span style={{ width: `${prog}%` }} /></div>}
        </div>
      })}</div>
    </section>

    <section className="profile-block">
      <div className="profile-block-head"><div><span className="section-label">History</span><h3>Your activity</h3></div></div>
      {activity.length === 0 ? <div className="empty profile-empty"><Trophy size={24} /><strong>No projects yet.</strong><span>Register for an opportunity to start your streak.</span><button className="clear" onClick={onExplore}>Browse opportunities</button></div> : <ul className="activity-list">{activity.map(({ entry, opportunity }) => {
        const Icon = iconFor[opportunity.category]
        return <li key={entry.id} className="activity-row"><button className="activity-main" onClick={() => onOpen(opportunity)}><span className="category-icon activity-icon"><Icon size={16} /></span><span className="activity-copy"><strong>{opportunity.title}</strong><small>{opportunity.provider} · {opportunity.category}</small></span></button><span className="activity-end">{entry.status === 'completed' && entry.rating ? <><StarRating value={entry.rating.stars} size={13} /><span className="status-pill done"><CheckCircle2 size={12} /> Completed</span></> : <span className="status-pill ongoing"><Clock size={12} /> Registered</span>}</span></li>
      })}</ul>}
    </section>
  </section>
}

export default App
