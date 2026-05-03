import { Outlet, NavLink } from 'react-router-dom';
import { Shield, Home, Search, BookOpen, Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import { Header } from '../components/Header';

export function UserLayout() {
  const navItems = [
    { icon: Home, label: 'Overview', path: '/user/dashboard' },
    { icon: Search, label: 'Threat Scanner', path: '/user/scanner' },
    { icon: MessageSquare, label: 'Community', path: '/user/community' },
    { icon: BookOpen, label: 'Academy', path: '/user/knowledge' },
    { icon: SettingsIcon, label: 'Settings', path: '/user/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-300 font-sans selection:bg-brand-500/30">
      {/* Simplified User Sidebar */}
      <aside className="w-64 border-r border-dark-600 bg-dark-900/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-wide text-sm">FAMILY SHIELD</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Guardian Network</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-brand-600/10 text-brand-500 font-medium border border-brand-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-600">
          <div className="bg-dark-800 border border-dark-600 rounded p-4 text-center">
            <Shield size={24} className="text-brand-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-200">Protection Active</h4>
            <p className="text-[10px] text-slate-400 mt-1">Your family network is secure.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
