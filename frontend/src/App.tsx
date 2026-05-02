
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { ThreatIntelligence } from './pages/ThreatIntelligence';
import { CommunityFeed } from './pages/CommunityFeed';
import { AuditLogs } from './pages/AuditLogs';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="threat-intel" element={<ThreatIntelligence />} />
          <Route path="community" element={<CommunityFeed />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="settings" element={<Settings />} />
          {/* Fallbacks for other sidebar links */}
          <Route path="agents" element={<div className="p-6 text-slate-400">Agent Management (WIP)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
