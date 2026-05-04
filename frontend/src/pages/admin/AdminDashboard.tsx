import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { GeographicMap } from '../../components/GeographicMap';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreVertical, Zap, Users, ShieldAlert, FileSearch, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';

const LATENCY_DATA = [
  { name: '10s', value: 45 }, { name: '20s', value: 52 }, { name: '30s', value: 38 },
  { name: '40s', value: 65 }, { name: '50s', value: 42 }, { name: '60s', value: 30 }
];

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.admin.getDashboard();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.total_users || '0', sub: 'Across all roles', icon: Users, color: 'text-blue-500' },
          { label: 'Scans Performed', value: stats?.total_scans || '0', sub: 'Real-time AI analysis', icon: FileSearch, color: 'text-brand-500' },
          { label: 'Threats Blocked', value: stats?.threats_detected || '0', sub: '98.9% AI accuracy', icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Community Reports', value: stats?.community_posts || '0', sub: 'Verified scam cases', icon: MessageSquare, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-dark-800 border-dark-600">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-dark-900 border border-dark-700 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : stat.value}</h3>
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className="text-[10px] text-slate-600 italic">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Map Area */}
        <Card className="lg:col-span-2 bg-dark-800 border-dark-600">
          <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Threat Origins</CardTitle>
              <p className="text-xs text-slate-600">Real-time IP geolocations of detected scam links</p>
            </div>
            <Button variant="outline" size="sm" className="border-dark-700 text-slate-400 h-8">Export Map</Button>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <GeographicMap />
          </CardContent>
        </Card>

        {/* Right Sidebar Stats */}
        <div className="space-y-6">
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">System Latency</CardTitle>
                <Zap size={16} className="text-brand-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={LATENCY_DATA}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', fontSize: '10px' }}
                      cursor={{ fill: '#1e293b' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                <span>Avg Response</span>
                <span className="text-white">0.42ms</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="border-b border-dark-700 pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Scan Verdicts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {stats?.scan_by_verdict && Object.entries(stats.scan_by_verdict).map(([key, val]: any) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-white">{val}</span>
                  </div>
                  <div className="h-1 w-full bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        key === 'phishing' ? 'bg-red-500' : key === 'legitimate' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} 
                      style={{ width: `${(val / (stats.total_scans || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <Card className="bg-dark-800 border-dark-600">
        <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Threat Feed</CardTitle>
          <Button variant="outline" size="sm" className="border-dark-700 text-slate-400 h-8">View All Scans</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-dark-700/50">
                  <th className="px-6 py-4 font-bold">Input Value</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Verdict</th>
                  <th className="px-6 py-4 font-bold">Confidence</th>
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/30">
                {stats?.recent_scans?.map((scan: any) => (
                  <tr key={scan.id} className="hover:bg-dark-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-200 truncate max-w-xs">{scan.input_value}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono text-slate-500">{scan.scan_type.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        scan.verdict === 'phishing' ? 'border-red-500/50 text-red-500 bg-red-500/5' : 
                        scan.verdict === 'legitimate' ? 'border-green-500/50 text-green-500 bg-green-500/5' : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'
                      }`}>
                        {scan.verdict.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-slate-400 font-mono">{(scan.confidence * 100).toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-slate-600">{new Date(scan.created_at).toLocaleString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
