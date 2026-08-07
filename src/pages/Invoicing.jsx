import { useState } from 'react'
import { invoices as initialInvoices, fmt } from '../data/sampleData'
import { Plus, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, StatCard, Badge, Btn, PageHeader } from '../components/UI'

const STATUS_COLORS = { Paid: '#4CAF50', Sent: '#3B82F6', Draft: '#8892A4', Overdue: '#EF4444' }
const STATUS_ICONS = { Paid: CheckCircle, Sent: Clock, Draft: DollarSign, Overdue: AlertTriangle }

const emptyInvoice = { client: '', contract: '', amount: '', due: '', status: 'Draft' }

const fmt$ = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Invoicing() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyInvoice)

  const paid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)
  const drafts = invoices.filter(i => i.status === 'Draft').length

  const addInvoice = () => {
    if (!form.client || !form.amount) return
    const id = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`
    setInvoices(prev => [...prev, {
      ...form,
      id,
      amount: parseFloat(form.amount) || 0,
      issued: new Date().toISOString().slice(0, 10),
    }])
    setForm(emptyInvoice)
    setShowForm(false)
  }

  const updateStatus = (id, status) => setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i))

  return (
    <div>
      <PageHeader title="INVOICING" sub="Contract billing and accounts receivable" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Paid This Period" value={fmt(paid)} icon={CheckCircle} color="#4CAF50" sub="Collected revenue" />
        <StatCard label="Outstanding" value={fmt(outstanding)} icon={Clock} color="#3B82F6" sub="Awaiting payment" />
        <StatCard label="Overdue" value={fmt(overdue)} icon={AlertTriangle} color="#EF4444" sub="Past due date" />
        <StatCard label="Draft Invoices" value={drafts} icon={DollarSign} color="#8892A4" sub="Not yet sent" />
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#E8EAF0' }}>ALL INVOICES</h2>
        <Btn variant="gold" onClick={() => setShowForm(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: '4px' }} /> New Invoice
        </Btn>
      </div>

      {/* New Invoice Form */}
      {showForm && (
        <Card style={{ marginBottom: '1rem', borderColor: '#F5A62344' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#F5A623', marginBottom: '1rem' }}>NEW INVOICE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[['client','Client / Agency *'],['contract','Contract Number'],['amount','Amount ($) *'],['due','Due Date']].map(([field, label]) => (
              <div key={field}>
                <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  type={field === 'due' ? 'date' : field === 'amount' ? 'number' : 'text'}
                  value={form[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.62rem', color: '#8892A4', display: 'block', marginBottom: '4px' }}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {['Draft', 'Sent', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm(emptyInvoice) }}>Cancel</Btn>
            <Btn variant="gold" onClick={addInvoice}>Create Invoice</Btn>
          </div>
        </Card>
      )}

      {/* Invoice cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {invoices.map(inv => {
          const color = STATUS_COLORS[inv.status] || '#8892A4'
          const Icon = STATUS_ICONS[inv.status] || DollarSign
          return (
            <div key={inv.id} style={{
              background: '#0D1526', border: `1px solid ${inv.status === 'Overdue' ? '#EF444433' : '#1E2D4A'}`,
              borderRadius: '10px', padding: '1rem 1.25rem',
              display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1.5rem', alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: '#F5A623' }}>{inv.id}</span>
                  <span style={{
                    fontSize: '0.6rem', padding: '1px 7px', borderRadius: '3px',
                    background: color + '22', color, border: `1px solid ${color}44`,
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    <Icon size={10} /> {inv.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#E8EAF0' }}>{inv.client}</p>
                <p style={{ fontSize: '0.62rem', color: '#8892A4', marginTop: '2px' }}>{inv.contract}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: inv.status === 'Paid' ? '#4CAF50' : inv.status === 'Overdue' ? '#EF4444' : '#E8EAF0' }}>
                  {fmt$(inv.amount)}
                </p>
              </div>

              <div style={{ fontSize: '0.65rem', color: '#8892A4', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <p>Issued: {inv.issued}</p>
                <p style={{ color: inv.status === 'Overdue' ? '#EF4444' : '#8892A4' }}>Due: {inv.due}</p>
              </div>

              <div>
                <select
                  value={inv.status}
                  onChange={e => updateStatus(inv.id, e.target.value)}
                  style={{ width: '100px', border: `1px solid ${color}55`, color, background: '#111D35', padding: '4px 8px', fontSize: '0.68rem' }}
                >
                  {['Draft', 'Sent', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
