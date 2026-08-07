import { useState } from 'react'
import { opportunities as initialOpps, NAICS_LIST, SET_ASIDES, STAGES, STAGE_COLORS, fmt } from '../data/sampleData'
import { Search, MapPin, Calendar, ExternalLink, Plus } from 'lucide-react'
import { Badge, ScoreBadge, StageBadge, Btn, PageHeader } from '../components/UI'

const SET_ASIDE_COLORS = {
  'SB': '#3B82F6', 'SDVOSB': '#4CAF50', 'VOSB': '#22D3EE',
  '8(a)': '#F5A623', 'WOSB': '#EC4899', 'HUBZone': '#8B5CF6',
}

export default function Opportunities() {
  const [opps, setOpps] = useState(initialOpps)
  const [search, setSearch] = useState('')
  const [naicsFilter, setNaicsFilter] = useState('All')
  const [setAsideFilter, setSetAsideFilter] = useState('All')
  const [drafting, setDrafting] = useState(null)

  const daysUntil = (d) => {
    const diff = new Date(d) - new Date()
    return Math.ceil(diff / 86400000)
  }

  const filtered = opps.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.agency.toLowerCase().includes(q) || o.solicitation.toLowerCase().includes(q)
    const matchNaics = naicsFilter === 'All' || o.naics === naicsFilter
    const matchSetAside = setAsideFilter === 'All' || o.setAside === setAsideFilter
    return matchSearch && matchNaics && matchSetAside
  })

  const advanceStage = (id) => {
    setOpps(prev => prev.map(o => {
      if (o.id !== id) return o
      const idx = STAGES.indexOf(o.stage)
      return { ...o, stage: STAGES[Math.min(idx + 1, STAGES.length - 1)] }
    }))
  }

  return (
    <div>
      <PageHeader title="OPPORTUNITIES" sub="SAM.gov federal contract opportunities · Live pipeline tracking" />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8892A4' }} />
          <input
            placeholder="Search opportunities, agencies, solicitations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2rem', width: '100%' }}
          />
        </div>
        <select value={naicsFilter} onChange={e => setNaicsFilter(e.target.value)} style={{ width: '200px' }}>
          <option value="All">All NAICS Codes</option>
          {NAICS_LIST.map(n => <option key={n.code} value={n.code}>{n.code} — {n.label}</option>)}
        </select>
        <select value={setAsideFilter} onChange={e => setSetAsideFilter(e.target.value)} style={{ width: '160px' }}>
          <option value="All">All Set-Asides</option>
          {SET_ASIDES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: '0.7rem', color: '#8892A4', whiteSpace: 'nowrap' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {filtered.map(opp => {
          const days = daysUntil(opp.dueDate)
          const urgentColor = days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#8892A4'
          return (
            <div key={opp.id} style={{
              background: '#0D1526',
              border: '1px solid #1E2D4A',
              borderRadius: '10px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#F5A62355'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2D4A'}
            >
              {/* Top row: solicitation + score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.62rem', color: '#8892A4', fontFamily: 'DM Mono' }}>{opp.solicitation}</span>
                <ScoreBadge score={opp.aiScore} />
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '0.88rem', color: '#E8EAF0', lineHeight: 1.3, fontFamily: 'DM Mono', fontWeight: 500 }}>
                {opp.title}
              </h3>

              {/* Agency */}
              <p style={{ fontSize: '0.68rem', color: '#8892A4' }}>{opp.agency}</p>

              {/* Value */}
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.75rem', color: '#4CAF50', lineHeight: 1 }}>{fmt(opp.value)}</p>

              {/* Badges row */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Badge text={opp.naics} color="#3B82F6" />
                <Badge text={opp.naicsTitle} color="#3B82F6" />
                <Badge text={opp.setAside} color={SET_ASIDE_COLORS[opp.setAside] || '#8892A4'} />
                <Badge text={opp.type} color="#8892A4" />
              </div>

              {/* Location + Due */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.65rem', color: '#8892A4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} /> {opp.location}
                </span>
                <span style={{ fontSize: '0.65rem', color: urgentColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} /> {days > 0 ? `${days}d left` : 'CLOSED'}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.65rem', color: '#5A6A80', lineHeight: 1.5 }}>
                {opp.description.slice(0, 100)}…
              </p>

              {/* Stage + Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <StageBadge stage={opp.stage} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Btn size="xs" variant="ghost" onClick={() => advanceStage(opp.id)}>
                    + Advance
                  </Btn>
                  <Btn size="xs" variant="outline" onClick={() => setDrafting(opp)}>
                    Draft Proposal
                  </Btn>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Draft Proposal Modal */}
      {drafting && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setDrafting(null)}>
          <div style={{
            background: '#0D1526', border: '1px solid #F5A62355', borderRadius: '12px',
            padding: '2rem', width: '600px', maxWidth: '95vw',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: '#F5A623', marginBottom: '0.5rem' }}>
              PROPOSAL DRAFT — {drafting.solicitation}
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#8892A4', marginBottom: '1.25rem' }}>{drafting.title}</p>

            <div style={{ background: '#111D35', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', fontSize: '0.75rem', lineHeight: 1.8, color: '#C8D0DC' }}>
              <p><strong style={{ color: '#F5A623' }}>COVER LETTER DRAFT</strong></p>
              <br />
              <p>Solicitation No.: {drafting.solicitation}</p>
              <p>Agency: {drafting.agency}</p>
              <p>NAICS: {drafting.naics} — {drafting.naicsTitle}</p>
              <p>Set-Aside: {drafting.setAside}</p>
              <br />
              <p>We are pleased to submit our proposal for {drafting.title}. Our firm brings demonstrated past performance in {drafting.naicsTitle.toLowerCase()} for federal clients, with a proven track record of on-time, within-budget contract delivery.</p>
              <br />
              <p>Our approach prioritizes quality, compliance with FAR/DFARS requirements, and the unique operational needs of {drafting.agency}.</p>
              <br />
              <p>[Technical Approach] [Management Plan] [Past Performance] [Price Volume]</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Btn variant="ghost" onClick={() => setDrafting(null)}>Close</Btn>
              <Btn variant="gold" onClick={() => { alert('Proposal draft copied to clipboard!'); setDrafting(null) }}>Copy Draft</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
