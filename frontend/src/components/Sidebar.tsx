
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Radar, Users, FileText, HelpCircle, FileJson, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './Button';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/admin/dashboard' },
    { icon: Radar, label: 'Global Intel', path: '/admin/threat-intel' },
    { icon: Users, label: 'Agent Ops', path: '/admin/agents' },
    { icon: FileText, label: 'System Logs', path: '/admin/audit' },
    { icon: SettingsIcon, label: 'Config Node', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 border-r border-dark-600 bg-dark-900/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-wide text-sm">SCAM GUARDIAN</h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Elite Operations</p>
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

      <div className="p-4 border-t border-dark-600 space-y-4">
        <Button variant="primary" className="w-full">
          DEPLOY SCANNER
        </Button>
        <div className="space-y-2 text-xs">
          <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 p-2">
            <HelpCircle size={14} /> Support
          </a>
          <a href="#" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 p-2">
            <FileJson size={14} /> API Docs
          </a>
        </div>
      </div>
    </aside>
  );
}
