import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Opportunities from './pages/Opportunities'
import CRM from './pages/CRM'
import Pipeline from './pages/Pipeline'
import Pursuits from './pages/Pursuits'
import GovConTools from './pages/GovConTools'
import ContractPricer from './pages/ContractPricer'
import Invoicing from './pages/Invoicing'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="crm" element={<CRM />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="pursuits" element={<Pursuits />} />
        <Route path="govcon-tools" element={<GovConTools />} />
        <Route path="contract-pricer" element={<ContractPricer />} />
        <Route path="invoicing" element={<Invoicing />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
