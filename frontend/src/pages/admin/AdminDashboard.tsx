import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { GeographicMap } from '../../components/GeographicMap';
import { BarChart, Bar, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Zap, Users, ShieldAlert, FileSearch, MessageSquare, Download, RefreshCw, Cpu, Clock, Server, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Giả lập dữ liệu traffic thời gian thực cho biểu đồ Line Chart
  const [trafficData] = useState([
    { time: '10:00', requests: 120, threats: 15 },
    { time: '10:05', requests: 250, threats: 30 },
    { time: '10:10', requests: 180, threats: 20 },
    { time: '10:15', requests: 300, threats: 45 },
    { time: '10:20', requests: 280, threats: 40 },
    { time: '10:25', requests: 420, threats: 85 },
    { time: '10:30', requests: 350, threats: 50 },
  ]);

  const fetchDashboardData = async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) setIsRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, metricsData, reportsData] = await Promise.all([
        api.admin.getDashboard(),
        api.admin.getModelMetrics(),
        api.admin.getReports().catch(() => []) // Fallback to empty array if fails
      ]);
      setStats(statsData);
      setMetrics(metricsData);
      setPendingReports(reportsData.filter((r: any) => r.status === 'pending').slice(0, 5)); // Chỉ lấy 5 report mới nhất
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const exportToCSV = () => {
    if (!stats?.recent_scans) return;
    const csvRows = [];
    const headers = ['ID', 'Input Value', 'Scan Type', 'Verdict', 'Confidence', 'Timestamp'];
    csvRows.push(headers.join(','));

    stats.recent_scans.forEach((scan: any) => {
      const row = [
        scan.id,
        `"${scan.input_value}"`,
        scan.scan_type,
        scan.verdict,
        scan.confidence,
        scan.created_at
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `scam_guardian_threat_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time overview of the AI defense grid and system metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" className="border-dark-600 text-slate-300">
            <Download size={16} className="mr-2" /> Export Data
          </Button>
          <Button onClick={() => fetchDashboardData(true)} variant="primary" className="bg-brand-600 hover:bg-brand-500">
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Nodes
          </Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans Performed', value: stats?.total_scans || '0', sub: `${stats?.scans_today || 0} in the last 24h`, icon: FileSearch, color: 'text-brand-500' },
          { label: 'Threats Neutralized', value: stats?.threats_detected || '0', sub: 'Detected & Blocked', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Registered Users', value: stats?.total_users || '0', sub: `${stats?.active_users || 0} currently active`, icon: Users, color: 'text-blue-500' },
          { label: 'Community Intel', value: stats?.community_posts || '0', sub: 'Shared scam patterns', icon: MessageSquare, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-dark-800 border-dark-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon size={80} className={stat.color} />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-dark-900 border border-dark-700 ${stat.color} shadow-lg shadow-black/50`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : stat.value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[10px] text-slate-500">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Map Area */}
        <Card className="lg:col-span-2 bg-dark-800 border-dark-600 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Live Global Threat Map</CardTitle>
              <p className="text-xs text-slate-600 mt-1">Geographic distribution of detected cyber threats</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[400px] relative bg-dark-900 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/10 via-dark-900 to-dark-900 pointer-events-none"></div>
            <GeographicMap />
          </CardContent>
        </Card>

        {/* Right Sidebar Stats - System Health & AI */}
        <div className="space-y-6 flex flex-col">
          {/* AI Model Metrics */}
          <Card className="bg-dark-800 border-dark-600 flex-1">
            <CardHeader className="pb-2 border-b border-dark-700 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">AI Core Metrics</CardTitle>
                <Cpu size={16} className="text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Engine Version</div>
                  <div className="text-sm font-mono text-white bg-dark-900 px-2 py-1 rounded border border-dark-700">{metrics?.model_version || 'v1.0.0'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Confidence Avg</div>
                  <div className="text-lg font-bold text-brand-400">{metrics ? (metrics.avg_confidence * 100).toFixed(1) : '0'}%</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-2">
                  <span>Inference Latency</span>
                  <span className="text-green-400">{metrics?.avg_processing_time_ms || 0} ms</span>
                </div>
                <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-1/4"></div>
                </div>
                <p className="text-[9px] text-slate-600 mt-1">Excellent performance. Target &lt; 50ms.</p>
              </div>

              <div className="pt-4 border-t border-dark-700">
                <div className="text-[10px] text-slate-400 font-bold uppercase mb-3">Threat Distribution</div>
                <div className="space-y-3">
                  {[
                    { label: 'Phishing URLs', value: metrics?.phishing_detected || 0, color: 'bg-red-500' },
                    { label: 'Suspicious Content', value: metrics?.suspicious_count || 0, color: 'bg-yellow-500' },
                    { label: 'Legitimate', value: metrics?.legitimate_count || 0, color: 'bg-green-500' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                        <span className="text-slate-300">{item.label}</span>
                      </div>
                      <span className="font-mono text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Load Chart */}
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2 border-b border-dark-700 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Node Traffic</CardTitle>
                <Server size={16} className="text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', fontSize: '10px' }}
                    />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Total Scans</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Threats</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 bg-dark-800 border-dark-600">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Threat Feed</CardTitle>
              <p className="text-xs text-slate-600 mt-1">Live stream of AI scan results</p>
            </div>
            <Button onClick={() => navigate('/admin/threat-intel')} variant="outline" size="sm" className="border-dark-700 text-slate-400 hover:text-white">
              View All Scans
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-dark-700/50 bg-dark-900/30">
                    <th className="px-6 py-4 font-bold">Input Value</th>
                    <th className="px-6 py-4 font-bold">Type</th>
                    <th className="px-6 py-4 font-bold">Verdict</th>
                    <th className="px-6 py-4 font-bold">Confidence</th>
                    <th className="px-6 py-4 font-bold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/30">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500 text-sm">Loading feed...</td></tr>
                  ) : stats?.recent_scans?.length > 0 ? (
                    stats.recent_scans.map((scan: any) => (
                      <tr key={scan.id} className="hover:bg-dark-900/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-slate-200 truncate max-w-[250px]">{scan.input_value}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-mono text-slate-500">{scan.scan_type.toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            scan.verdict === 'phishing' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 
                            scan.verdict === 'legitimate' ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                          }`}>
                            {scan.verdict.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[10px] text-slate-400 font-mono">{(scan.confidence * 100).toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <Clock size={12} className="text-slate-600" />
                          <div className="text-[10px] text-slate-500">{new Date(scan.created_at).toLocaleString()}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500 text-sm">No recent scans found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reports Snippet */}
        <Card className="bg-dark-800 border-dark-600">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" /> Action Required
              </CardTitle>
            </div>
            <Button onClick={() => navigate('/admin/reports')} variant="outline" size="sm" className="border-dark-700 text-slate-400 h-8 px-2">
              Review Queue
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-dark-700/50">
              {loading ? (
                <div className="p-6 text-center text-slate-500 text-sm">Checking queue...</div>
              ) : pendingReports.length > 0 ? (
                pendingReports.map((report: any, idx) => (
                  <div key={idx} className="p-4 hover:bg-dark-900/50 transition-colors cursor-pointer" onClick={() => navigate('/admin/reports')}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${report.type === 'scam_report' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {report.type === 'scam_report' ? 'Scam Report' : 'Appeal'}
                      </span>
                      <span className="text-[10px] text-slate-600">{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200 truncate">{report.target}</p>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">{report.category}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <div className="w-10 h-10 rounded-full bg-dark-700/30 flex items-center justify-center mx-auto mb-3">
                    <ShieldAlert size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Queue is empty</p>
                  <p className="text-[10px] text-slate-600 mt-1">No pending reports to review</p>
                </div>
              )}
            </div>
            {pendingReports.length > 0 && (
              <div className="p-3 border-t border-dark-700 text-center">
                <button onClick={() => navigate('/admin/reports')} className="text-[10px] font-bold text-brand-400 hover:text-brand-300 uppercase tracking-widest transition-colors">
                  View All {pendingReports.length} Pending Items →
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
