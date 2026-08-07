import { ExternalLink, BookOpen, Search, Shield, FileCheck, Building } from 'lucide-react'
import { Card, Btn, PageHeader } from '../components/UI'

const SET_ASIDES = [
  { code: 'SB', label: 'Small Business', desc: 'General small business set-aside. Requires SBA size standards by NAICS.' },
  { code: 'SDVOSB', label: 'Service-Disabled Veteran-Owned', desc: 'Veteran owned 51%+, service-connected disability. CVE verified.' },
  { code: 'VOSB', label: 'Veteran-Owned Small Business', desc: 'Veteran owned 51%+, any honorable discharge. CVE verified.' },
  { code: '8(a)', label: '8(a) Business Development', desc: 'SBA-certified socially & economically disadvantaged. 9-year program.' },
  { code: 'WOSB', label: "Women-Owned Small Business", desc: 'Women own 51%+, economically disadvantaged (EDWOSB) for some NAICSs.' },
  { code: 'HUBZone', label: 'Historically Underutilized Business', desc: 'Principal office in HUBZone, 35% employees in HUBZone area.' },
]

const NAICS_REF = [
  { code: '561730', label: 'Landscaping Services', size: '$9M avg annual receipts', notes: 'Includes mowing, trimming, tree service, snow removal, irrigation.' },
  { code: '561720', label: 'Janitorial Services', size: '$22M avg annual receipts', notes: 'Building cleaning, custodial, window cleaning, industrial cleaning.' },
  { code: '812111', label: 'Barber Shops', size: '$8M avg annual receipts', notes: 'Military base concessions, MWR operations, full-service barbers.' },
  { code: '446110', label: 'Pharmacies & Drug Stores', size: '$40M avg annual receipts', notes: 'Prescription dispensing, pharmacy staffing, VA/DoD medical support.' },
  { code: '446199', label: 'Health & Personal Care Stores', size: '$40M avg annual receipts', notes: 'Health products, beauty supplies, OTC medicines for commissaries/PX.' },
]

const CONTRACT_TYPES = [
  { type: 'FFP', label: 'Firm Fixed Price', risk: 'Contractor', desc: 'Fixed price regardless of cost. Best when scope is well-defined.' },
  { type: 'IDIQ', label: 'Indefinite Delivery/Indefinite Quantity', risk: 'Shared', desc: 'Task/delivery orders issued against a ceiling. Common for services.' },
  { type: 'T&M', label: 'Time & Materials', risk: 'Government', desc: 'Labor hours + materials at negotiated rates. Requires labor category matrix.' },
  { type: 'CPFF', label: 'Cost Plus Fixed Fee', risk: 'Government', desc: 'Reimburse all costs + fixed fee. Used for R&D and uncertain scope.' },
  { type: 'BPA', label: 'Blanket Purchase Agreement', risk: 'Shared', desc: 'Simplified acquisition vehicle under existing FSS contracts.' },
  { type: 'Concession', label: 'Concession Contract', risk: 'Contractor', desc: 'Operator runs facility on base, pays fee or revenue share to government.' },
]

export default function GovConTools() {
  return (
    <div>
      <PageHeader title="GOVCON TOOLS" sub="Reference tools for federal contracting professionals" />

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'SAM.gov', sub: 'Opportunities & registrations', icon: Search, href: 'https://sam.gov', color: '#3B82F6' },
          { label: 'USASpending.gov', sub: 'Federal spending data', icon: Building, href: 'https://usaspending.gov', color: '#4CAF50' },
          { label: 'SBA Size Standards', sub: 'NAICS size table', icon: Shield, href: 'https://www.sba.gov/document/support-table-size-standards', color: '#F5A623' },
          { label: 'beta.SAM.gov', sub: 'Wage determinations (SCA)', icon: FileCheck, href: 'https://sam.gov/search/?index=wd', color: '#8B5CF6' },
        ].map(({ label, sub, icon: Icon, href, color }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '10px', padding: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color + '66'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2D4A'}
            >
              <div style={{ background: color + '20', borderRadius: '8px', padding: '0.5rem' }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: '#E8EAF0' }}>{label}</p>
                <p style={{ fontSize: '0.62rem', color: '#8892A4' }}>{sub}</p>
              </div>
              <ExternalLink size={12} color="#8892A4" style={{ marginLeft: 'auto' }} />
            </div>
          </a>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Set-Aside Codes */}
        <Card title="Set-Aside Codes Quick Reference">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {SET_ASIDES.map(({ code, label, desc }) => (
              <div key={code} style={{ background: '#111D35', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: '#F5A623' }}>{code}</span>
                  <span style={{ fontSize: '0.68rem', color: '#E8EAF0' }}>{label}</span>
                </div>
                <p style={{ fontSize: '0.62rem', color: '#8892A4', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Contract Types */}
        <Card title="Contract Types Reference">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {CONTRACT_TYPES.map(({ type, label, risk, desc }) => (
              <div key={type} style={{ background: '#111D35', borderRadius: '6px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: '#3B82F6' }}>{type}</span>
                    <span style={{ fontSize: '0.68rem', color: '#E8EAF0' }}>{label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.58rem', padding: '1px 6px', borderRadius: '3px',
                    color: risk === 'Contractor' ? '#EF4444' : risk === 'Government' ? '#4CAF50' : '#F59E0B',
                    border: `1px solid ${risk === 'Contractor' ? '#EF4444' : risk === 'Government' ? '#4CAF50' : '#F59E0B'}`,
                  }}>Risk: {risk}</span>
                </div>
                <p style={{ fontSize: '0.62rem', color: '#8892A4', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* NAICS Reference */}
      <Card title="NAICS Code Reference — Your Portfolio">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
              {['NAICS', 'Description', 'SBA Size Standard', 'Notes'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#8892A4', fontWeight: 400, fontSize: '0.65rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NAICS_REF.map(({ code, label, size, notes }, i) => (
              <tr key={code} style={{ borderBottom: i < NAICS_REF.length - 1 ? '1px solid #111D35' : 'none' }}>
                <td style={{ padding: '0.65rem 0.75rem', color: '#F5A623', fontFamily: 'Bebas Neue', fontSize: '1rem' }}>{code}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#E8EAF0' }}>{label}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#4CAF50', whiteSpace: 'nowrap' }}>{size}</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#8892A4' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Compliance Checklist */}
      <div style={{ marginTop: '1.5rem' }}>
        <Card title="SAM.gov Compliance Checklist">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { item: 'Active SAM.gov Registration', status: 'Required', color: '#EF4444' },
              { item: 'UEI Number Assigned', status: 'Required', color: '#EF4444' },
              { item: 'CAGE Code Verified', status: 'Required', color: '#EF4444' },
              { item: 'Representations & Certifications', status: 'Required', color: '#EF4444' },
              { item: 'Small Business Self-Cert', status: 'If applicable', color: '#F59E0B' },
              { item: 'SDVOSB CVE Verified', status: 'If applicable', color: '#F59E0B' },
              { item: '8(a) SBA Certification', status: 'If applicable', color: '#F59E0B' },
              { item: 'WOSB Certification', status: 'If applicable', color: '#F59E0B' },
              { item: 'Past Performance References', status: 'Highly recommended', color: '#4CAF50' },
            ].map(({ item, status, color }) => (
              <div key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#E8EAF0' }}>{item}</p>
                  <p style={{ fontSize: '0.6rem', color }}>{status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
