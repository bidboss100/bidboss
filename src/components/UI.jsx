export function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: '#0D1526',
      border: '1px solid #1E2D4A',
      borderRadius: '10px',
      padding: '1.25rem',
      ...style,
    }}>
      {title && (
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#E8EAF0', marginBottom: '1rem', letterSpacing: '0.06em' }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{ background: '#0D1526', border: '1px solid #1E2D4A', borderRadius: '10px', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.65rem', color: '#8892A4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {Icon && <Icon size={17} color={color} />}
      </div>
      <p style={{ fontFamily: 'Bebas Neue', fontSize: '2.25rem', color, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.62rem', color: '#8892A4', marginTop: '0.5rem' }}>{sub}</p>}
    </div>
  )
}

export function Badge({ text, color = '#8892A4' }) {
  return (
    <span style={{
      fontSize: '0.6rem',
      color,
      border: `1px solid ${color}`,
      borderRadius: '3px',
      padding: '1px 6px',
      whiteSpace: 'nowrap',
      letterSpacing: '0.04em',
    }}>
      {text}
    </span>
  )
}

export function ScoreBadge({ score }) {
  const color = score >= 80 ? '#4CAF50' : score >= 65 ? '#F5A623' : '#EF4444'
  return <Badge text={`AI ${score}%`} color={color} />
}

export function Btn({ children, onClick, variant = 'ghost', size = 'sm', style = {} }) {
  const variants = {
    gold: { background: '#F5A623', color: '#080D18', border: 'none' },
    ghost: { background: 'transparent', color: '#8892A4', border: '1px solid #1E2D4A' },
    outline: { background: 'transparent', color: '#F5A623', border: '1px solid #F5A623' },
    danger: { background: 'transparent', color: '#EF4444', border: '1px solid #EF4444' },
    green: { background: '#4CAF50', color: '#fff', border: 'none' },
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
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2.4rem', color: '#F5A623', lineHeight: 1 }}>{title}</h1>
      {sub && <p style={{ fontSize: '0.7rem', color: '#8892A4', marginTop: '0.3rem' }}>{sub}</p>}
    </div>
  )
}

export function StageBadge({ stage }) {
  const colors = {
    'Identified': '#8892A4',
    'Qualifying': '#3B82F6',
    'Pursuing': '#F59E0B',
    'Proposal': '#F5A623',
    'Submitted': '#8B5CF6',
    'Award': '#4CAF50',
  }
  return <Badge text={stage} color={colors[stage] || '#8892A4'} />
}
