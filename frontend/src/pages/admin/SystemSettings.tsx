import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, ShieldCheck, Plug, Users, CreditCard, Edit3, KeyRound, Lock, RefreshCcw, Eye, Settings as SettingsIcon } from 'lucide-react';

export function SystemSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-slate-500"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CONFIGURATION NODE</span>
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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-dark-700/50 text-slate-200 rounded border border-dark-600 font-semibold text-sm transition-colors">
              <User size={16} className="text-slate-400" /> General
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-dark-800/50 rounded border border-transparent hover:border-dark-700 font-semibold text-sm transition-colors">
              <ShieldCheck size={16} /> Security Protocols
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-dark-800/50 rounded border border-transparent hover:border-dark-700 font-semibold text-sm transition-colors">
              <Plug size={16} /> API Integrations
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-dark-800/50 rounded border border-transparent hover:border-dark-700 font-semibold text-sm transition-colors">
              <Users size={16} /> Family Shield
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-dark-800/50 rounded border border-transparent hover:border-dark-700 font-semibold text-sm transition-colors">
              <CreditCard size={16} /> Billing & Plan
            </button>
          </nav>

          <div className="bg-dark-900 border border-dark-700 rounded p-4 mt-8">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">SYSTEM STATUS</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-300">All Nodes Operational</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Profile Card */}
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-dark-700 to-dark-900 border-2 border-dark-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <User size={32} className="text-slate-500" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center border-2 border-dark-800 hover:bg-brand-400 transition-colors">
                    <Edit3 size={12} />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Sentinel Administrator</h2>
                  <p className="text-sm text-slate-400 mb-3 font-mono">admin@scamguardian.ai</p>
                  <div className="flex gap-2">
                    <span className="bg-dark-700 border border-dark-600 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">ROOT ACCESS</span>
                    <span className="bg-dark-700 border border-dark-600 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">PRO ENTERPRISE</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="font-semibold whitespace-nowrap">Export Profile Logs</Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Protocols */}
            <Card className="bg-dark-800 border-dark-600 h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Security Protocols</h3>
                    <p className="text-[11px] text-slate-400">Live defense orchestration</p>
                  </div>
                  <ShieldCheck size={18} className="text-brand-500" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Real-time Deep Scan</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">Neural analysis of incoming data streams for latent threats.</p>
                    </div>
                    {/* Custom Toggle ON */}
                    <div className="w-10 h-5 rounded-full bg-brand-600 flex items-center justify-end px-1 cursor-pointer">
                      <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Advanced Heuristics</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">Behavioral pattern matching to catch zero-day exploits.</p>
                    </div>
                    {/* Custom Toggle ON */}
                    <div className="w-10 h-5 rounded-full bg-brand-600 flex items-center justify-end px-1 cursor-pointer">
                      <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 mb-1">Auto-block Phishing</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">Immediate blacklisting of domains flagged by the core engine.</p>
                    </div>
                    {/* Custom Toggle OFF */}
                    <div className="w-10 h-5 rounded-full bg-dark-600 flex items-center justify-start px-1 cursor-pointer">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-400 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card className="bg-dark-800 border-dark-600 h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Authentication</h3>
                    <p className="text-[11px] text-slate-400">Access control management</p>
                  </div>
                  <KeyRound size={18} className="text-accent-red" />
                </div>

                <div className="bg-dark-900 border border-dark-700 rounded p-4 flex-1 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse"></span>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">TWO-FACTOR AUTH</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Recommended for high-risk accounts. Secure your login with physical hardware keys or TOTP apps.
                  </p>
                </div>

                <button className="w-full bg-accent-red hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2">
                  <Lock size={14} /> UPDATE CREDENTIALS
                </button>
              </CardContent>
            </Card>
          </div>

          {/* API Integrations */}
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400">
                  <Plug size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">API Integrations</h3>
                  <p className="text-[11px] text-slate-400">Bridge external intelligence sources</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* API 1 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-5 h-5 rounded bg-brand-500 flex items-center justify-center">
                        <ShieldCheck size={12} className="text-white" />
                      </div>
                      ScamVN Threat Feed
                    </div>
                    <span className="bg-dark-700 text-brand-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">CONNECTED</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-dark-900 border border-dark-700 rounded flex items-center px-3 py-2">
                      <input type="text" value="sk-scamvn-9923-a912-xk01" className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono" readOnly />
                      <Eye size={16} className="text-slate-500 cursor-pointer hover:text-slate-300 transition-colors" />
                    </div>
                    <button className="w-10 h-10 rounded bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                      <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>

                <div className="h-px w-full bg-dark-700/50"></div>

                {/* API 2 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center">
                        <ShieldCheck size={12} className="text-white" />
                      </div>
                      Google Safe Browsing
                    </div>
                    <span className="bg-dark-700 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">STANDBY</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-dark-900 border border-dark-700 rounded flex items-center px-3 py-2">
                      <input type="text" placeholder="Enter API Key..." className="bg-transparent border-none outline-none text-sm text-slate-400 w-full font-mono placeholder:text-dark-600" />
                    </div>
                    <Button variant="primary" className="font-bold px-6">LINK</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Shield Alerts */}
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-dark-700 border border-dark-600 flex items-center justify-center text-slate-400">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">Family Shield Alerts</h3>
                  <p className="text-[11px] text-slate-400">Notify linked accounts of detected fraud attempts</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-brand-500 border border-dark-800 text-[8px] font-bold text-white flex items-center justify-center">JD</div>
                  <div className="w-6 h-6 rounded-full bg-accent-red border border-dark-800 text-[8px] font-bold text-white flex items-center justify-center">GP</div>
                  <div className="w-6 h-6 rounded-full bg-dark-600 border border-dark-800 text-[8px] font-bold text-white flex items-center justify-center">+1</div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <SettingsIcon size={18} />
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
