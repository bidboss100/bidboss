import { useState } from 'react'
import { invoices as initialInvoices, fmt } from '../data/sampleData'
import { Plus, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, StatCard, Badge, Btn, PageHeader } from '../components/UI'

const STATUS_COLORS = { Paid: '#15803D', Sent: '#2563EB', Draft: '#6C757D', Overdue: '#DC2626' }
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
        <StatCard label="Paid This Period" value={fmt(paid)} icon={CheckCircle} color="#15803D" sub="Collected revenue" />
        <StatCard label="Outstanding" value={fmt(outstanding)} icon={Clock} color="#2563EB" sub="Awaiting payment" />
        <StatCard label="Overdue" value={fmt(overdue)} icon={AlertTriangle} color="#DC2626" sub="Past due date" />
        <StatCard label="Draft Invoices" value={drafts} icon={DollarSign} color="#6C757D" sub="Not yet sent" />
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#1A1A1A' }}>ALL INVOICES</h2>
        <Btn variant="gold" onClick={() => setShowForm(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: '4px' }} /> New Invoice
        </Btn>
      </div>

      {/* New Invoice Form */}
      {showForm && (
        <Card style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#1A1A1A', marginBottom: '1rem' }}>NEW INVOICE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[['client','Client / Agency *'],['contract','Contract Number'],['amount','Amount ($) *'],['due','Due Date']].map(([field, label]) => (
              <div key={field}>
                <label style={{ fontSize: '0.62rem', color: '#6C757D', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  type={field === 'due' ? 'date' : field === 'amount' ? 'number' : 'text'}
                  value={form[field]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.62rem', color: '#6C757D', display: 'block', marginBottom: '4px' }}>Status</label>
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
          const color = STATUS_COLORS[inv.status] || '#6C757D'
          const Icon = STATUS_ICONS[inv.status] || DollarSign
          return (
            <div key={inv.id} style={{
              background: '#F8F9FA', border: `1px solid ${inv.status === 'Overdue' ? '#DC262633' : '#DEE2E6'}`,
              borderRadius: '10px', padding: '1rem 1.25rem',
              display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1.5rem', alignItems: 'center',
              boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
            }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: '#B45309' }}>{inv.id}</span>
                  <span style={{
                    fontSize: '0.6rem', padding: '1px 7px', borderRadius: '3px',
                    background: color + '22', color, border: `1px solid ${color}44`,
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    <Icon size={10} /> {inv.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#1A1A1A' }}>{inv.client}</p>
                <p style={{ fontSize: '0.62rem', color: '#6C757D', marginTop: '2px' }}>{inv.contract}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: inv.status === 'Paid' ? '#15803D' : inv.status === 'Overdue' ? '#DC2626' : '#1A1A1A' }}>
                  {fmt$(inv.amount)}
                </p>
              </div>

              <div style={{ fontSize: '0.65rem', color: '#6C757D', textAlign: 'right', whiteSpace: 'nowrap' }}>
                <p>Issued: {inv.issued}</p>
                <p style={{ color: inv.status === 'Overdue' ? '#DC2626' : '#6C757D' }}>Due: {inv.due}</p>
              </div>

              <div>
                <select
                  value={inv.status}
                  onChange={e => updateStatus(inv.id, e.target.value)}
                  style={{ width: '100px', border: `1px solid ${color}55`, color, background: '#F1F3F5', padding: '4px 8px', fontSize: '0.68rem' }}
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
