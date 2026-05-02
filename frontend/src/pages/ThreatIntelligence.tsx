import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { ShieldAlert, Activity, Lock, Link, Search, UserPlus, Fingerprint, Eye, TrendingUp } from 'lucide-react';
import { GeographicMap } from '../components/GeographicMap';

export function ThreatIntelligence() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">AI CONFIDENCE</h3>
              <ShieldAlert size={16} className="text-brand-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">99.8%</span>
              <span className="text-xs text-brand-500 mb-1">+0.2%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">NETWORK HEALTH</h3>
              <Activity size={16} className="text-accent-red" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">Optimal</span>
              <span className="text-xs text-slate-500 mb-1">12ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">ENCRYPTION TRAFFIC</h3>
              <Lock size={16} className="text-slate-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">4.2 TB</span>
              <span className="text-xs text-brand-500 px-2 py-0.5 bg-brand-500/20 rounded font-mono mb-1">Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Scanner Section */}
      <Card className="overflow-hidden flex flex-col">
        {/* Map Part */}
        <div className="h-[300px] relative">
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h2 className="text-xl font-bold text-white mb-1 shadow-black drop-shadow-md">Global Threat Map</h2>
            <p className="text-xs text-slate-300 max-w-md shadow-black drop-shadow-md leading-relaxed">
              Tracking 1.2 million end points in real-time. Red nodes indicate intrusion attempts blocked in the last 60 minutes.
            </p>
          </div>
          <GeographicMap />
        </div>
        
        {/* Scanner Part */}
        <div className="bg-dark-800 p-8 border-t border-dark-600">
          <div className="flex gap-8 mb-6 border-b border-dark-700">
            <button className="text-sm font-semibold text-brand-500 border-b-2 border-brand-500 pb-2">URL</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2 transition-colors">CONTENT/TEXT</button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2 transition-colors">VISUAL/IMAGE</button>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Target Analytics Endpoint</label>
            <div className="flex gap-4">
              <div className="bg-dark-900 border border-dark-700 rounded flex-1 flex items-center px-4 py-3">
                <Link size={16} className="text-slate-500 mr-3" />
                <input type="text" placeholder="https://suspicious-domain-analysis.net/" className="bg-transparent border-none outline-none text-sm text-slate-200 w-full font-mono placeholder:text-dark-600" />
              </div>
              <Button variant="primary" className="px-8 shadow-lg shadow-brand-500/20 font-bold tracking-wider">SCAN URL</Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-300 font-mono text-sm tracking-wider font-semibold">
              <Search size={16} /> ANALYSIS PIPELINE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-900 border border-dark-700 rounded-lg p-5 flex flex-col items-center text-center justify-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-brand-500/50"></div>
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3">
                  <Fingerprint size={18} className="text-slate-300" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 1</p>
                <h4 className="text-sm font-bold text-white mb-1">Phishing Detector</h4>
                <p className="text-[10px] text-slate-500 font-mono">XGBoost/Random Forest</p>
              </div>

              <div className="bg-dark-900 border border-dark-700 rounded-lg p-5 flex flex-col items-center text-center justify-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-dark-600"></div>
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3">
                  <TrendingUp size={18} className="text-slate-300" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 2</p>
                <h4 className="text-sm font-bold text-white mb-1">Scam Analyzer</h4>
                <p className="text-[10px] text-slate-500 font-mono">BERT/LSTM CORE</p>
              </div>

              <div className="bg-dark-900 border border-dark-700 rounded-lg p-5 flex flex-col items-center text-center justify-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-dark-600"></div>
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3">
                  <Eye size={18} className="text-slate-300" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 3</p>
                <h4 className="text-sm font-bold text-white mb-1">Visual Recognizer</h4>
                <p className="text-[10px] text-slate-500 font-mono">CNN/ResNet-50</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Family Shield Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Family Shield Protection Matrix</h2>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 text-xs font-mono bg-dark-800 border border-dark-600 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span> ONLINE
            </span>
            <span className="flex items-center gap-2 text-xs font-mono bg-dark-800 border border-dark-600 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-accent-red"></span> PROTECTED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* User 1 */}
          <Card className="bg-dark-800 border-dark-600 p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-brand-600/20 flex items-center justify-center text-brand-500 border border-brand-500/30 font-bold">JD</div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Nguyen Admin</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase">HOUSEHOLD HEAD</p>
              </div>
            </div>
            <div className="space-y-3 text-xs mb-6 font-mono text-slate-400">
              <div className="flex justify-between"><span>Uptime</span><span className="text-slate-200">99.9%</span></div>
              <div className="flex justify-between items-start">
                <span>Threats</span>
                <span className="text-accent-red text-right">02 (Blocked)</span>
              </div>
            </div>
            <div className="bg-dark-900 border border-dark-700 p-3 rounded">
              <p className="text-[9px] text-slate-500 font-mono mb-2 uppercase">LATEST LOG</p>
              <p className="text-[11px] text-slate-300 font-mono leading-tight">
                &gt; Blocked: Phishing URL<br/>
                &gt; Device: MacBook Pro
              </p>
            </div>
          </Card>

          {/* User 2 */}
          <Card className="bg-dark-800 border-dark-600 p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-dark-700 flex items-center justify-center text-slate-400 border border-dark-600 font-bold">BB</div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Little Bi</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase">IPAD / GAMING</p>
              </div>
            </div>
            <div className="space-y-3 text-xs mb-6 font-mono text-slate-400">
              <div className="flex justify-between"><span>Uptime</span><span className="text-slate-200">100%</span></div>
              <div className="flex justify-between"><span>Threats</span><span className="text-slate-200">0</span></div>
            </div>
            <div className="bg-dark-900 border border-dark-700 p-3 rounded">
              <p className="text-[9px] text-slate-500 font-mono mb-2 uppercase">LATEST LOG</p>
              <p className="text-[11px] text-slate-300 font-mono leading-tight">
                &gt; Content Filter Active<br/>
                &gt; SafeSearch: ON
              </p>
            </div>
          </Card>

          {/* User 3 */}
          <Card className="bg-dark-800 border-dark-600 p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-accent-red/20 flex items-center justify-center text-accent-red border border-accent-red/30 font-bold">GP</div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Grandpa</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase">ANDROID / NEWS</p>
              </div>
            </div>
            <div className="space-y-3 text-xs mb-6 font-mono text-slate-400">
              <div className="flex justify-between"><span>Uptime</span><span className="text-slate-200">98.5%</span></div>
              <div className="flex justify-between items-start">
                <span>Threats</span>
                <span className="text-accent-red text-right">05 (Smishing)</span>
              </div>
            </div>
            <div className="bg-dark-900 border border-dark-700 p-3 rounded">
              <p className="text-[9px] text-slate-500 font-mono mb-2 uppercase">LATEST LOG</p>
              <p className="text-[11px] text-slate-300 font-mono leading-tight">
                &gt; Blocked: SMS Bank Scam<br/>
                &gt; Alert sent to Admin
              </p>
            </div>
          </Card>

          {/* User 4 */}
          <Card className="bg-dark-800 border-dark-600 p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-dark-700 flex items-center justify-center text-slate-400 border border-dark-600 font-bold">ML</div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Mom Lan</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase">IPHONE / WORK</p>
              </div>
            </div>
            <div className="space-y-3 text-xs mb-6 font-mono text-slate-400">
              <div className="flex justify-between"><span>Uptime</span><span className="text-slate-200">99.9%</span></div>
              <div className="flex justify-between"><span>Threats</span><span className="text-slate-200">01</span></div>
            </div>
            <div className="bg-dark-900 border border-dark-700 p-3 rounded">
              <p className="text-[9px] text-slate-500 font-mono mb-2 uppercase">LATEST LOG</p>
              <p className="text-[11px] text-slate-300 font-mono leading-tight">
                &gt; VPN: Active (Singapore)<br/>
                &gt; Email Shield: OK
              </p>
            </div>
          </Card>

          {/* Add Member */}
          <Card className="bg-transparent border border-dashed border-dark-600 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-dark-800/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center mb-4 text-slate-400">
              <UserPlus size={24} />
            </div>
            <h4 className="font-bold text-brand-500 text-sm mb-2 uppercase">Add Member</h4>
            <p className="text-[10px] text-slate-500">Expand the protection network for your family</p>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attack Vector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity size={18} className="text-slate-400"/> Attack Vector Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>SMS (SMISHING)</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
                <div className="bg-accent-red h-full w-[42%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>EMAIL (PHISHING)</span>
                <span>35%</span>
              </div>
              <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full w-[35%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>WEB (MALWARE)</span>
                <span>23%</span>
              </div>
              <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full w-[23%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-dark-900 border border-dark-700 rounded p-3 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Latest Spike</p>
                <p className="text-sm font-bold text-accent-red">+12% SMS</p>
              </div>
              <div className="bg-dark-900 border border-dark-700 rounded p-3 text-center flex flex-col items-center justify-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Trend</p>
                <TrendingUp size={16} className="text-brand-500" />
              </div>
              <div className="bg-dark-900 border border-dark-700 rounded p-3 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Accuracy</p>
                <p className="text-sm font-bold text-white">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Activity Log */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Fingerprint size={18} className="text-slate-400"/> Recent System Activity</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 bg-[#0a0a0f] font-mono text-xs overflow-auto rounded-b-xl border-t border-dark-700">
            <div className="space-y-4 text-slate-400">
              <div className="flex gap-3">
                <span className="text-slate-600 whitespace-nowrap">[14:22:01]</span>
                <span className="text-brand-500 font-bold whitespace-nowrap">INFO </span>
                <span className="text-slate-300 leading-relaxed">Kernel update completed. No vulnerabilities found.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 whitespace-nowrap">[14:21:45]</span>
                <span className="text-[#f59e0b] font-bold whitespace-nowrap">WARN </span>
                <span className="text-[#f59e0b] leading-relaxed">Suspicious TCP/IP handshake detected from IP 192.168.1.42</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 whitespace-nowrap">[14:21:44]</span>
                <span className="text-accent-red font-bold whitespace-nowrap">BLOCK</span>
                <span className="text-accent-red leading-relaxed">Automatic blacklisting applied to source: RU_NODE_99</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 whitespace-nowrap">[14:18:30]</span>
                <span className="text-brand-500 font-bold whitespace-nowrap">SCAN </span>
                <span className="text-slate-300 leading-relaxed">Email analysis complete: attachment 'invoice.zip' marked safe.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-600 whitespace-nowrap">[14:15:12]</span>
                <span className="text-brand-500 font-bold whitespace-nowrap">INFO </span>
                <span className="text-slate-300 leading-relaxed">Family Network sync: 5/5 devices verified and encrypted.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
