import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertTriangle, MessageSquare, ChevronUp, ChevronDown, CheckCircle2, ShieldCheck, Share2, ArrowRight } from 'lucide-react';

export function CommunityFeed() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Featured Alerts Section */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">CRITICAL VERIFICATION</p>
            <h2 className="text-2xl font-bold text-white">Featured Alerts</h2>
          </div>
          <button className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
            View All Reports <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-dark-800 to-[#12141f] border-dark-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-[80px] pointer-events-none"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-accent-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> HIGH PRIORITY
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">VERIFIED BY 1,240 GUARDIANS</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">"Kinetic Vault" Phishing Protocol via SMS</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
                A sophisticated campaign mimicking official system alerts. Users report receiving SMS containing links to a cloned login portal at 'guardian-auth-verify.com'.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="text-slate-200 border-dark-600 hover:bg-dark-700 font-bold text-xs px-6 py-2">
                  EXAMINE PAYLOAD
                </Button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase transition-colors">
                  <Share2 size={16} /> SHARE INTEL
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-6 flex flex-col h-full">
              <AlertTriangle className="text-accent-red mb-4" size={28} />
              <h3 className="text-lg font-bold text-slate-100 mb-2">Deepfake Voice Scam Rising</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Emerging AI voice cloning targeting high-level administrators. 12 confirmed attempts this week.
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-700">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-brand-500 border-2 border-dark-800"></div>
                  <div className="w-6 h-6 rounded-full bg-accent-blue border-2 border-dark-800"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-dark-800"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono">982 Reported Today</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Intel Threads */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6 border-b border-dark-700 pb-4">
            <h2 className="text-xl font-bold text-white">Active Intel Threads</h2>
            <div className="flex gap-4">
              <button className="text-xs font-bold text-white bg-dark-700 px-3 py-1.5 rounded-full">SMS Scams</button>
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1.5 transition-colors">Phishing</button>
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1.5 transition-colors">Deepfakes</button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Thread 1 */}
            <Card className="bg-dark-800/80 hover:bg-dark-800 transition-colors border-dark-600">
              <CardContent className="p-5 flex gap-5">
                <div className="flex flex-col items-center gap-1">
                  <button className="text-slate-500 hover:text-brand-500"><ChevronUp size={20} /></button>
                  <span className="text-sm font-bold text-white">482</span>
                  <button className="text-slate-500 hover:text-accent-red"><ChevronDown size={20} /></button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-slate-300 bg-dark-700 px-2 py-0.5 rounded">SMS SCAMS</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">Posted by Guardian_U • 2h ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">New UPS Delivery "Tax Owed" Scam – 555-0123 Area Code</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    Confirmed fake landing page mimicking UPS dashboard. Do not provide credit card info. The URL has a slight typo 'ups-delivery-track.net'.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <MessageSquare size={14} /> 42 REPLIES
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brand-500 font-bold tracking-wider font-mono">
                      <ShieldCheck size={14} /> ELITE TRUST LEVEL
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thread 2 */}
            <Card className="bg-dark-800/80 hover:bg-dark-800 transition-colors border-dark-600">
              <CardContent className="p-5 flex gap-5">
                <div className="flex flex-col items-center gap-1">
                  <button className="text-slate-500 hover:text-brand-500"><ChevronUp size={20} /></button>
                  <span className="text-sm font-bold text-white">156</span>
                  <button className="text-slate-500 hover:text-accent-red"><ChevronDown size={20} /></button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-slate-300 bg-dark-700 px-2 py-0.5 rounded">DEEPFAKE VOICES</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">Posted by Analyst_Beta • 5h ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">AI-cloned voices of bank CEOs targeting finance directors</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    Listen to this sample of a verified fraudulent call. The inflection is nearly perfect. Be vigilant and require 2FA for large transfers.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <MessageSquare size={14} /> 18 REPLIES
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold tracking-wider font-mono">
                      <CheckCircle2 size={14} /> HIGH TRUST LEVEL
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Right Column: Live Reports */}
        <aside>
          <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span> LIVE REPORTS
          </h2>
          <Card className="bg-dark-800/50 border-dark-600">
            <CardContent className="p-0 divide-y divide-dark-700/50">
              
              <div className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">SYSTEM ALERT</span>
                  <span className="text-[9px] text-slate-500 font-mono">14:22:01</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">IP 192.168.1.1 mapped to known phishing cluster "Raven-9".</p>
              </div>

              <div className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded border border-dark-600">USER REPORT</span>
                  <span className="text-[9px] text-slate-500 font-mono">14:21:45</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">M. Thompson: Flagged malicious SMS redirect on mobile carrier X.</p>
              </div>

              <div className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded border border-dark-600">USER REPORT</span>
                  <span className="text-[9px] text-slate-500 font-mono">14:20:12</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">S. Chen: Suspicious WhatsApp "Job Offer" from +44...</p>
              </div>

              <div className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-accent-red bg-accent-red/10 px-1.5 py-0.5 rounded border border-accent-red/20">BOT MITIGATION</span>
                  <span className="text-[9px] text-slate-500 font-mono">14:18:55</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">Autoban triggered for entity @ScamHub_Bot1.</p>
              </div>

              <div className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-bold text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded border border-dark-600">USER REPORT</span>
                  <span className="text-[9px] text-slate-500 font-mono">14:15:30</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">A. Miller: Reported fraudulent Discord support bot.</p>
              </div>

            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Top Contributors */}
      <section className="pt-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-1">TOP CONTRIBUTORS</h2>
          <p className="text-sm text-slate-500">The vanguard of digital defense.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 1, name: 'Vortex_Scanner', role: 'ELITE SENTINEL', count: '2,840', color: 'bg-brand-500 text-white' },
            { id: 2, name: 'Neural_Link', role: 'MASTER GUARDIAN', count: '1,920', color: 'bg-accent-red text-white' },
            { id: 3, name: 'Proxy_Zero', role: 'LEAD INVESTIGATOR', count: '1,450', color: 'bg-orange-500 text-white' },
            { id: 4, name: 'Data_Witch', role: 'THREAT HUNTER', count: '980', color: 'bg-emerald-500 text-white' },
          ].map((user) => (
            <Card key={user.id} className="bg-dark-800/80 border-dark-600 flex flex-col items-center p-6 text-center hover:bg-dark-800 transition-colors">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center border-2 border-dark-600 text-xl font-bold text-slate-300">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-dark-800 ${user.color}`}>
                  #{user.id}
                </div>
              </div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">{user.name}</h4>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">{user.role}</p>
              <div className="w-full bg-dark-900 rounded border border-dark-700 py-2">
                <p className="text-xs font-mono text-slate-300"><span className="font-bold">{user.count}</span> VERIFIED ALERTS</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
