import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { ArrowRight, BrainCircuit, ShieldCheck, Grid, Play, Lock, Eye } from 'lucide-react';

export function KnowledgeBase() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Header Section */}
      <section className="space-y-4 max-w-3xl">
        <span className="bg-dark-800 text-slate-300 text-[10px] font-bold border border-dark-600 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          SECURITY ACADEMY & ACADEMY
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
          Knowledge is your <br/>
          <span className="text-brand-500">Strongest Firewall.</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
          Simplified cybersecurity training designed for everyone. From spotting fake links to securing your digital legacy, we make technical safety feel like common sense.
        </p>
      </section>

      {/* Featured Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Featured Card */}
        <Card className="lg:col-span-2 border-dark-600 overflow-hidden relative group cursor-pointer h-[400px]">
          {/* Abstract background representing the guy in suit */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-[#1a1c29] to-dark-900 flex items-center justify-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] group-hover:bg-brand-500/20 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <Lock size={120} className="text-dark-700/50 absolute -right-10 -bottom-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <span className="bg-accent-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-4 inline-block">
              URGENT: SCAM OF THE WEEK
            </span>
            <h2 className="text-3xl font-bold text-white mb-3">The "Unpaid Parcel" SMS Trap</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl">
              Learn how attackers use your curiosity about a missing package to steal your credit card details in under 30 seconds.
            </p>
            <Button variant="primary" className="font-bold flex items-center gap-2">
              Read Full Breakdown <ArrowRight size={16} />
            </Button>
          </div>
        </Card>

        {/* Side Cards */}
        <div className="flex flex-col gap-6 h-[400px]">
          <Card className="flex-1 bg-dark-800/80 border-dark-600 hover:bg-dark-800 transition-colors group cursor-pointer flex flex-col justify-center p-6">
            <BrainCircuit className="text-brand-400 mb-4" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">Psychology of Scams</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
              Why we fall for urgency and how to train your brain to "Pause & Verify."
            </p>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
              LEARN MORE <ArrowRight size={14} />
            </span>
          </Card>

          <Card className="flex-1 bg-dark-800/80 border-dark-600 hover:bg-dark-800 transition-colors group cursor-pointer flex flex-col justify-center p-6">
            <ShieldCheck className="text-accent-red mb-4" size={28} />
            <h3 className="text-lg font-bold text-white mb-2">The Verification Rule</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
              Three simple questions to ask before clicking any link from a "known" contact.
            </p>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
              VIEW CHECKLIST <ArrowRight size={14} />
            </span>
          </Card>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">EDUCATIONAL TRACKS</p>
            <h2 className="text-2xl font-bold text-white">Learning Modules</h2>
          </div>
          <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            View All Courses <Grid size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <Card className="bg-dark-800 border-dark-600 overflow-hidden flex flex-col h-full group cursor-pointer">
            <div className="h-40 bg-gradient-to-b from-dark-700 to-dark-800 relative flex flex-col items-center justify-center p-6 border-b border-dark-700/50">
              <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md font-bold">12 MIN</span>
              <Eye size={40} className="text-white mb-2 opacity-80 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-black text-white tracking-widest uppercase">SAFE</h3>
              <p className="text-xs text-white/70 font-mono tracking-widest uppercase">PRACTICES</p>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-white mb-2">Safe QR Practices</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                Not every code is safe. Learn to inspect QR targets before you scan in public spaces.
              </p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Play size={10} className="text-white ml-0.5"/></div>
                  <div className="w-5 h-5 rounded-full bg-dark-600 border-2 border-dark-800"></div>
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-brand-400 transition-colors">ENROLL NOW</span>
              </div>
            </CardContent>
          </Card>

          {/* Module 2 */}
          <Card className="bg-dark-800 border-dark-600 overflow-hidden flex flex-col h-full group cursor-pointer">
            <div className="h-40 bg-gradient-to-br from-slate-800 to-dark-900 relative flex items-center justify-center overflow-hidden border-b border-dark-700/50">
              <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md font-bold z-10">8 MIN</span>
              <div className="relative w-full h-full">
                <div className="absolute top-[20%] left-[30%] w-12 h-12 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-xl shadow-black/50 flex items-center justify-center text-slate-800 font-bold text-xl group-hover:-translate-y-1 transition-transform">$</div>
                <div className="absolute top-[50%] left-[60%] w-10 h-10 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-xl shadow-black/50 flex items-center justify-center text-slate-800 font-bold text-lg opacity-80 group-hover:-translate-y-1 transition-transform delay-75">$</div>
                <div className="absolute top-[60%] left-[20%] w-8 h-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-xl shadow-black/50 flex items-center justify-center text-slate-800 font-bold text-md opacity-60 group-hover:-translate-y-1 transition-transform delay-150">$</div>
              </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-white mb-2">Spotting Fake Bank Links</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                Master the art of reading URLs. Identify typosquatting and hidden redirects instantly.
              </p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Play size={10} className="text-white ml-0.5"/></div>
                  <div className="w-5 h-5 rounded-full bg-dark-600 border-2 border-dark-800"></div>
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-brand-400 transition-colors">ENROLL NOW</span>
              </div>
            </CardContent>
          </Card>

          {/* Module 3 */}
          <Card className="bg-dark-800 border-dark-600 overflow-hidden flex flex-col h-full group cursor-pointer">
            <div className="h-40 bg-dark-900 relative flex flex-col items-center justify-center border-b border-dark-700/50 overflow-hidden">
              <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md font-bold z-10">15 MIN</span>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              <h3 className="text-5xl font-black text-dark-500/30 uppercase tracking-tighter mix-blend-screen group-hover:scale-105 transition-transform duration-700">PRIVACY</h3>
              <h3 className="text-3xl font-black text-dark-600/50 uppercase tracking-widest absolute bottom-4">SAFE WORK</h3>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-white mb-2">Privacy for Seniors</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                Tailored advice on managing social media privacy and protecting personal memories.
              </p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Play size={10} className="text-white ml-0.5"/></div>
                  <div className="w-5 h-5 rounded-full bg-dark-600 border-2 border-dark-800"></div>
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest hover:text-brand-400 transition-colors">ENROLL NOW</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Video Quick Tips Section */}
      <section className="bg-dark-800/40 border border-dark-600/50 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Video Quick-Tips</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {[
            { id: 1, duration: '0:45', bg: 'bg-dark-800' },
            { id: 2, duration: '1:12', bg: 'bg-slate-700' },
            { id: 3, duration: '0:58', bg: 'bg-dark-700', text: 'TIP 3' },
            { id: 4, duration: '1:30', bg: 'bg-dark-800', text: '4', redBtn: true },
          ].map((video) => (
            <div key={video.id} className={`h-28 rounded-lg ${video.bg} border border-dark-600 relative flex items-center justify-center group cursor-pointer overflow-hidden`}>
              {video.text && <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/5">{video.text}</span>}
              <div className={`w-10 h-10 rounded-full ${video.redBtn ? 'bg-accent-red' : 'bg-white/10'} border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform`}>
                <Play size={16} className="text-white ml-1" />
              </div>
              <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                {video.duration}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Glossary Section */}
      <section className="pt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Technical Terms, <span className="text-brand-300">Human Words.</span></h2>
          <p className="text-sm text-slate-400">The glossary for the rest of us.</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Glossary Item 1 */}
          <div className="bg-dark-800/80 border-l-4 border-l-brand-500 border-t border-b border-r border-dark-600 rounded-r-lg p-6 hover:bg-dark-800 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-white">Phishing</h3>
              <span className="bg-brand-500/20 text-brand-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-brand-500/30">LEVEL 1</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Think of this like "digital fishing." A scammer puts a "lure" (like a fake email or text) in the water, hoping you'll "bite" and give up your passwords.
            </p>
          </div>

          {/* Glossary Item 2 */}
          <div className="bg-dark-800/80 border-l-4 border-l-brand-500 border-t border-b border-r border-dark-600 rounded-r-lg p-6 hover:bg-dark-800 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-white">2FA (Two-Factor Authentication)</h3>
              <span className="bg-brand-500/20 text-brand-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-brand-500/30">LEVEL 1</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Like having a front door that needs both a key AND a fingerprint. Even if a scammer steals your password (the key), they still can't get in without the second step.
            </p>
          </div>

          {/* Glossary Item 3 */}
          <div className="bg-dark-800/80 border-l-4 border-l-slate-500 border-t border-b border-r border-dark-600 rounded-r-lg p-6 hover:bg-dark-800 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-white">Malware</h3>
              <span className="bg-slate-600/30 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-slate-500/30">LEVEL 2</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A general term for "bad software." It's like a computer virus that can spy on you, lock your files, or slow down your device.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
