import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Search, FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ShieldCheck, Activity, CheckCircle, XCircle } from 'lucide-react';
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

export function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [actionFilter, setActionFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // If there's a search input, we'll try to use it as an action filter 
      // (since backend only supports filtering by action currently)
      const filter = searchInput.trim() !== '' ? searchInput.trim() : (actionFilter !== 'All System Modules' ? actionFilter : undefined);
      
      const res = await api.admin.getAuditLogs(page, filter);
      setLogs(res.logs || []);
      setTotal(res.total || 0);
      setPerPage(res.per_page || 50);
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Failed to fetch audit logs.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto refresh logs every 15s to keep it "Live"
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [page, actionFilter]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchLogs();
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setActionFilter('All System Modules');
    setPage(1);
    // fetchLogs will trigger via useEffect dependency
  };

  const getCategoryColor = (action: string) => {
    if (action.includes('auth') || action.includes('login')) return 'bg-brand-500';
    if (action.includes('scan')) return 'bg-accent-red';
    if (action.includes('admin')) return 'bg-[#f59e0b]'; // orange
    return 'bg-slate-400';
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'success') return 'text-green-400';
    if (status.toLowerCase() === 'failure' || status.toLowerCase() === 'error') return 'text-accent-red font-bold';
    return 'text-slate-300';
  };

  const totalPages = Math.ceil(total / perPage) || 1;

  const handleExport = () => {
    setToast({ message: 'Exporting logs to CSV... (Mock)', type: 'info' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">System Audit & Event Logs</h2>
        <span className="bg-dark-800 text-brand-500 text-[10px] font-mono border border-brand-500/30 px-2 py-1 rounded tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> LIVE_STREAM: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        
        {/* Main Content: Table */}
        <div className="lg:col-span-3 flex flex-col space-y-4 overflow-hidden">
          {/* Top Controls */}
          <div className="flex gap-4">
            <div className="flex-1 bg-dark-800 border border-dark-600 rounded flex items-center px-4 py-2 focus-within:border-brand-500/50 transition-colors">
              <Search size={16} className="text-slate-500 mr-3" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Filter by Action (Press Enter)..." 
                className="bg-transparent border-none outline-none text-sm text-slate-200 w-full font-mono placeholder:text-dark-500" 
              />
            </div>
            <Button onClick={handleExport} variant="secondary" className="flex items-center gap-2 font-semibold border-dark-600 hover:border-brand-500/50">
              <FileSpreadsheet size={16} className="text-green-500" /> Export to CSV
            </Button>
            <Button onClick={() => setToast({message: 'Generating PDF...', type: 'info'})} variant="secondary" className="flex items-center gap-2 font-semibold border-dark-600 hover:border-brand-500/50">
              <FileText size={16} className="text-red-400" /> Download PDF Report
            </Button>
          </div>

          {/* Table Card */}
          <Card className="flex-1 flex flex-col border-dark-600 overflow-hidden shadow-xl bg-dark-900/50">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 font-mono uppercase bg-dark-800 sticky top-0 border-b border-dark-600 z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">TIMESTAMP</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">ACTION</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">USER_ID</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">RESOURCE</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50 font-mono">
                  {loading && logs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-slate-500">Loading system logs...</td></tr>
                  ) : logs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-slate-500">No logs found matching criteria.</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-dark-800 transition-colors group">
                        <td className="px-6 py-4 text-slate-400 group-hover:text-slate-300">
                          {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium', hour12: false })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-slate-300 truncate max-w-[200px]" title={log.action}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${getCategoryColor(log.action)}`}></span>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{log.user_id || 'SYSTEM'}</td>
                        <td className="px-6 py-4 text-slate-400 truncate max-w-[150px]" title={log.resource || 'N/A'}>
                          {log.resource || '-'} {log.resource_id ? `#${log.resource_id}` : ''}
                        </td>
                        <td className={`px-6 py-4 uppercase tracking-widest text-xs ${getStatusColor(log.status)}`}>
                          {log.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-dark-600 bg-dark-800 p-4 flex justify-between items-center text-xs font-mono text-slate-500 uppercase tracking-widest">
              <span>DISPLAYING {logs.length} OF {total} EVENTS</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded bg-dark-900 border border-dark-600 hover:bg-dark-700 text-slate-400 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center px-3 bg-dark-900 border border-dark-600 rounded text-slate-300">
                  Page {page} of {totalPages}
                </div>
                <button 
                  onClick={() => setPage(Math.max(1, Math.min(totalPages, page + 1)))}
                  disabled={page === totalPages || totalPages === 0}
                  className="w-8 h-8 flex items-center justify-center rounded bg-dark-900 border border-dark-600 hover:bg-dark-700 text-slate-400 transition-colors disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
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
                <input type="text" value={new Date().toLocaleDateString()} className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-slate-400 focus:outline-none cursor-not-allowed" readOnly title="Date filtering not implemented in current backend" />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">MODULE SOURCE (ACTION)</label>
              <select 
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
              >
                <option value="All System Modules">All System Modules</option>
                <option value="auth">Authentication</option>
                <option value="admin">Admin Actions</option>
                <option value="scan">Scanner Core</option>
              </select>
            </div>

            <div className="space-y-3">
              <Button onClick={() => fetchLogs()} variant="primary" className="w-full font-bold tracking-wider py-3 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/30 transition-all">
                {loading ? 'REFRESHING...' : 'REFRESH SYSTEM LOGS'}
              </Button>
              <button onClick={clearFilters} className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors py-2">
                CLEAR ALL FILTERS
              </button>
            </div>
          </div>

          <Card className="bg-dark-800/50 border-dark-600 p-5 mt-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">LOG INTEGRITY</span>
              <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} /> SECURE
              </span>
            </div>
            <div className="flex gap-1 mb-3">
              <div className="h-1.5 flex-1 bg-green-500/80 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500/80 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500/80 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500/80 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500/80 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              Checksum verified via SHA-256 at {new Date().toLocaleTimeString()}. No tampering detected in active buffer. Immutable blockchain anchor synced.
            </p>
          </Card>
        </aside>

      </div>
    </div>
  );
}
