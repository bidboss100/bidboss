import { useState } from 'react'
import {
  opportunities as initialOpps, stateLocalOpportunities as initialStateLocal,
  NAICS_LIST, SET_ASIDES, STAGES, STAGE_COLORS, STATE_LOCAL_PORTALS, fmt,
} from '../data/sampleData'
import { Search, MapPin, Calendar, ExternalLink, Plus } from 'lucide-react'
import { Badge, ScoreBadge, StageBadge, SourceBadge, Btn, PageHeader } from '../components/UI'

const SET_ASIDE_COLORS = {
  'SB': '#3B82F6', 'SDVOSB': '#4CAF50', 'VOSB': '#22D3EE',
  '8(a)': '#F5A623', 'WOSB': '#EC4899', 'HUBZone': '#8B5CF6',
}

const SOURCE_FILTERS = ['All', 'Federal', 'State/Local']

const emptyManualEntry = {
  title: '', portal: STATE_LOCAL_PORTALS[0].name, customPortal: '',
  solicitation: '', naics: NAICS_LIST[0].code, value: '', dueDate: '',
  location: '', description: '', link: '',
}

export default function Opportunities() {
  const [opps, setOpps] = useState([
    ...initialOpps.map(o => ({ ...o, source: o.source || 'Federal' })),
    ...initialStateLocal,
  ])
  const [search, setSearch] = useState('')
  const [naicsFilter, setNaicsFilter] = useState('All')
  const [setAsideFilter, setSetAsideFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [drafting, setDrafting] = useState(null)
  const [adding, setAdding] = useState(false)
  const [manualEntry, setManualEntry] = useState(emptyManualEntry)

  const daysUntil = (d) => {
    const diff = new Date(d) - new Date()
    return Math.ceil(diff / 86400000)
  }

  const filtered = opps.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.agency.toLowerCase().includes(q) || o.solicitation.toLowerCase().includes(q)
    const matchNaics = naicsFilter === 'All' || o.naics === naicsFilter
    const matchSetAside = setAsideFilter === 'All' || o.setAside === setAsideFilter
    const matchSource = sourceFilter === 'All' || o.source === sourceFilter
    return matchSearch && matchNaics && matchSetAside && matchSource
  })

  const advanceStage = (id) => {
    setOpps(prev => prev.map(o => {
      if (o.id !== id) return o
      const idx = STAGES.indexOf(o.stage)
      return { ...o, stage: STAGES[Math.min(idx + 1, STAGES.length - 1)] }
    }))
  }

  const submitManualEntry = () => {
    if (!manualEntry.title.trim()) return
    const naicsMeta = NAICS_LIST.find(n => n.code === manualEntry.naics)
    const portalName = manualEntry.portal === 'Other Texas City / County'
      ? (manualEntry.customPortal.trim() || 'Other Texas City / County')
      : manualEntry.portal
    const portalMeta = STATE_LOCAL_PORTALS.find(p => p.name === manualEntry.portal)

    setOpps(prev => ([
      ...prev,
      {
        id: Date.now(),
        solicitation: manualEntry.solicitation.trim() || 'MANUAL ENTRY',
        title: manualEntry.title.trim(),
        agency: portalName,
        office: portalName,
        naics: manualEntry.naics,
        naicsTitle: naicsMeta ? naicsMeta.label : '',
        setAside: null,
        value: Number(manualEntry.value) || 0,
        type: 'FFP',
        postedDate: new Date().toISOString().slice(0, 10),
        dueDate: manualEntry.dueDate || new Date().toISOString().slice(0, 10),
        location: manualEntry.location.trim() || 'TX',
        aiScore: null,
        status: 'Open',
        description: manualEntry.description.trim() || 'Manually added state/local opportunity.',
        stage: 'Identified',
        source: 'State/Local',
        sourceName: portalName,
        sourceUrl: manualEntry.link.trim() || (portalMeta ? portalMeta.url : ''),
      },
    ]))
    setManualEntry(emptyManualEntry)
    setAdding(false)
  }

  return (
    <div>
      <PageHeader title="OPPORTUNITIES" sub="SAM.gov federal + Texas state/local contract opportunities · Live pipeline tracking" />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
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

      {/* Source toggle + manual entry */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '7px', padding: '3px' }}>
          {SOURCE_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              style={{
                fontFamily: 'DM Mono',
                fontSize: '0.68rem',
                padding: '5px 12px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background: sourceFilter === s ? '#F5A623' : 'transparent',
                color: sourceFilter === s ? '#080D18' : '#8892A4',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {s === 'All' ? 'All Sources' : s === 'Federal' ? 'Federal Only' : 'State/Local Only'}
            </button>
          ))}
        </div>
        <Btn variant="outline" onClick={() => setAdding(true)}>
          <Plus size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} /> Add State/Local Opportunity
        </Btn>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {filtered.map(opp => {
          const days = daysUntil(opp.dueDate)
          const urgentColor = days <= 7 ? '#EF4444' : days <= 14 ? '#F59E0B' : '#8892A4'
          const sourceColor = opp.source === 'State/Local' ? '#22D3EE' : '#3B82F6'
          return (
            <div key={opp.id} style={{
              background: '#0D1526',
              border: '1px solid #1E2D4A',
              borderLeft: `3px solid ${sourceColor}`,
              borderRadius: '10px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#F5A62355'}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2D4A'; e.currentTarget.style.borderLeftColor = sourceColor }}
            >
              {/* Top row: source + solicitation + score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <SourceBadge source={opp.source} />
                  <span style={{ fontSize: '0.62rem', color: '#8892A4', fontFamily: 'DM Mono' }}>{opp.solicitation}</span>
                </div>
                {opp.aiScore != null ? <ScoreBadge score={opp.aiScore} /> : <Badge text="MANUAL" color="#8892A4" />}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '0.88rem', color: '#E8EAF0', lineHeight: 1.3, fontFamily: 'DM Mono', fontWeight: 500 }}>
                {opp.title}
              </h3>

              {/* Agency */}
              <p style={{ fontSize: '0.68rem', color: '#8892A4' }}>
                {opp.agency}
                {opp.sourceUrl && (
                  <a href={opp.sourceUrl} target="_blank" rel="noreferrer" style={{ color: sourceColor, marginLeft: '6px' }}>
                    <ExternalLink size={10} style={{ display: 'inline', verticalAlign: '-1px' }} />
                  </a>
                )}
              </p>

              {/* Value */}
              <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.75rem', color: '#4CAF50', lineHeight: 1 }}>{fmt(opp.value)}</p>

              {/* Badges row */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <Badge text={opp.naics} color="#3B82F6" />
                <Badge text={opp.naicsTitle} color="#3B82F6" />
                {opp.setAside && <Badge text={opp.setAside} color={SET_ASIDE_COLORS[opp.setAside] || '#8892A4'} />}
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

      {/* Add State/Local Opportunity Modal */}
      {adding && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setAdding(false)}>
          <div style={{
            background: '#0D1526', border: '1px solid #22D3EE55', borderRadius: '12px',
            padding: '2rem', width: '560px', maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: '#22D3EE', marginBottom: '0.25rem' }}>
              ADD STATE/LOCAL OPPORTUNITY
            </h2>
            <p style={{ fontSize: '0.7rem', color: '#8892A4', marginBottom: '1.25rem' }}>
              Paste in a contract you found on Texas SmartBuy, a county, city, school district, or TxDOT portal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Title *</label>
                <input
                  value={manualEntry.title}
                  onChange={e => setManualEntry(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. County Facilities Landscaping Maintenance"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Source Portal</label>
                  <select
                    value={manualEntry.portal}
                    onChange={e => setManualEntry(p => ({ ...p, portal: e.target.value }))}
                    style={{ width: '100%' }}
                  >
                    {STATE_LOCAL_PORTALS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                {manualEntry.portal === 'Other Texas City / County' && (
                  <div>
                    <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Entity Name</label>
                    <input
                      value={manualEntry.customPortal}
                      onChange={e => setManualEntry(p => ({ ...p, customPortal: e.target.value }))}
                      placeholder="e.g. City of Arlington Purchasing"
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Solicitation / Ref #</label>
                  <input
                    value={manualEntry.solicitation}
                    onChange={e => setManualEntry(p => ({ ...p, solicitation: e.target.value }))}
                    placeholder="Optional"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>NAICS Code</label>
                  <select
                    value={manualEntry.naics}
                    onChange={e => setManualEntry(p => ({ ...p, naics: e.target.value }))}
                    style={{ width: '100%' }}
                  >
                    {NAICS_LIST.map(n => <option key={n.code} value={n.code}>{n.code} — {n.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Estimated Value ($)</label>
                  <input
                    type="number"
                    value={manualEntry.value}
                    onChange={e => setManualEntry(p => ({ ...p, value: e.target.value }))}
                    placeholder="e.g. 640000"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Due Date</label>
                  <input
                    type="date"
                    value={manualEntry.dueDate}
                    onChange={e => setManualEntry(p => ({ ...p, dueDate: e.target.value }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Location</label>
                <input
                  value={manualEntry.location}
                  onChange={e => setManualEntry(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Fort Worth, TX"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Link to Posting</label>
                <input
                  value={manualEntry.link}
                  onChange={e => setManualEntry(p => ({ ...p, link: e.target.value }))}
                  placeholder="https://..."
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  value={manualEntry.description}
                  onChange={e => setManualEntry(p => ({ ...p, description: e.target.value }))}
                  placeholder="Paste scope details from the posting..."
                  rows={3}
                  style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Btn variant="ghost" onClick={() => { setAdding(false); setManualEntry(emptyManualEntry) }}>Cancel</Btn>
              <Btn
                variant="gold"
                onClick={submitManualEntry}
                style={!manualEntry.title.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                Add Opportunity
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
