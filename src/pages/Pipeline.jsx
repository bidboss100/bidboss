import { useState } from 'react'
import { opportunities as initialOpps, STAGES, STAGE_COLORS, fmt } from '../data/sampleData'
import { MapPin, ChevronRight, ChevronLeft } from 'lucide-react'
import { ScoreBadge, Badge, PageHeader } from '../components/UI'

export default function Pipeline() {
  const [opps, setOpps] = useState(initialOpps)

  const move = (id, dir) => {
    setOpps(prev => prev.map(o => {
      if (o.id !== id) return o
      const idx = STAGES.indexOf(o.stage)
      const next = idx + dir
      if (next < 0 || next >= STAGES.length) return o
      return { ...o, stage: STAGES[next] }
    }))
  }

  const totalPipeline = opps.reduce((s, o) => s + o.value, 0)

  return (
    <div>
      <PageHeader title="PIPELINE" sub={`Total pipeline value: ${fmt(totalPipeline)} across ${opps.length} opportunities`} />

      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '70vh' }}>
        {STAGES.map(stage => {
          const cards = opps.filter(o => o.stage === stage)
          const stageValue = cards.reduce((s, o) => s + o.value, 0)
          return (
            <div key={stage} style={{ minWidth: '240px', width: '240px', flexShrink: 0 }}>
              {/* Column header */}
              <div style={{
                background: '#0D1526', borderRadius: '8px 8px 0 0',
                padding: '0.75rem', borderBottom: `2px solid ${STAGE_COLORS[stage]}`,
                marginBottom: '0.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: STAGE_COLORS[stage], letterSpacing: '0.05em' }}>
                    {stage}
                  </span>
                  <span style={{
                    background: STAGE_COLORS[stage] + '22', color: STAGE_COLORS[stage],
                    borderRadius: '12px', padding: '1px 8px', fontSize: '0.65rem',
                  }}>{cards.length}</span>
                </div>
                <p style={{ fontSize: '0.62rem', color: '#8892A4', marginTop: '2px' }}>{fmt(stageValue)}</p>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cards.map(opp => (
                  <div key={opp.id} style={{
                    background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '8px',
                    padding: '0.75rem', fontSize: '0.7rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.58rem', color: '#8892A4' }}>{opp.solicitation}</span>
                      <ScoreBadge score={opp.aiScore} />
                    </div>
                    <p style={{ color: '#E8EAF0', marginBottom: '4px', lineHeight: 1.3 }}>
                      {opp.title.length > 45 ? opp.title.slice(0, 45) + '…' : opp.title}
                    </p>
                    <p style={{ color: '#8892A4', fontSize: '0.62rem', marginBottom: '6px' }}>
                      {opp.agency.length > 28 ? opp.agency.slice(0, 28) + '…' : opp.agency}
                    </p>
                    <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.25rem', color: '#4CAF50' }}>{fmt(opp.value)}</p>

                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '6px', flexWrap: 'wrap' }}>
                      <Badge text={opp.naics} color="#3B82F6" />
                      <Badge text={opp.setAside} color="#F5A623" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.6rem', color: '#8892A4' }}>
                      <MapPin size={10} /> {opp.location}
                    </div>

                    {/* Move buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '8px' }}>
                      {STAGES.indexOf(stage) > 0 && (
                        <button onClick={() => move(opp.id, -1)} style={{
                          flex: 1, padding: '3px', background: 'transparent', border: '1px solid #1E2D4A',
                          borderRadius: '4px', color: '#8892A4', fontSize: '0.6rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
                        }}>
                          <ChevronLeft size={11} /> Back
                        </button>
                      )}
                      {STAGES.indexOf(stage) < STAGES.length - 1 && (
                        <button onClick={() => move(opp.id, 1)} style={{
                          flex: 1, padding: '3px', background: STAGE_COLORS[STAGES[STAGES.indexOf(stage) + 1]] + '22',
                          border: `1px solid ${STAGE_COLORS[STAGES[STAGES.indexOf(stage) + 1]]}44`,
                          borderRadius: '4px', color: STAGE_COLORS[STAGES[STAGES.indexOf(stage) + 1]],
                          fontSize: '0.6rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
                        }}>
                          Advance <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {cards.length === 0 && (
                  <div style={{
                    border: '1px dashed #1E2D4A', borderRadius: '8px', padding: '1.5rem',
                    textAlign: 'center', color: '#2A3A50', fontSize: '0.68rem',
                  }}>
                    No opportunities
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
