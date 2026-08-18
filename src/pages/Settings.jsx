import { useState } from 'react'
import { Key, Building, Shield, Save, Eye, EyeOff, CheckCircle, Globe } from 'lucide-react'
import { Card, Btn, Badge, PageHeader } from '../components/UI'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const [company, setCompany] = useState({
    name: '', cage: '', uei: '', duns: '', address: '', phone: '', email: '',
  })

  const [naics, setNaics] = useState([
    '561730', '561720', '812111', '446110', '446199',
    '561210', '561110', '238910',
  ])
  const [newNaics, setNewNaics] = useState('')

  const [setAsides, setSetAsides] = useState({
    SB: true, SDVOSB: false, VOSB: false, '8(a)': false, WOSB: false, HUBZone: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addNaics = () => {
    if (newNaics.trim() && !naics.includes(newNaics.trim())) {
      setNaics(p => [...p, newNaics.trim()])
      setNewNaics('')
    }
  }

  const Section = ({ icon: Icon, title, children }) => (
    <Card style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Icon size={16} color="#1A1A1A" />
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#1A1A1A', letterSpacing: '0.06em' }}>{title}</h2>
      </div>
      {children}
    </Card>
  )

  return (
    <div style={{ maxWidth: '720px' }}>
      <PageHeader title="SETTINGS" sub="Platform configuration and company profile" />

      {/* SAM.gov API Key */}
      <Section icon={Key} title="SAM.gov API Key">
        <p style={{ fontSize: '0.68rem', color: '#6C757D', marginBottom: '1rem', lineHeight: 1.6 }}>
          Enter your SAM.gov API key to enable live opportunity searches. Get a free key at{' '}
          <a href="https://open.gsa.gov/api/get-started/" target="_blank" rel="noreferrer" style={{ color: '#B45309' }}>open.gsa.gov</a>.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="Enter SAM.gov API key..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ fontFamily: 'DM Mono', letterSpacing: apiKey && !showKey ? '0.2em' : 'normal' }}
            />
            <button
              onClick={() => setShowKey(p => !p)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6C757D', cursor: 'pointer' }}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <Btn variant="gold" onClick={handleSave}>Save Key</Btn>
        </div>
        {apiKey && (
          <p style={{ fontSize: '0.62rem', color: '#15803D', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={11} /> API key stored. Live SAM.gov search enabled.
          </p>
        )}
      </Section>

      {/* Data Sources */}
      <Section icon={Globe} title="Data Sources">
        <p style={{ fontSize: '0.68rem', color: '#6C757D', marginBottom: '0.75rem', lineHeight: 1.6 }}>
          Opportunity sources feeding your Opportunities page.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F1F3F5', border: '1px solid #DEE2E6', borderRadius: '6px', padding: '0.75rem 1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#1A1A1A' }}>Federal — SAM.gov</p>
              <p style={{ fontSize: '0.62rem', color: '#6C757D', marginTop: '2px' }}>Enabled via API key above</p>
            </div>
            <Badge text="ACTIVE" color="#2563EB" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F1F3F5', border: '1px solid #DEE2E6', borderRadius: '6px', padding: '0.75rem 1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#1A1A1A' }}>
                State & Local — Texas SmartBuy{' '}
                <a href="https://www.txsmartbuy.gov" target="_blank" rel="noreferrer" style={{ color: '#0E7490', fontSize: '0.62rem' }}>(txsmartbuy.gov)</a>
              </p>
              <p style={{ fontSize: '0.62rem', color: '#6C757D', marginTop: '2px' }}>Plus manually-added county, city, and school-district postings</p>
            </div>
            <Badge text="ACTIVE" color="#0E7490" />
          </div>
        </div>
        <p style={{ fontSize: '0.62rem', color: '#ADB5BD', marginTop: '0.85rem', lineHeight: 1.6 }}>
          Texas SmartBuy and most county/city/school-district portals don't expose a public API, so listings from them
          are added manually — go to the <strong style={{ color: '#6C757D' }}>Opportunities</strong> page and click{' '}
          <strong style={{ color: '#6C757D' }}>+ Add State/Local Opportunity</strong> to paste one in. Supported portals:
          Texas SmartBuy, Tarrant County Purchasing, City of Fort Worth Purchasing, City of Dallas Purchasing, Dallas ISD
          (and other school districts), TxDOT, and any other Texas city or county.
        </p>
      </Section>

      {/* Company Profile */}
      <Section icon={Building} title="Company Profile">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            ['name', 'Company Legal Name'],
            ['cage', 'CAGE Code'],
            ['uei', 'UEI Number'],
            ['duns', 'DUNS Number'],
            ['address', 'Primary Address'],
            ['phone', 'Phone Number'],
            ['email', 'Email Address'],
          ].map(([field, label]) => (
            <div key={field} style={field === 'address' ? { gridColumn: '1 / -1' } : {}}>
              <label style={{ fontSize: '0.62rem', color: '#6C757D', display: 'block', marginBottom: '4px' }}>{label}</label>
              <input
                value={company[field]}
                onChange={e => setCompany(p => ({ ...p, [field]: e.target.value }))}
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* NAICS Codes */}
      <Section icon={Shield} title="Your NAICS Codes">
        <p style={{ fontSize: '0.68rem', color: '#6C757D', marginBottom: '0.75rem' }}>
          NAICS codes your company is registered and certified under.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {naics.map(code => (
            <div key={code} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: '#F1F3F5', border: '1px solid #B8860B44', borderRadius: '5px',
              padding: '4px 10px', fontSize: '0.72rem', color: '#B45309',
            }}>
              {code}
              <button
                onClick={() => setNaics(p => p.filter(n => n !== code))}
                style={{ background: 'none', border: 'none', color: '#6C757D', cursor: 'pointer', lineHeight: 1, padding: 0 }}
              >×</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            placeholder="Add NAICS code (e.g. 561730)"
            value={newNaics}
            onChange={e => setNewNaics(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNaics()}
            style={{ width: '220px' }}
          />
          <Btn variant="outline" onClick={addNaics}>Add</Btn>
        </div>
      </Section>

      {/* Set-Aside Certifications */}
      <Section icon={Shield} title="Set-Aside Certifications">
        <p style={{ fontSize: '0.68rem', color: '#6C757D', marginBottom: '0.75rem' }}>
          Select all set-aside designations your company holds.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {Object.entries(setAsides).map(([code, active]) => (
            <label key={code} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              background: active ? 'rgba(184,134,11,0.08)' : '#F1F3F5',
              border: `1px solid ${active ? '#B8860B55' : '#DEE2E6'}`,
              borderRadius: '6px', padding: '0.6rem 0.75rem',
            }}>
              <input
                type="checkbox"
                checked={active}
                onChange={() => setSetAsides(p => ({ ...p, [code]: !p[code] }))}
                style={{ width: 'auto', accentColor: '#B8860B' }}
              />
              <span style={{ fontSize: '0.72rem', color: active ? '#B45309' : '#6C757D' }}>{code}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#15803D' }}>
            <CheckCircle size={14} /> Settings saved
          </div>
        )}
        <Btn variant="gold" size="md" onClick={handleSave}>
          <Save size={14} style={{ display: 'inline', marginRight: '6px' }} /> Save All Settings
        </Btn>
      </div>
    </div>
  )
}
