import { Bell, Settings, User, Terminal, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-dark-600 bg-dark-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
          <Terminal size={16} />
          <span>TERMINAL ID: <span className="text-brand-500 font-semibold">SG-{user?.id || '0042'}-ALPHA</span></span>
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
        
        <div className="h-6 w-[1px] bg-dark-700 mx-1"></div>

        <div className="flex items-center gap-3 ml-2 group relative cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">{user?.full_name || 'Guardian User'}</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter mt-1">{user?.role || 'Guest'}</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-500/50 group-hover:shadow-lg group-hover:shadow-brand-500/10">
            {user?.email ? (
              <span className="text-xs font-black text-brand-400">{user.full_name.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={16} className="text-slate-400" />
            )}
          </button>
          
          {/* Simple Dropdown on hover (optional, but logout is needed) */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1">
             <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-dark-700 rounded-lg flex items-center gap-2 transition-colors">
               <Settings size={14} /> Account Settings
             </button>
             <button 
               onClick={handleLogout}
               className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
             >
               <LogOut size={14} /> Sign Out Node
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
