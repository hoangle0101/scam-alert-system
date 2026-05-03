import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Shield, Search, Users, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, Zap, Settings, BookOpen, MessageSquare } from 'lucide-react';

export function UserDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Hero / Welcome Section */}
      <section className="relative p-8 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 overflow-hidden shadow-2xl shadow-brand-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Welcome Back, Guardian</h1>
            <p className="text-brand-100 text-lg max-w-xl">
              Your Family Shield is active and monitoring for threats. We've blocked <span className="font-bold text-white">12 suspicious links</span> this week.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <Button variant="primary" className="bg-white text-brand-600 hover:bg-slate-100 px-8 py-3 rounded-xl font-bold shadow-lg">
                Quick Scan Now
              </Button>
              <Button variant="secondary" className="border-brand-400 text-white hover:bg-brand-500/20 px-8 py-3 rounded-xl font-bold">
                View Reports
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                   <ShieldCheck className="text-green-400 mb-2" size={24} />
                   <div className="text-2xl font-bold text-white">Active</div>
                   <div className="text-[10px] text-white/60 uppercase tracking-widest">Network Status</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                   <Zap className="text-yellow-400 mb-2" size={24} />
                   <div className="text-2xl font-bold text-white">0.4ms</div>
                   <div className="text-[10px] text-white/60 uppercase tracking-widest">Scan Latency</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Scanner Card */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-dark-800 border-dark-600 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-dark-600 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Search size={20} className="text-brand-500" /> AI Link & Message Scanner
                </h3>
                <span className="text-[10px] bg-brand-500/10 text-brand-500 px-2 py-1 rounded font-mono font-bold tracking-widest">REAL-TIME ENGINE</span>
              </div>
              <div className="p-8">
                <p className="text-slate-400 text-sm mb-6">Paste a suspicious URL, SMS message, or upload an image to verify its safety with our AI models.</p>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 bg-dark-900 border border-dark-600 rounded-xl flex items-center px-4 py-3 focus-within:border-brand-500 transition-colors">
                    <Search size={18} className="text-slate-500 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Paste link or message content here..." 
                      className="bg-transparent border-none outline-none text-slate-200 text-sm w-full"
                    />
                  </div>
                  <Button variant="primary" className="px-8 rounded-xl font-bold py-3">ANALYZE</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex items-center gap-4 group hover:border-brand-500/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-500 group-hover:text-brand-500">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Phishing Analysis</div>
                      <div className="text-[10px] text-slate-500 italic">Detect fake bank/brand links</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex items-center gap-4 group hover:border-brand-500/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-500 group-hover:text-brand-500">
                      <MessageSquare className="text-inherit" size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Scam Language</div>
                      <div className="text-[10px] text-slate-500 italic">Analyze SMS/Social intent</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex items-center gap-4 group hover:border-brand-500/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-500 group-hover:text-brand-500">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Visual Verification</div>
                      <div className="text-[10px] text-slate-500 italic">Check deepfake or fake docs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts Feed */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
               <AlertTriangle size={20} className="text-yellow-500" /> Recent Security Alerts
            </h3>
            <div className="space-y-4">
              {[
                { type: 'Phishing', target: 'Vietcombank Fake Link', time: '2 hours ago', risk: 'CRITICAL' },
                { type: 'SMS Scam', target: 'Luxury Brand Reward', time: '5 hours ago', risk: 'HIGH' },
                { type: 'Social', target: 'Account Recovery Trap', time: '1 day ago', risk: 'MEDIUM' }
              ].map((alert, i) => (
                <div key={i} className="bg-dark-800/50 border border-dark-600 rounded-xl p-4 flex items-center justify-between hover:bg-dark-800 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.risk === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 
                        alert.risk === 'HIGH' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                         <AlertTriangle size={18} />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-slate-200">{alert.target}</div>
                         <div className="text-xs text-slate-500">{alert.type} • {alert.time}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        alert.risk === 'CRITICAL' ? 'border-red-500/50 text-red-500 bg-red-500/5' : 
                        alert.risk === 'HIGH' ? 'border-orange-500/50 text-orange-500 bg-orange-500/5' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'
                      }`}>{alert.risk}</span>
                      <ArrowRight size={16} className="text-slate-600" />
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Family Shield Sidebar */}
        <div className="space-y-8">
           <Card className="bg-brand-600/5 border-brand-500/20">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                       <Shield size={20} />
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-white">Family Shield</h3>
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest">Guardian Network</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-600">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-dark-600">JD</div>
                          <div>
                             <div className="text-xs font-bold text-slate-200">John Doe</div>
                             <div className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle size={8} /> Protected</div>
                          </div>
                       </div>
                       <Button variant="outline" size="sm" className="p-1 h-auto text-slate-500"><Settings size={14} /></Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-dark-600">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-dark-600">MW</div>
                          <div>
                             <div className="text-xs font-bold text-slate-200">Mary Watson</div>
                             <div className="text-[10px] text-yellow-500 flex items-center gap-1"><AlertTriangle size={8} /> Needs Review</div>
                          </div>
                       </div>
                       <Button variant="outline" size="sm" className="p-1 h-auto text-slate-500"><Settings size={14} /></Button>
                    </div>
                 </div>

                 <Button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2">
                    <Users size={14} /> ADD FAMILY MEMBER
                 </Button>
              </CardContent>
           </Card>

           <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-6">
                 <h3 className="text-sm font-bold text-white mb-4">Security Tip of the Day</h3>
                 <div className="p-4 rounded-xl bg-dark-900 border border-dark-700">
                    <div className="flex items-center gap-2 mb-2">
                       <BookOpen size={16} className="text-brand-500" />
                       <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Academy Pick</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic mb-3">
                      "Never trust an SMS from a bank that asks you to log in to resolve an 'urgent' issue. Real banks don't send login links via SMS."
                    </p>
                    <a href="/user/knowledge" className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                       Learn More <ArrowRight size={10} />
                    </a>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

