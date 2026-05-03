
import { Bell, Settings, User, Terminal, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-dark-600 bg-dark-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
          <Terminal size={16} />
          <span>TERMINAL ID: <span className="text-brand-500 font-semibold">SG-0042-ALPHA</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-600/50 text-sm">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
          <span className="text-brand-500 font-mono font-medium tracking-wide">SYSTEM STATUS: OPTIMAL</span>
        </div>
        
        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-slate-200 transition-colors" title="Toggle Light/Dark Mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Settings size={20} />
        </button>
        <button className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center overflow-hidden ml-2">
          <User size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}
