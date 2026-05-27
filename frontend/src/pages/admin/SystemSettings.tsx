import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, ShieldCheck, Plug, CreditCard, Edit3, KeyRound, Lock, RefreshCcw, Eye, CheckCircle, XCircle, Activity, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'warning' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 
                  type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 
                  type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                  'bg-blue-500/20 border-blue-500/50 text-blue-400';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Activity;

  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColor}`}>
      <Icon size={18} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

export function SystemSettings() {
  const [activeMenu, setActiveMenu] = useState('general');
  const [settings, setSettings] = useState<any>({
    real_time_deep_scan: false,
    advanced_heuristics: false,
    auto_block_phishing: false,
    api_scamvn_key: '',
    api_google_key: ''
  });
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  const fetchSettings = async () => {
    try {
      const data = await api.admin.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to sync settings from server.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: any) => {
    try {
      const data = await api.admin.updateSettings({ [key]: value });
      setSettings(data.settings);
      setToast({ message: `System update successful: ${key}`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Configuration error: Connection lost.', type: 'error' });
    }
  };

  const handleToggle = (key: string) => {
    const newVal = !settings[key];
    updateSetting(key, newVal);
  };

  const handleApiKeyChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-brand-500"></div>
          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">CONFIGURATION NODE</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">System Configuration</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Manage your global security protocols, API bridges, and administrative credentials for the Sentinel Prime ecosystem.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveMenu('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded border font-semibold text-sm transition-all ${activeMenu === 'general' ? 'bg-brand-500/10 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/5' : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-dark-700'}`}
            >
              <User size={16} /> General
            </button>
            <button 
              onClick={() => setActiveMenu('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded border font-semibold text-sm transition-all ${activeMenu === 'security' ? 'bg-brand-500/10 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/5' : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-dark-700'}`}
            >
              <ShieldCheck size={16} /> Security Protocols
            </button>
            <button 
              onClick={() => setActiveMenu('api')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded border font-semibold text-sm transition-all ${activeMenu === 'api' ? 'bg-brand-500/10 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/5' : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-dark-700'}`}
            >
              <Plug size={16} /> API Integrations
            </button>
            <button 
              onClick={() => setActiveMenu('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded border font-semibold text-sm transition-all ${activeMenu === 'billing' ? 'bg-brand-500/10 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/5' : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-dark-700'}`}
            >
              <CreditCard size={16} /> Billing & Plan
            </button>
            <button 
              onClick={() => setActiveMenu('database')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded border font-semibold text-sm transition-all ${activeMenu === 'database' ? 'bg-brand-500/10 text-brand-400 border-brand-500/50 shadow-lg shadow-brand-500/5' : 'text-slate-500 hover:text-slate-300 border-transparent hover:border-dark-700'}`}
            >
              <Activity size={16} /> Data Management
            </button>
          </nav>

          <div className="bg-dark-900 border border-dark-700 rounded p-4 mt-8">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">SYSTEM INTEGRITY</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300">All Nodes Operational</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Profile Card */}
          <Card className="bg-dark-800 border-dark-600 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={120} />
            </div>
            <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex items-center gap-8 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-900 border-2 border-dark-600 flex items-center justify-center overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <User size={40} className="text-slate-500" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center border-4 border-dark-800 hover:bg-brand-400 transition-all hover:scale-110">
                    <Edit3 size={14} />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">Sentinel Admin</h2>
                  <p className="text-sm text-slate-400 mb-4 font-mono tracking-wider">admin@scamguardian.ai</p>
                  <div className="flex gap-2">
                    <span className="bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-brand-500/5">ROOT ACCESS</span>
                    <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-purple-500/5">ENTERPRISE CLUSTER</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setToast({ message: 'Syncing Cluster Nodes...', type: 'info' });
                  fetchSettings();
                }} 
                variant="secondary" 
                className="font-bold border-dark-600 hover:border-brand-500/50 bg-dark-900 py-3 px-8 text-xs tracking-widest uppercase shadow-lg"
              >
                Sync Configuration
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Protocols */}
            <Card className="bg-dark-800 border-dark-600 shadow-xl flex flex-col">
              <CardContent className="p-8 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Defense Protocols</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Core AI Synchronization</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Real-time Deep Scan</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Active neural analysis of data packets for zero-day signatures.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('real_time_deep_scan')}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.real_time_deep_scan ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Advanced Heuristics</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Behavioral pattern matching to predict phishing pivots.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('advanced_heuristics')}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.advanced_heuristics ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Auto-block High Risk</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Instant domain blacklisting for entities above 95% confidence.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('auto_block_phishing')}
                      className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.auto_block_phishing ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Control */}
            <Card className="bg-dark-800 border-dark-600 shadow-xl flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Access Control</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Multi-factor Shield</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center text-accent-red border border-accent-red/20">
                    <KeyRound size={20} />
                  </div>
                </div>

                <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 flex-1 mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Lock size={60} />
                  </div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Security Advisory</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-6 relative z-10">
                    Credentials for root access must be rotated every 90 days. We recommend using a FIDO2 hardware key for the enterprise cluster.
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter border-t border-dark-700 pt-4">
                    <span>Last Rotated: 12 Days Ago</span>
                    <span className="text-brand-500">Secure</span>
                  </div>
                </div>

                <button 
                  onClick={() => setToast({message: 'System Redirecting to Auth Hub...', type: 'info'})}
                  className="w-full bg-accent-red hover:bg-red-600 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <Lock size={14} /> Update Credentials
                </button>
              </CardContent>
            </Card>
          </div>

          {/* API Integrations */}
          <Card className="bg-dark-800 border-dark-600 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400 shadow-inner">
                  <Plug size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Nexus Integrations</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">External Intelligence Sync</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* API Source 1 */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                      <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <ShieldCheck size={14} className="text-white" />
                      </div>
                      ScamVN Threat Database
                    </div>
                    <span className="bg-green-500/10 text-green-500 text-[9px] font-bold px-3 py-1 rounded-full border border-green-500/30 tracking-widest uppercase">Connected</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex items-center px-5 py-3 group-focus-within:border-brand-500/50 transition-colors">
                      <input 
                        type="text" 
                        value={settings.api_scamvn_key} 
                        onChange={(e) => handleApiKeyChange('api_scamvn_key', e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono tracking-tight" 
                      />
                      <Eye size={18} className="text-slate-600 cursor-pointer hover:text-slate-300 transition-colors ml-3" />
                    </div>
                    <button 
                      onClick={() => updateSetting('api_scamvn_key', settings.api_scamvn_key)}
                      className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/50 transition-all shadow-lg"
                    >
                      <RefreshCcw size={18} />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-dark-700 to-transparent opacity-50"></div>

                {/* API Source 2 */}
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                      <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center">
                        <ShieldCheck size={14} className="text-white" />
                      </div>
                      Google Safe Browsing API
                    </div>
                    <span className="bg-dark-700 text-slate-400 text-[9px] font-bold px-3 py-1 rounded-full border border-dark-600 tracking-widest uppercase">Standby</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex items-center px-5 py-3 focus-within:border-brand-500/50 transition-colors">
                      <input 
                        type="text" 
                        placeholder="Enter API Key to initialize sync..." 
                        value={settings.api_google_key}
                        onChange={(e) => handleApiKeyChange('api_google_key', e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono placeholder:text-dark-600" 
                      />
                    </div>
                    <Button 
                      onClick={() => updateSetting('api_google_key', settings.api_google_key)}
                      variant="primary" 
                      className="font-bold px-8 rounded-xl shadow-lg shadow-brand-500/20"
                    >
                      Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Management View */}
          {activeMenu === 'database' && (
            <Card className="bg-dark-800 border-dark-600 shadow-xl animate-in slide-in-from-right-4 duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Database Integrity</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">SQLite Core Maintenance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-dark-900 border border-dark-700 p-5 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">DB File Size</p>
                    <p className="text-2xl font-bold text-white">4.2 MB</p>
                    <p className="text-[10px] text-green-500 font-mono mt-1">OPTIMIZED</p>
                  </div>
                  <div className="bg-dark-900 border border-dark-700 p-5 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">Total Records</p>
                    <p className="text-2xl font-bold text-white">12,402</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">ACROSS 8 TABLES</p>
                  </div>
                  <div className="bg-dark-900 border border-dark-700 p-5 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">Last Backup</p>
                    <p className="text-lg font-bold text-white">2h 14m Ago</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">AUTO-SHEDULED</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-900 border border-dark-700 rounded-xl group hover:border-brand-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400">
                        <RefreshCcw size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">Manual Vacuum</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Reclaim unused space and defragment indexes</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-[10px] border-dark-600 font-bold uppercase tracking-widest px-4">Execute</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-900 border border-dark-700 rounded-xl group hover:border-brand-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">Prune Audit Logs</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Remove logs older than 180 days (Recommended)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-[10px] border-dark-600 font-bold uppercase tracking-widest px-4">Purge</Button>
                  </div>

                  <div className="pt-6 border-t border-dark-700 mt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 uppercase tracking-[0.2em] text-xs">
                        Download .SQL Backup
                      </Button>
                      <Button variant="outline" className="flex-1 border-dark-600 text-slate-400 hover:text-white font-bold py-4 rounded-xl uppercase tracking-[0.2em] text-xs">
                        View Schema Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security & API View */}
          {(activeMenu === 'general' || activeMenu === 'security') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              {/* Security Protocols */}
              <Card className="bg-dark-800 border-dark-600 shadow-xl flex flex-col">
                <CardContent className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Defense Protocols</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Core AI Synchronization</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                      <ShieldCheck size={20} />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 mb-1">Real-time Deep Scan</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Active neural analysis of data packets for zero-day signatures.</p>
                      </div>
                      <button 
                        onClick={() => handleToggle('real_time_deep_scan')}
                        className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.real_time_deep_scan ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 mb-1">Advanced Heuristics</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Behavioral pattern matching to predict phishing pivots.</p>
                      </div>
                      <button 
                        onClick={() => handleToggle('advanced_heuristics')}
                        className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.advanced_heuristics ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 mb-1">Auto-block High Risk</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">Instant domain blacklisting for entities above 95% confidence.</p>
                      </div>
                      <button 
                        onClick={() => handleToggle('auto_block_phishing')}
                        className={`w-12 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${settings.auto_block_phishing ? 'bg-brand-500 justify-end' : 'bg-dark-600 justify-start'}`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Control */}
              <Card className="bg-dark-800 border-dark-600 shadow-xl flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Access Control</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Multi-factor Shield</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center text-accent-red border border-accent-red/20">
                      <KeyRound size={20} />
                    </div>
                  </div>

                  <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 flex-1 mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Lock size={60} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Security Advisory</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-6 relative z-10">
                      Credentials for root access must be rotated every 90 days. We recommend using a FIDO2 hardware key for the enterprise cluster.
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter border-t border-dark-700 pt-4">
                      <span>Last Rotated: 12 Days Ago</span>
                      <span className="text-brand-500">Secure</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setToast({message: 'System Redirecting to Auth Hub...', type: 'info'})}
                    className="w-full bg-accent-red hover:bg-red-600 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg shadow-red-500/10 hover:shadow-red-500/30 flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Update Credentials
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* API Integrations View */}
          {activeMenu === 'api' && (
            <Card className="bg-dark-800 border-dark-600 shadow-xl animate-in slide-in-from-right-4 duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400 shadow-inner">
                    <Plug size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Nexus Integrations</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">External Intelligence Sync</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* API Source 1 */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                        <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                          <ShieldCheck size={14} className="text-white" />
                        </div>
                        ScamVN Threat Database
                      </div>
                      <span className="bg-green-500/10 text-green-500 text-[9px] font-bold px-3 py-1 rounded-full border border-green-500/30 tracking-widest uppercase">Connected</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex items-center px-5 py-3 group-focus-within:border-brand-500/50 transition-colors">
                        <input 
                          type="text" 
                          value={settings.api_scamvn_key} 
                          onChange={(e) => handleApiKeyChange('api_scamvn_key', e.target.value)}
                          className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono tracking-tight" 
                        />
                        <Eye size={18} className="text-slate-600 cursor-pointer hover:text-slate-300 transition-colors ml-3" />
                      </div>
                      <button 
                        onClick={() => updateSetting('api_scamvn_key', settings.api_scamvn_key)}
                        className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/50 transition-all shadow-lg"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-dark-700 to-transparent opacity-50"></div>

                  {/* API Source 2 */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                        <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center">
                          <ShieldCheck size={14} className="text-white" />
                        </div>
                        Google Safe Browsing API
                      </div>
                      <span className="bg-dark-700 text-slate-400 text-[9px] font-bold px-3 py-1 rounded-full border border-dark-600 tracking-widest uppercase">Standby</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-dark-900 border border-dark-700 rounded-xl flex items-center px-5 py-3 focus-within:border-brand-500/50 transition-colors">
                        <input 
                          type="text" 
                          placeholder="Enter API Key to initialize sync..." 
                          value={settings.api_google_key}
                          onChange={(e) => handleApiKeyChange('api_google_key', e.target.value)}
                          className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono placeholder:text-dark-600" 
                        />
                      </div>
                      <Button 
                        onClick={() => updateSetting('api_google_key', settings.api_google_key)}
                        variant="primary" 
                        className="font-bold px-8 rounded-xl shadow-lg shadow-brand-500/20"
                      >
                        Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
