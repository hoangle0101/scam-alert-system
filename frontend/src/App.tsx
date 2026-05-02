
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { CommunityFeed } from './pages/CommunityFeed';
import { AuditLogs } from './pages/AuditLogs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="threat-intel" element={<ThreatIntelligence />} />
          <Route path="community" element={<CommunityFeed />} />
          <Route path="audit" element={<AuditLogs />} />
          {/* Fallbacks for other sidebar links */}
          <Route path="agents" element={<div className="p-6 text-slate-400">Agent Management (WIP)</div>} />
          <Route path="knowledge" element={<div className="p-6 text-slate-400">Knowledge Base (WIP)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
