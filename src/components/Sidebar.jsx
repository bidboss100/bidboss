import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Search, Users, GitBranch, Target,
  Wrench, Calculator, FileText, Settings,
} from 'lucide-react'

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/opportunities', label: 'Opportunities', icon: Search },
  { path: '/crm', label: 'CRM & Leads', icon: Users },
  { path: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { path: '/pursuits', label: 'Pursuits', icon: Target },
  { path: '/govcon-tools', label: 'GovCon Tools', icon: Wrench },
  { path: '/contract-pricer', label: 'Contract Pricer', icon: Calculator },
  { path: '/invoicing', label: 'Invoicing', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '215px',
      minWidth: '215px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#FFFFFF',
      borderRight: '1px solid #E2E7F0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '1.5rem 1.25rem 1.25rem', borderBottom: '1px solid #E2E7F0' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: '#F5A623', letterSpacing: '0.12em', lineHeight: 1 }}>
          BID BOSS
        </div>
        <div style={{ fontSize: '0.58rem', color: '#94A3B8', marginTop: '3px', letterSpacing: '0.1em' }}>
          FEDERAL CONTRACTING PLATFORM
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0.75rem 0.6rem', overflowY: 'auto' }}>
        {NAV.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.55rem 0.75rem',
            marginBottom: '2px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.75rem',
            color: isActive ? '#B45309' : '#64748B',
            background: isActive ? 'rgba(245,166,35,0.12)' : 'transparent',
            borderLeft: `2px solid ${isActive ? '#F5A623' : 'transparent'}`,
            fontWeight: isActive ? 500 : 400,
            transition: 'all 0.12s',
          })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #E2E7F0' }}>
        <div style={{ fontSize: '0.58rem', color: '#94A3B8' }}>v1.0.0 · SAM.gov Ready</div>
      </div>
    </aside>
  )
}
