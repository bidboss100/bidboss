const CARD_SHADOW = '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.03)'

export function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: '#F8F9FA',
      border: '1px solid #DEE2E6',
      borderRadius: '10px',
      padding: '1.25rem',
      boxShadow: CARD_SHADOW,
      ...style,
    }}>
      {title && (
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#1A1A1A', marginBottom: '1rem', letterSpacing: '0.06em' }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: '#F8F9FA', border: '1px solid #DEE2E6', borderRadius: '10px', padding: '1.25rem', boxShadow: CARD_SHADOW }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.65rem', color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {Icon && <Icon size={17} color={color} />}
      </div>
      <p style={{ fontFamily: 'Bebas Neue', fontSize: '2.25rem', color, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.62rem', color: '#6C757D', marginTop: '0.5rem' }}>{sub}</p>}
    </div>
  )
}

export function Badge({ text, color = '#6C757D' }) {
  return (
    <span style={{
      fontSize: '0.6rem',
      color,
      background: `${color}14`,
      border: `1px solid ${color}55`,
      borderRadius: '4px',
      padding: '2px 7px',
      whiteSpace: 'nowrap',
      letterSpacing: '0.04em',
      fontWeight: 500,
    }}>
      {text}
    </span>
  )
}

export function ScoreBadge({ score }) {
  const color = score >= 80 ? '#15803D' : score >= 65 ? '#B45309' : '#DC2626'
  return <Badge text={`AI ${score}%`} color={color} />
}

export function Btn({ children, onClick, variant = 'ghost', size = 'sm', style = {} }) {
  const variants = {
    gold: { background: '#B8860B', color: '#1A1A1A', border: 'none', fontWeight: 500 },
    ghost: { background: 'transparent', color: '#6C757D', border: '1px solid #DEE2E6' },
    outline: { background: 'transparent', color: '#B8860B', border: '1px solid #B8860B' },
    danger: { background: 'transparent', color: '#DC2626', border: '1px solid #DC2626' },
    green: { background: '#15803D', color: '#fff', border: 'none' },
  }
  const sizes = {
    xs: { fontSize: '0.62rem', padding: '3px 8px' },
    sm: { fontSize: '0.7rem', padding: '5px 12px' },
    md: { fontSize: '0.78rem', padding: '7px 16px' },
  }
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: 'DM Mono',
        transition: 'opacity 0.15s',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
  )
}

export function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.4rem', color: '#1A1A1A', lineHeight: 1 }}>{title}</h1>
      {sub && <p style={{ fontSize: '0.7rem', color: '#6C757D', marginTop: '0.3rem' }}>{sub}</p>}
    </div>
  )
}

export function SourceBadge({ source }) {
  const color = source === 'State/Local' ? '#0E7490' : '#2563EB'
  return <Badge text={source === 'State/Local' ? 'STATE/LOCAL' : 'FEDERAL'} color={color} />
}

export function StageBadge({ stage }) {
  const colors = {
    'Identified': '#6C757D',
    'Qualifying': '#2563EB',
    'Pursuing': '#B45309',
    'Proposal': '#A16207',
    'Submitted': '#7C3AED',
    'Award': '#15803D',
  }
  return <Badge text={stage} color={colors[stage] || '#6C757D'} />
}
