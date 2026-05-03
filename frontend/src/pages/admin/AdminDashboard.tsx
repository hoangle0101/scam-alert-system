import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { GeographicMap } from '../../components/GeographicMap';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreVertical, Zap } from 'lucide-react';

const LATENCY_DATA = [
  { name: '10s', value: 45 }, { name: '20s', value: 52 }, { name: '30s', value: 38 },
  { name: '40s', value: 65 }, { name: '50s', value: 42 }, { name: '60s', value: 30 }
];

const AGENTS = [
  { id: '994021-X', initials: 'JD', name: 'James D. Miller', status: 'ACTIVE PROTECTOR', risk: 'LOW' },
  { id: '881042-S', initials: 'AL', name: 'Aria Lofton', status: 'INACTIVE', risk: 'CRITICAL' },
  { id: '442109-W', initials: 'SK', name: 'Sarah K.', status: 'ACTIVE PROTECTOR', risk: 'LOW' },
];

const LOGS = [
  "[14:02:11] INF SCANNER_US_WEST_4 initialized.",
  "[14:02:45] WRN High-frequency phishing attempt detected via IP: 192.168.1.1",
  "[14:03:02] INF Model BERT re-indexed with 12k new vectors.",
  "[14:04:10] SUC Identity verified for Agent #JD_Miller.",
  "[14:05:33] INF System status update: ALL NODES OPERATIONAL.",
  "[14:06:42] // Handshake protocol established...",
  "[14:08:11] INF Database compression active: 82% efficiency.",
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          System Analytics
        </h2>
        <p className="text-sm text-slate-400 font-mono tracking-widest uppercase mt-1">Real-time model inference & resource allocation</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-xs text-slate-400 font-mono mb-2">API LATENCY (SCAMVN)</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">42ms</span>
                <span className="text-accent-green text-sm flex items-center mb-1">
                  ↓ 12%
                </span>
              </div>
            </div>
            <div className="h-16 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LATENCY_DATA}>
                  <Tooltip cursor={{fill: 'rgba(37,99,235,0.1)'}} contentStyle={{backgroundColor: '#1e2132', border: 'none', borderRadius: '4px'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 flex flex-col justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-dark-700 rounded text-xs text-slate-300 font-mono">REFRESH: 2S</span>
              <span className="px-2 py-1 bg-brand-600/20 text-brand-500 border border-brand-500/30 rounded text-xs font-mono">NODE: US-EAST-1</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 font-mono mb-6">AI MODEL PRECISION</p>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-slate-400 mb-1">BERT (Text)</p>
              <p className="text-3xl font-bold text-white mb-2">99.2%</p>
              <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full w-[99.2%]"></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">CNN (Image)</p>
              <p className="text-3xl font-bold text-white mb-2">97.8%</p>
              <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full w-[97.8%]"></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">XGBoost (Metadata)</p>
              <p className="text-3xl font-bold text-white mb-2">94.5%</p>
              <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full w-[94.5%]"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personnel & Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personnel Directory</CardTitle>
              <input 
                type="text" 
                placeholder="Filter identities..." 
                className="bg-dark-700 border border-dark-600 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 font-mono uppercase bg-dark-800/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Active User</th>
                    <th className="px-6 py-3 font-medium">Family Shield</th>
                    <th className="px-6 py-3 font-medium">Risk Level</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600/50">
                  {AGENTS.map((agent, i) => (
                    <tr key={i} className="hover:bg-dark-700/30 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${agent.risk === 'CRITICAL' ? 'bg-accent-red/20 text-accent-red' : 'bg-brand-500/20 text-brand-500'}`}>
                          {agent.initials}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{agent.name}</p>
                          <p className="text-xs text-slate-500 font-mono">UID: {agent.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {agent.status === 'ACTIVE PROTECTOR' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-brand-500/30 bg-brand-500/10 text-brand-500 text-[10px] font-mono font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                            ACTIVE PROTECTOR
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-dark-500 bg-dark-600/50 text-slate-400 text-[10px] font-mono font-bold tracking-wider">
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${agent.risk === 'CRITICAL' ? 'bg-accent-red/20 text-accent-red border border-accent-red/30' : 'bg-brand-500/20 text-brand-500 border border-brand-500/30'}`}>
                          {agent.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">
                        <button className="hover:text-slate-200 p-1"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-dark-600 text-xs text-slate-500 flex justify-between items-center">
              SHOWING 3 OF 1,248 AGENTS
              <div className="flex gap-2">
                <button className="p-1 hover:text-slate-300">{'<'}</button>
                <button className="p-1 hover:text-slate-300">{'>'}</button>
              </div>
            </div>
          </Card>

          <Card className="h-80 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Geographic Threat Map</CardTitle>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-500">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                DETECTION HUBS
              </div>
            </CardHeader>
            <div className="flex-1 p-2">
              <GeographicMap />
            </div>
          </Card>
        </div>

        {/* Right Column: Validation Queue & Logs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-dark-900 border border-dark-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block bg-accent-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">Urgent Verification</span>
                    <h4 className="font-semibold text-slate-200">Report #SV-29910</h4>
                  </div>
                  <span className="text-xs text-slate-500">2m ago</span>
                </div>
                
                <div className="bg-dark-800 p-3 rounded text-sm text-slate-300 font-mono mb-4 border border-dark-700">
                  <span className="text-slate-500">// Scam Snippet</span><br/>
                  "urgent: your bank account has been compromised. click here to secure: <a href="#" className="text-brand-500 hover:underline">https://secure-vault-302.xyz</a>"
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-dark-800 rounded p-2 text-center border border-dark-700">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">AI Score</p>
                    <p className="text-xl font-bold text-brand-500">98.4</p>
                  </div>
                  <div className="flex-1 bg-dark-800 rounded p-2 text-center border border-dark-700">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Reputation</p>
                    <p className="text-xl font-bold text-white">High</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1">APPROVE</Button>
                  <Button variant="destructive" className="flex-1">DISCARD</Button>
                </div>
              </div>

              <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 flex gap-3">
                <Zap className="text-brand-500 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Auto-Pilot Active</p>
                  <p className="text-xs text-slate-400 mt-1">System is processing low-risk threads automatically.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-64 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center py-3 border-dark-700">
              <span className="text-xs font-mono font-bold text-brand-500">LIVE AUDIT LOG</span>
              <span className="text-xs font-mono text-slate-500">[v4.8.2]</span>
            </CardHeader>
            <div className="flex-1 overflow-auto p-4 bg-[#0a0a0f] font-mono text-xs text-slate-400 space-y-2">
              {LOGS.map((log, i) => (
                <div key={i}>
                  {log.includes('WRN') || log.includes('ERR') ? (
                    <span className="text-accent-red">{log}</span>
                  ) : log.includes('SUC') ? (
                    <span className="text-accent-green">{log}</span>
                  ) : log.includes('INF') ? (
                    <span><span className="text-brand-500">[14:xx:xx] INF</span> {log.split('INF')[1]}</span>
                  ) : (
                    <span className="text-slate-600">{log}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
