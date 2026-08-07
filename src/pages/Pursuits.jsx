import { useState } from 'react'
import { opportunities, fmt } from '../data/sampleData'
import { CheckSquare, Square, Clock, AlertTriangle, MapPin } from 'lucide-react'
import { Card, Badge, ScoreBadge, StageBadge, PageHeader } from '../components/UI'

const CHECKLIST_TEMPLATE = [
  'Review solicitation / RFP documents',
  'Attend pre-proposal conference (if applicable)',
  'Identify teaming partners / subcontractors',
  'Complete technical approach draft',
  'Gather past performance references',
  'Develop management / staffing plan',
  'Build price / cost model',
  'Internal review and red team',
  'Final QC and compliance check',
  'Submit via SAM.gov / portal',
]

export default function Pursuits() {
  const active = opportunities.filter(o => ['Pursuing', 'Proposal', 'Submitted'].includes(o.stage))

  const [checks, setChecks] = useState(() =>
    Object.fromEntries(active.map(o => [o.id, CHECKLIST_TEMPLATE.map(() => false)]))
  )

  const [notes, setNotes] = useState(() =>
    Object.fromEntries(active.map(o => [o.id, '']))
  )

  const toggle = (oppId, idx) => {
    setChecks(prev => ({
      ...prev,
      [oppId]: prev[oppId].map((v, i) => i === idx ? !v : v),
    }))
  }

  const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000)

  return (
    <div>
      <PageHeader title="PURSUITS" sub={`${active.length} active pursuits · Pursuing → Proposal → Submitted`} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {active.map(opp => {
          const done = checks[opp.id]?.filter(Boolean).length || 0
          const total = CHECKLIST_TEMPLATE.length
          const pct = Math.round((done / total) * 100)
          const days = daysLeft(opp.dueDate)
          const urgent = days <= 7

          return (
            <div key={opp.id} style={{
              background: '#0D1526', border: `1px solid ${urgent ? '#EF444433' : '#1E2D4A'}`,
              borderRadius: '10px', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid #1E2D4A',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px' }}>
                    <StageBadge stage={opp.stage} />
                    <ScoreBadge score={opp.aiScore} />
                    <Badge text={opp.setAside} color="#F5A623" />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', color: '#E8EAF0', fontWeight: 500 }}>{opp.title}</h3>
                  <p style={{ fontSize: '0.65rem', color: '#8892A4', marginTop: '2px' }}>{opp.agency}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: '#4CAF50', lineHeight: 1 }}>{fmt(opp.value)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    {urgent ? <AlertTriangle size={12} color="#EF4444" /> : <Clock size={12} color="#8892A4" />}
                    <span style={{ fontSize: '0.65rem', color: urgent ? '#EF4444' : '#8892A4' }}>
                      {days > 0 ? `${days} days left` : 'DEADLINE PASSED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#8892A4', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <MapPin size={10} /> {opp.location}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ padding: '0.75rem 1.25rem 0', borderBottom: '1px solid #111D35' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#8892A4' }}>Proposal Progress</span>
                  <span style={{ fontSize: '0.65rem', color: pct === 100 ? '#4CAF50' : '#F5A623' }}>{done}/{total} tasks · {pct}%</span>
                </div>
                <div style={{ background: '#1E2D4A', borderRadius: '3px', height: '6px', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: '3px',
                    background: pct === 100 ? '#4CAF50' : '#F5A623',
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* Checklist + Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '0.875rem 1.25rem', borderRight: '1px solid #111D35' }}>
                  <p style={{ fontSize: '0.62rem', color: '#8892A4', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Checklist</p>
                  {CHECKLIST_TEMPLATE.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => toggle(opp.id, i)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '3px 0', cursor: 'pointer' }}
                    >
                      {checks[opp.id]?.[i]
                        ? <CheckSquare size={13} color="#4CAF50" />
                        : <Square size={13} color="#1E2D4A" />}
                      <span style={{ fontSize: '0.68rem', color: checks[opp.id]?.[i] ? '#4A5A50' : '#C8D0DC', textDecoration: checks[opp.id]?.[i] ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.875rem 1.25rem' }}>
                  <p style={{ fontSize: '0.62rem', color: '#8892A4', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</p>
                  <textarea
                    value={notes[opp.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [opp.id]: e.target.value }))}
                    placeholder="Add pursuit notes, action items, team assignments..."
                    style={{ width: '100%', minHeight: '160px', resize: 'vertical' }}
                  />
                  <p style={{ fontSize: '0.6rem', color: '#4A5A70', marginTop: '4px' }}>
                    Solicitation: {opp.solicitation} · Due: {opp.dueDate}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8892A4', fontSize: '0.8rem' }}>
            No active pursuits. Move opportunities to "Pursuing" stage from the Pipeline.
          </div>
        )}
      </div>
    </div>
  )
}
