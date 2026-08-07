import { useState } from 'react'
import { leads as initialLeads, fmt } from '../data/sampleData'
import { Plus, Phone, Mail, Trash2, Users } from 'lucide-react'
import { Card, StatCard, Badge, Btn, PageHeader } from '../components/UI'

const STAGES = ['Cold', 'Warm', 'Hot']
const STAGE_COLORS = { Cold: '#8892A4', Warm: '#F59E0B', Hot: '#EF4444' }

const emptyLead = { name: '', company: '', title: '', phone: '', email: '', stage: 'Cold', notes: '', value: '' }

export default function CRM() {
  const [leads, setLeads] = useState(initialLeads)
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyLead)

  const filtered = filter === 'All' ? leads : leads.filter(l => l.stage === filter)

  const addLead = () => {
    if (!form.name || !form.company) return
    setLeads(prev => [...prev, {
      ...form,
      id: Date.now(),
      value: parseFloat(form.value) || 0,
      lastContact: new Date().toISOString().slice(0, 10),
    }])
    setForm(emptyLead)
    setShowForm(false)
  }

  const deleteLead = (id) => setLeads(prev => prev.filter(l => l.id !== id))

  const changeStage = (id, stage) => setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l))

  const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0)

  return (
    <div>
      <PageHeader title="CRM & LEADS" sub="Contact relationship management · Federal contracting pipeline" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total Contacts" value={leads.length} icon={Users} color="#3B82F6" sub="In your network" />
        <StatCard label="Hot Leads" value={leads.filter(l => l.stage === 'Hot').length} color="#EF4444" sub="Requires action" />
        <StatCard label="Warm Leads" value={leads.filter(l => l.stage === 'Warm').length} color="#F59E0B" sub="In progress" />
        <StatCard label="Pipeline Value" value={fmt(totalValue)} color="#4CAF50" sub="Weighted opportunity" />
      </div>

      {/* Filter tabs + Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', ...STAGES].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '5px 14px', borderRadius: '5px', fontSize: '0.72rem',
              background: filter === s ? (STAGE_COLORS[s] || '#F5A623') : 'transparent',
              color: filter === s ? '#fff' : '#8892A4',
              border: `1px solid ${filter === s ? (STAGE_COLORS[s] || '#F5A623') : '#1E2D4A'}`,
              cursor: 'pointer',
            }}>
              {s} {s !== 'All' && `(${leads.filter(l => l.stage === s).length})`}
            </button>
          ))}
        </div>
        <Btn variant="gold" onClick={() => setShowForm(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: '4px' }} /> Add Lead
        </Btn>
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <Card style={{ marginBottom: '1rem', borderColor: '#F5A62344' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#F5A623', marginBottom: '1rem' }}>NEW LEAD</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[['name','Name *'],['company','Company *'],['title','Title'],['phone','Phone'],['email','Email'],['value','Opp. Value ($)']].map(([field, label]) => (
              <div key={field}>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={label} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Stage</label>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Notes</label>
              <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(emptyLead) }}>Cancel</Btn>
            <Btn variant="gold" onClick={addLead}>Save Lead</Btn>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                {['Name', 'Company / Title', 'Stage', 'Value', 'Contact', 'Last Contact', 'Notes', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#8892A4', fontWeight: 400, fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #111D35' : 'none' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#E8EAF0', whiteSpace: 'nowrap' }}>{lead.name}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <p style={{ color: '#E8EAF0' }}>{lead.company}</p>
                    <p style={{ fontSize: '0.62rem', color: '#8892A4' }}>{lead.title}</p>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <select
                      value={lead.stage}
                      onChange={e => changeStage(lead.id, e.target.value)}
                      style={{
                        background: 'transparent', border: `1px solid ${STAGE_COLORS[lead.stage]}`,
                        color: STAGE_COLORS[lead.stage], width: 'auto', padding: '2px 6px', fontSize: '0.65rem',
                      }}
                    >
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#4CAF50', whiteSpace: 'nowrap' }}>{lead.value ? fmt(lead.value) : '—'}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {lead.phone && <a href={`tel:${lead.phone}`} style={{ color: '#8892A4' }}><Phone size={13} /></a>}
                      {lead.email && <a href={`mailto:${lead.email}`} style={{ color: '#8892A4' }}><Mail size={13} /></a>}
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#8892A4', whiteSpace: 'nowrap' }}>{lead.lastContact}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#5A6A80', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.notes}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <Btn size="xs" variant="danger" onClick={() => deleteLead(lead.id)}><Trash2 size={11} /></Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: '#8892A4', padding: '2rem', fontSize: '0.75rem' }}>No leads in this category.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
