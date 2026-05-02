import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const LOGS = [
  { id: 1, timestamp: '2023-11-24 14:22:01', category: 'AUTH', categoryColor: 'bg-brand-500', ip: '192.168.1.104', status: 'SUCCESS', statusColor: 'text-slate-300' },
  { id: 2, timestamp: '2023-11-24 14:21:44', category: 'SCAN', categoryColor: 'bg-accent-red', ip: '8.8.8.8', status: 'FAILURE', statusColor: 'text-accent-red font-bold' },
  { id: 3, timestamp: '2023-11-24 14:20:12', category: 'API', categoryColor: 'bg-slate-400', ip: '45.22.112.5', status: 'WARNING', statusColor: 'text-slate-300' },
  { id: 4, timestamp: '2023-11-24 14:18:55', category: 'ADMIN', categoryColor: 'bg-brand-500', ip: '10.0.0.12', status: 'SUCCESS', statusColor: 'text-slate-300' },
  { id: 5, timestamp: '2023-11-24 14:15:22', category: 'AUTH', categoryColor: 'bg-brand-500', ip: '192.168.1.201', status: 'SUCCESS', statusColor: 'text-slate-300' },
  { id: 6, timestamp: '2023-11-24 14:12:01', category: 'SCAN', categoryColor: 'bg-accent-red', ip: 'INTERNAL_BUS', status: 'FAILURE', statusColor: 'text-accent-red font-bold' },
  { id: 7, timestamp: '2023-11-24 14:09:44', category: 'API', categoryColor: 'bg-slate-400', ip: '172.16.0.44', status: 'WARNING', statusColor: 'text-slate-300' },
];

export function AuditLogs() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">System Audit & Event Logs</h2>
        <span className="bg-dark-800 text-slate-400 text-[10px] font-mono border border-dark-600 px-2 py-1 rounded tracking-wider">
          LIVE_STREAM: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        
        {/* Main Content: Table */}
        <div className="lg:col-span-3 flex flex-col space-y-4 overflow-hidden">
          {/* Top Controls */}
          <div className="flex gap-4">
            <div className="flex-1 bg-dark-800 border border-dark-600 rounded flex items-center px-4 py-2">
              <Search size={16} className="text-slate-500 mr-3" />
              <input 
                type="text" 
                placeholder="Filter by IP, Payload or Actor..." 
                className="bg-transparent border-none outline-none text-sm text-slate-200 w-full font-mono placeholder:text-dark-500" 
              />
            </div>
            <Button variant="secondary" className="flex items-center gap-2 font-semibold">
              <FileSpreadsheet size={16} /> Export to CSV
            </Button>
            <Button variant="secondary" className="flex items-center gap-2 font-semibold">
              <FileText size={16} /> Download PDF Report
            </Button>
          </div>

          {/* Table Card */}
          <Card className="flex-1 flex flex-col border-dark-600 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 font-mono uppercase bg-dark-800/80 sticky top-0 border-b border-dark-600">
                  <tr>
                    <th className="px-8 py-4 font-semibold tracking-wider">TIMESTAMP</th>
                    <th className="px-8 py-4 font-semibold tracking-wider">CATEGORY</th>
                    <th className="px-8 py-4 font-semibold tracking-wider">SOURCE IP</th>
                    <th className="px-8 py-4 font-semibold tracking-wider">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50 font-mono">
                  {LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-dark-800/50 transition-colors group">
                      <td className="px-8 py-5 text-slate-400 group-hover:text-slate-300">{log.timestamp}</td>
                      <td className="px-8 py-5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <span className={`w-2 h-2 rounded-full ${log.categoryColor}`}></span>
                          {log.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-300">{log.ip}</td>
                      <td className={`px-8 py-5 ${log.statusColor}`}>{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-dark-600 bg-dark-900/50 p-4 flex justify-between items-center text-xs font-mono text-slate-500 uppercase tracking-widest">
              <span>DISPLAYING 150 OF 4,821 EVENTS</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 hover:bg-dark-700 text-slate-400 transition-colors"><ChevronLeft size={16} /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-dark-700 border border-dark-500 text-white font-bold transition-colors">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 hover:bg-dark-700 text-slate-400 transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 hover:bg-dark-700 text-slate-400 transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-dark-800 hover:bg-dark-700 text-slate-400 transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Filters */}
        <aside className="flex flex-col space-y-6">
          <div className="flex-1">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6 border-b border-dark-700 pb-2">FILTER PARAMETERS</h3>
            
            <div className="mb-8">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">TEMPORAL RANGE</label>
              <div className="space-y-2">
                <input type="text" value="11/24/2023" className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500" readOnly />
                <input type="text" value="11/24/2023" className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500" readOnly />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">SEVERITY LEVEL</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-4 rounded bg-brand-600 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Critical (Failures)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-4 rounded bg-brand-600 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-300">Warning (Suspicious)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-4 rounded border border-dark-500 bg-dark-800 flex items-center justify-center">
                  </div>
                  <span className="text-sm text-slate-400">Informational (Success)</span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">MODULE SOURCE</label>
              <select className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
                <option>All System Modules</option>
                <option>Authentication</option>
                <option>Scanner Core</option>
                <option>API Gateway</option>
              </select>
            </div>

            <div className="space-y-3">
              <Button variant="primary" className="w-full font-bold tracking-wider">APPLY SYSTEM FILTER</Button>
              <button className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors py-2">
                CLEAR ALL FILTERS
              </button>
            </div>
          </div>

          <Card className="bg-dark-800/50 border-dark-600 p-5 mt-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">LOG INTEGRITY</span>
              <span className="text-[10px] font-mono text-brand-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> SECURE
              </span>
            </div>
            <div className="flex gap-1 mb-3">
              <div className="h-1.5 flex-1 bg-brand-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-brand-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-brand-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-brand-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-dark-600 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              Checksum verified at 14:00 UTC. No tampering detected in active buffer.
            </p>
          </Card>
        </aside>

      </div>
    </div>
  );
}

// Custom Check icon for checkboxes since lucide's is a bit large
function CheckCircle2(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
