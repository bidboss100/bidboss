import { opportunities, leads, invoices, STAGES, STAGE_COLORS, fmt } from '../data/sampleData'
import { DollarSign, Target, TrendingUp, Zap } from 'lucide-react'
import { StatCard, Card, ScoreBadge, StageBadge, PageHeader } from '../components/UI'

const NAICS_META = [
  { code: '561730', label: 'Landscaping', color: '#15803D' },
  { code: '561720', label: 'Janitorial', color: '#2563EB' },
  { code: '812111', label: 'Barbering', color: '#B45309' },
  { code: '446110', label: 'Pharmacy', color: '#7C3AED' },
]

export default function Dashboard() {
  const pipelineValue = opportunities.reduce((s, o) => s + o.value, 0)
  const avgScore = Math.round(opportunities.reduce((s, o) => s + o.aiScore, 0) / opportunities.length)
  const hotLeads = leads.filter(l => l.stage === 'Hot').length
  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0)

  const byStage = STAGES.map(stage => ({
    stage,
    count: opportunities.filter(o => o.stage === stage).length,
    value: opportunities.filter(o => o.stage === stage).reduce((s, o) => s + o.value, 0),
  })).filter(s => s.count > 0)

  return (
    <div>
      <PageHeader title="DASHBOARD" sub={`Federal Contracting Overview · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Pipeline" value={fmt(pipelineValue)} icon={DollarSign} color="#15803D" sub="10 active opportunities" />
        <StatCard label="Active Bids" value={opportunities.length} icon={Target} color="#B45309" sub="Across 5 NAICS codes" />
        <StatCard label="Avg AI Score" value={`${avgScore}%`} icon={Zap} color="#2563EB" sub="Win probability index" />
        <StatCard label="Outstanding AR" value={fmt(outstanding)} icon={TrendingUp} color="#7C3AED" sub={`${hotLeads} hot leads active`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Card title="Pipeline by Stage">
          {byStage.map(({ stage, count, value }) => (
            <div key={stage} style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: STAGE_COLORS[stage] }}>{stage}</span>
                <span style={{ fontSize: '0.7rem', color: '#0F172A' }}>{count} opp{count > 1 ? 's' : ''} · {fmt(value)}</span>
              </div>
              <div style={{ background: '#E2E7F0', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(count / opportunities.length) * 100}%`,
                  height: '100%',
                  background: STAGE_COLORS[stage],
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          ))}
        </Card>

        <Card title="Recent Opportunities">
          {opportunities.slice(0, 5).map((opp, i) => (
            <div key={opp.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.6rem 0', borderBottom: i < 4 ? '1px solid #E2E7F0' : 'none',
            }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#0F172A', marginBottom: '3px' }}>
                  {opp.title.length > 38 ? opp.title.slice(0, 38) + '…' : opp.title}
                </p>
                <p style={{ fontSize: '0.62rem', color: '#64748B' }}>
                  {opp.agency.length > 30 ? opp.agency.slice(0, 30) + '…' : opp.agency}
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 500 }}>{fmt(opp.value)}</p>
                <div style={{ marginTop: '3px' }}><ScoreBadge score={opp.aiScore} /></div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Pipeline by NAICS Code">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {NAICS_META.map(({ code, label, color }) => {
            const opps = opportunities.filter(o => o.naics === code)
            const val = opps.reduce((s, o) => s + o.value, 0)
            return (
              <div key={code} style={{
                background: '#F1F4F9', borderRadius: '8px', padding: '1rem',
                borderLeft: `3px solid ${color}`,
              }}>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color, lineHeight: 1 }}>{fmt(val)}</p>
                <p style={{ fontSize: '0.75rem', color: '#0F172A', marginTop: '4px' }}>{label}</p>
                <p style={{ fontSize: '0.62rem', color: '#64748B', marginTop: '2px' }}>NAICS {code} · {opps.length} opp{opps.length !== 1 ? 's' : ''}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <div style={{ marginTop: '1.5rem' }}>
        <Card title="Hot Leads">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {leads.filter(l => l.stage !== 'Cold').map(lead => (
              <div key={lead.id} style={{
                background: '#F1F4F9', borderRadius: '8px', padding: '0.875rem',
                borderLeft: `3px solid ${lead.stage === 'Hot' ? '#DC2626' : '#B45309'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 500 }}>{lead.name}</p>
                  <span style={{
                    fontSize: '0.58rem', padding: '1px 6px', borderRadius: '3px',
                    background: lead.stage === 'Hot' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: lead.stage === 'Hot' ? '#DC2626' : '#B45309',
                  }}>{lead.stage}</span>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#64748B' }}>{lead.company}</p>
                <p style={{ fontSize: '0.65rem', color: '#15803D', marginTop: '4px' }}>{fmt(lead.value)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
