
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminLayout } from './layouts/AdminLayout';
import { UserLayout } from './layouts/UserLayout';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { GlobalThreats } from './pages/admin/GlobalThreats';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SystemSettings } from './pages/admin/SystemSettings';

import { CommunityFeed } from './pages/user/CommunityFeed';
import { KnowledgeBase } from './pages/user/KnowledgeBase';
import { UserDashboard } from './pages/user/UserDashboard';
import { UserSettings } from './pages/user/UserSettings';
import { ThreatScanner } from './pages/user/ThreatScanner';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect to User portal */}
          <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
          
          {/* User Portal */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="scanner" element={<ThreatScanner />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="threat-intel" element={<GlobalThreats />} />
            <Route path="agents" element={<div className="p-6 text-slate-400">Agent Management (WIP)</div>} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
