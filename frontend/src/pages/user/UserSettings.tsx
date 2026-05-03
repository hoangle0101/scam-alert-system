import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, Bell, Shield, Users, Lock, CreditCard, ChevronRight, Edit2, ShieldCheck, Mail, Phone } from 'lucide-react';

export function UserSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-slate-500"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">USER SETTINGS</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Personal Preferences</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Manage your account security, family shield members, and how you want to be notified about threats.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation Cards */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
              {[
                { icon: User, label: 'Profile Information', active: true },
                { icon: Lock, label: 'Security & Password', active: false },
                { icon: Bell, label: 'Notification Settings', active: false },
                { icon: Users, label: 'Family Management', active: false },
                { icon: CreditCard, label: 'Subscription Plan', active: false },
              ].map((item, i) => (
                <button 
                  key={i}
                  className={`w-full flex items-center justify-between p-4 text-sm font-semibold transition-all border-b border-dark-600 last:border-0 ${
                    item.active ? 'bg-brand-600/10 text-brand-500' : 'text-slate-400 hover:bg-dark-700/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={16} className={item.active ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))}
           </div>

           <Card className="bg-gradient-to-br from-brand-600/20 to-transparent border-brand-500/20">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-brand-500" size={24} />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Protection</h4>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed mb-4">
                   Your Family Shield covers up to 5 members. You are currently using 2 slots.
                 </p>
                 <Button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-3 rounded-xl">UPGRADE PLAN</Button>
              </CardContent>
           </Card>
        </div>

        {/* Right Column - Active Panel */}
        <div className="lg:col-span-2 space-y-8">
           {/* Profile Section */}
           <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-8">
                 <div className="flex justify-between items-start mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                       <User size={20} className="text-brand-500" /> Account Information
                    </h3>
                    <Button variant="secondary" size="sm" className="flex items-center gap-2 rounded-lg text-xs font-bold px-4 py-2">
                       <Edit2 size={12} /> EDIT PROFILE
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-slate-200 text-sm">
                             Hoang Le
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-slate-200 text-sm flex items-center gap-3">
                             <Mail size={14} className="text-slate-500" /> user@scamguardian.ai
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                          <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-slate-200 text-sm flex items-center gap-3">
                             <Phone size={14} className="text-slate-500" /> +84 9xx xxx xxx
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Protection Level</label>
                          <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-brand-500 font-bold text-sm flex items-center gap-3">
                             <Shield size={14} /> Maximum Security
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Notification Preferences */}
           <Card className="bg-dark-800 border-dark-600">
              <CardContent className="p-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                    <Bell size={20} className="text-brand-500" /> Notification Channels
                 </h3>
                 <div className="space-y-6">
                    {[
                      { label: 'Push Notifications', desc: 'Get instant alerts on your device when a threat is detected.', enabled: true },
                      { label: 'Email Alerts', desc: 'Receive weekly security summaries and critical breach reports.', enabled: true },
                      { label: 'SMS Warnings', desc: 'Urgent messages for high-risk phishing attempts on family devices.', enabled: false },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between gap-8 pb-6 border-b border-dark-700 last:border-0 last:pb-0">
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-200 mb-1">{pref.label}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{pref.desc}</p>
                         </div>
                         <button 
                           className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${
                             pref.enabled ? 'bg-brand-600' : 'bg-dark-600'
                           }`}
                         >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-transform ${
                              pref.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                         </button>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
