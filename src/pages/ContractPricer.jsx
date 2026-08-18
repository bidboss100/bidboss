import { useState } from 'react'
import { Plus, Trash2, Download } from 'lucide-react'
import { Card, Btn, PageHeader } from '../components/UI'

const DEFAULT_CATS = [
  { id: 1, title: 'Project Manager', people: 1, hours: 2080, rate: 55 },
  { id: 2, title: 'Site Supervisor', people: 2, hours: 2080, rate: 42 },
  { id: 3, title: 'Lead Technician', people: 5, hours: 2080, rate: 32 },
  { id: 4, title: 'Technician', people: 10, hours: 2080, rate: 28 },
  { id: 5, title: 'Administrative Support', people: 1, hours: 2080, rate: 25 },
]

const fmt$ = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function ContractPricer() {
  const [cats, setCats] = useState(DEFAULT_CATS)
  const [fringe, setFringe] = useState(35)
  const [overhead, setOverhead] = useState(15)
  const [ga, setGa] = useState(8)
  const [fee, setFee] = useState(10)
  const [escalation, setEscalation] = useState(3)
  const [primeSplit, setPrimeSplit] = useState(60)

  const addCat = () => setCats(p => [...p, { id: Date.now(), title: 'New Labor Category', people: 1, hours: 2080, rate: 30 }])
  const removeCat = (id) => setCats(p => p.filter(c => c.id !== id))
  const updateCat = (id, field, val) => setCats(p => p.map(c => c.id === id ? { ...c, [field]: val } : c))

  const calcYear = (multiplier) => {
    const directLabor = cats.reduce((s, c) => s + (c.people * c.hours * c.rate), 0)
    const withFringe = directLabor * (1 + fringe / 100)
    const withOH = withFringe * (1 + overhead / 100)
    const withGA = withOH * (1 + ga / 100)
    const withFee = withGA * (1 + fee / 100)
    return withFee * multiplier
  }

  const years = [1, 2, 3, 4, 5].map((yr) => {
    const mult = Math.pow(1 + escalation / 100, yr - 1)
    const total = calcYear(mult)
    return { yr, total, prime: total * (primeSplit / 100), sub: total * ((100 - primeSplit) / 100) }
  })

  const totalContract = years.reduce((s, y) => s + y.total, 0)
  const directLabor = cats.reduce((s, c) => s + (c.people * c.hours * c.rate), 0)
  const withFringe = directLabor * (1 + fringe / 100)
  const withOH = withFringe * (1 + overhead / 100)
  const withGA = withOH * (1 + ga / 100)
  const baseYear = withGA * (1 + fee / 100)

  const RateInput = ({ label, value, onChange, suffix = '%' }) => (
    <div>
      <label style={{ fontSize: '0.62rem', color: '#6C757D', display: 'block', marginBottom: '4px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{ width: '70px', textAlign: 'right' }}
        />
        <span style={{ fontSize: '0.7rem', color: '#6C757D' }}>{suffix}</span>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="CONTRACT PRICER" sub="5-year pricing model with wrap rates and prime/sub split" />

      {/* Labor Categories */}
      <Card title="Labor Categories" style={{ marginBottom: '1.25rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', marginBottom: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #DEE2E6' }}>
                {['Labor Category', 'Headcount', 'Annual Hours', 'Hourly Rate', 'Base Cost', ''].map(h => (
                  <th key={h} style={{ textAlign: h === '' ? 'center' : 'left', padding: '0.4rem 0.6rem', color: '#6C757D', fontWeight: 400, fontSize: '0.62rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((cat, i) => {
                const base = cat.people * cat.hours * cat.rate
                return (
                  <tr key={cat.id} style={{ borderBottom: i < cats.length - 1 ? '1px solid #F1F3F5' : 'none' }}>
                    <td style={{ padding: '0.45rem 0.6rem' }}>
                      <input value={cat.title} onChange={e => updateCat(cat.id, 'title', e.target.value)} style={{ width: '180px' }} />
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem' }}>
                      <input type="number" value={cat.people} onChange={e => updateCat(cat.id, 'people', parseInt(e.target.value) || 0)} style={{ width: '70px', textAlign: 'right' }} />
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem' }}>
                      <input type="number" value={cat.hours} onChange={e => updateCat(cat.id, 'hours', parseInt(e.target.value) || 0)} style={{ width: '80px', textAlign: 'right' }} />
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#6C757D', fontSize: '0.7rem' }}>$</span>
                        <input type="number" value={cat.rate} onChange={e => updateCat(cat.id, 'rate', parseFloat(e.target.value) || 0)} style={{ width: '70px', textAlign: 'right' }} />
                      </div>
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem', color: '#15803D', whiteSpace: 'nowrap' }}>{fmt$(base)}</td>
                    <td style={{ padding: '0.45rem 0.6rem', textAlign: 'center' }}>
                      <Btn size="xs" variant="danger" onClick={() => removeCat(cat.id)}><Trash2 size={11} /></Btn>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Btn variant="ghost" onClick={addCat}><Plus size={13} style={{ display: 'inline', marginRight: '4px' }} />Add Labor Category</Btn>
      </Card>

      {/* Rates + Waterfall */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <Card title="Wrap Rate Inputs">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <RateInput label="Fringe Benefits" value={fringe} onChange={setFringe} />
            <RateInput label="Overhead (OH)" value={overhead} onChange={setOverhead} />
            <RateInput label="G&A" value={ga} onChange={setGa} />
            <RateInput label="Fee / Profit" value={fee} onChange={setFee} />
            <RateInput label="Escalation/Year" value={escalation} onChange={setEscalation} />
            <RateInput label="Prime Split" value={primeSplit} onChange={setPrimeSplit} />
          </div>
          <p style={{ fontSize: '0.62rem', color: '#6C757D' }}>
            Prime keeps {primeSplit}% · Sub receives {(100 - primeSplit).toFixed(0)}% of contract value
          </p>
        </Card>

        <Card title="Base Year Cost Waterfall">
          {[
            { label: 'Direct Labor', value: directLabor, color: '#1A1A1A' },
            { label: `+ Fringe (${fringe}%)`, value: withFringe, color: '#2563EB' },
            { label: `+ Overhead (${overhead}%)`, value: withOH, color: '#B45309' },
            { label: `+ G&A (${ga}%)`, value: withGA, color: '#7C3AED' },
            { label: `+ Fee (${fee}%)`, value: baseYear, color: '#B45309' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #F1F3F5' }}>
              <span style={{ fontSize: '0.7rem', color: '#6C757D' }}>{label}</span>
              <span style={{ fontSize: '0.78rem', color, fontWeight: 500 }}>{fmt$(value)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0 0', marginTop: '0.25rem' }}>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#15803D' }}>BASE YEAR TOTAL</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', color: '#15803D' }}>{fmt$(baseYear)}</span>
          </div>
        </Card>
      </div>

      {/* 5-Year Table */}
      <Card title="5-Year Contract Pricing Table">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #DEE2E6' }}>
                {['Period', 'Total Contract Value', `Prime (${primeSplit}%)`, `Sub (${(100 - primeSplit).toFixed(0)}%)`, 'Cumulative'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#6C757D', fontWeight: 400, fontSize: '0.65rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map(({ yr, total, prime, sub }, i) => {
                const cumulative = years.slice(0, i + 1).reduce((s, y) => s + y.total, 0)
                return (
                  <tr key={yr} style={{ borderBottom: i < 4 ? '1px solid #F1F3F5' : 'none', background: yr === 1 ? '#F1F3F5' : 'transparent' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#B45309', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>
                      {yr === 1 ? 'Base Year' : `Option Year ${yr - 1}`}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#1A1A1A', fontWeight: 500 }}>{fmt$(total)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#15803D' }}>{fmt$(prime)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#7C3AED' }}>{fmt$(sub)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#6C757D' }}>{fmt$(cumulative)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #DEE2E6' }}>
                <td style={{ padding: '0.75rem', fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#B45309' }}>TOTAL CONTRACT</td>
                <td style={{ padding: '0.75rem', fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: '#15803D' }}>{fmt$(totalContract)}</td>
                <td style={{ padding: '0.75rem', color: '#15803D' }}>{fmt$(totalContract * primeSplit / 100)}</td>
                <td style={{ padding: '0.75rem', color: '#7C3AED' }}>{fmt$(totalContract * (100 - primeSplit) / 100)}</td>
                <td style={{ padding: '0.75rem', color: '#B45309', fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>{fmt$(totalContract)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
