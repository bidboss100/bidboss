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
              background: '#FFFFFF', border: `1px solid ${urgent ? '#DC262633' : '#E2E7F0'}`,
              borderRadius: '10px', overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
            }}>
              {/* Header */}
              <div style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid #E2E7F0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px' }}>
                    <StageBadge stage={opp.stage} />
                    <ScoreBadge score={opp.aiScore} />
                    <Badge text={opp.setAside} color="#B45309" />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 500 }}>{opp.title}</h3>
                  <p style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '2px' }}>{opp.agency}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: '#15803D', lineHeight: 1 }}>{fmt(opp.value)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    {urgent ? <AlertTriangle size={12} color="#DC2626" /> : <Clock size={12} color="#64748B" />}
                    <span style={{ fontSize: '0.65rem', color: urgent ? '#DC2626' : '#64748B' }}>
                      {days > 0 ? `${days} days left` : 'DEADLINE PASSED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <MapPin size={10} /> {opp.location}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ padding: '0.75rem 1.25rem 0', borderBottom: '1px solid #F1F4F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748B' }}>Proposal Progress</span>
                  <span style={{ fontSize: '0.65rem', color: pct === 100 ? '#15803D' : '#B45309' }}>{done}/{total} tasks · {pct}%</span>
                </div>
                <div style={{ background: '#E2E7F0', borderRadius: '3px', height: '6px', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: '3px',
                    background: pct === 100 ? '#15803D' : '#F5A623',
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>

              {/* Checklist + Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '0.875rem 1.25rem', borderRight: '1px solid #F1F4F9' }}>
                  <p style={{ fontSize: '0.62rem', color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Checklist</p>
                  {CHECKLIST_TEMPLATE.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => toggle(opp.id, i)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '3px 0', cursor: 'pointer' }}
                    >
                      {checks[opp.id]?.[i]
                        ? <CheckSquare size={13} color="#15803D" />
                        : <Square size={13} color="#E2E7F0" />}
                      <span style={{ fontSize: '0.68rem', color: checks[opp.id]?.[i] ? '#94A3B8' : '#1E293B', textDecoration: checks[opp.id]?.[i] ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.875rem 1.25rem' }}>
                  <p style={{ fontSize: '0.62rem', color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</p>
                  <textarea
                    value={notes[opp.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [opp.id]: e.target.value }))}
                    placeholder="Add pursuit notes, action items, team assignments..."
                    style={{ width: '100%', minHeight: '160px', resize: 'vertical' }}
                  />
                  <p style={{ fontSize: '0.6rem', color: '#94A3B8', marginTop: '4px' }}>
                    Solicitation: {opp.solicitation} · Due: {opp.dueDate}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B', fontSize: '0.8rem' }}>
            No active pursuits. Move opportunities to "Pursuing" stage from the Pipeline.
          </div>
        )}
      </div>
    </div>
  )
}
