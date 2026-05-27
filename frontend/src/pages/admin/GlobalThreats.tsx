import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { ShieldAlert, Activity, Lock, Link, Search, UserPlus, Fingerprint, Eye, TrendingUp, CheckCircle, XCircle, Globe } from 'lucide-react';
import { GeographicMap } from '../../components/GeographicMap';
import { api } from '../../services/api';
import { ScanDetailsModal } from '../../components/ScanDetailsModal';

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
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : type === 'warning' ? ShieldAlert : Activity;

  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColor}`}>
      <Icon size={18} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

export function GlobalThreats() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  // Scanner State
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const fetchData = async () => {
    try {
      const [metricsData, scansData, usersData, dashData] = await Promise.all([
        api.admin.getModelMetrics(),
        api.admin.getScans(1),
        api.admin.getUsers(),
        api.admin.getDashboard()
      ]);
      setMetrics(metricsData);
      setScans(scansData.scans || []);
      setUsers((usersData.users || []).slice(0, 5));
      setDashboardStats(dashData);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to sync Global Threat data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s refresh for live feel
    return () => clearInterval(interval);
  }, []);

  const handleAdminScan = async () => {
    if (!inputValue.trim()) return;
    setIsScanning(true);
    try {
      const result = await api.scanner.scanUrl(inputValue, 'xgboost');
      
      setInputValue('');
      if (result.verdict === 'phishing') {
        setToast({ message: `CRITICAL: Phishing Detected! (${(result.confidence*100).toFixed(2)}%)`, type: 'error' });
      } else if (result.verdict === 'suspicious') {
        setToast({ message: `WARNING: Suspicious Content (${(result.confidence*100).toFixed(2)}%)`, type: 'warning' });
      } else {
        setToast({ message: 'SAFE: No threats detected.', type: 'success' });
      }
      fetchData(); // Refresh logs
    } catch (e: any) {
      setToast({ message: e.message || 'Scan failed', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  // Calculate percentages for attack vector from ALL database records
  const typeStats = dashboardStats?.scan_by_type || { url: 0, message: 0, file: 0 };
  const totalVector = (Object.values(typeStats).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1) as number;
  const pUrl = Math.round(((typeStats.url || 0) / totalVector) * 100);
  const pMsg = Math.round(((typeStats.message || 0) / totalVector) * 100);
  const pFile = Math.round(((typeStats.file || 0) / totalVector) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-dark-800 border-dark-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">AI CONFIDENCE</h3>
              <ShieldAlert size={16} className="text-brand-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                {metrics ? (metrics.avg_confidence * 100).toFixed(2) : '0.00'}%
              </span>
              <span className="text-xs text-brand-500 mb-1">Model v1</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-800 border-dark-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">NETWORK HEALTH</h3>
              <Activity size={16} className="text-accent-red" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">Optimal</span>
              <span className="text-xs text-slate-500 mb-1">{metrics ? metrics.avg_processing_time_ms.toFixed(1) : '0'}ms latency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-800 border-dark-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-mono text-slate-400">PREDICTIONS MADE</h3>
              <Lock size={16} className="text-slate-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{metrics ? metrics.total_predictions : 0}</span>
              <span className="text-xs text-brand-500 px-2 py-0.5 bg-brand-500/20 rounded font-mono mb-1">Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Scanner Section */}
      <Card className="bg-dark-800 border-dark-600 overflow-hidden flex flex-col shadow-xl">
        {/* Map Part */}
        <div className="h-[350px] relative border-b border-dark-600">
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h2 className="text-xl font-bold text-white mb-1 shadow-black drop-shadow-md">Global Threat Map</h2>
            <p className="text-xs text-slate-300 max-w-md shadow-black drop-shadow-md leading-relaxed">
              Tracking network end points in real-time. Red nodes indicate intrusion attempts blocked in the last 60 minutes.
            </p>
          </div>
          <GeographicMap data={dashboardStats?.map_stats} />
        </div>
        
        {/* Scanner Part */}
        <div className="bg-dark-900/50 p-8">
          <div className="flex gap-8 mb-6 border-b border-dark-700">
            <button className="text-sm font-semibold transition-colors pb-2 flex items-center gap-2 text-brand-500 border-b-2 border-brand-500">
              <Globe size={16} /> URL / Domain
            </button>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider">Target Analytics Endpoint</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-dark-900 border border-dark-700 rounded-lg flex-1 flex items-center px-4 py-3 focus-within:border-brand-500/50 transition-colors">
                <Link size={16} className="text-slate-500 mr-3 shrink-0" />
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminScan()}
                  placeholder="https://suspicious-domain-analysis.net/"
                  className="bg-transparent border-none outline-none text-sm text-slate-200 w-full font-mono placeholder:text-dark-600" 
                  disabled={isScanning}
                />
              </div>
              <Button onClick={handleAdminScan} disabled={isScanning || !inputValue.trim()} variant="primary" className="px-8 shadow-lg shadow-brand-500/20 font-bold tracking-wider py-3 rounded-lg min-w-[160px]">
                {isScanning ? 'ANALYZING...' : 'SCAN TARGET'}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-300 font-mono text-sm tracking-wider font-semibold">
              <Search size={16} /> ANALYSIS PIPELINE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                <div className={`absolute top-0 w-full h-1 ${isScanning ? 'bg-brand-500 animate-pulse' : 'bg-brand-500/30'}`}></div>
                <div className={`w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3 transition-colors ${isScanning ? 'border-brand-500 text-brand-500' : 'text-slate-300'}`}>
                  <Fingerprint size={18} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 1</p>
                <h4 className="text-sm font-bold text-white mb-1">Phishing Detector</h4>
                <p className="text-[10px] text-slate-500 font-mono">XGBoost / Random Forest</p>
              </div>

              <div className="bg-dark-900 border border-dark-700 rounded-xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                <div className={`absolute top-0 w-full h-1 ${isScanning ? 'bg-dark-500 animate-pulse delay-75' : 'bg-dark-600'}`}></div>
                <div className={`w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3 transition-colors ${isScanning ? 'border-slate-400 text-slate-300' : 'text-slate-500'}`}>
                  <TrendingUp size={18} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 2</p>
                <h4 className="text-sm font-bold text-slate-300 mb-1">Scam Analyzer</h4>
                <p className="text-[10px] text-slate-500 font-mono">BERT / LSTM Core</p>
              </div>

              <div className="bg-dark-900 border border-dark-700 rounded-xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group hover:border-brand-500/30 transition-colors">
                <div className="absolute top-0 w-full h-1 bg-dark-600"></div>
                <div className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-3 text-slate-500">
                  <Eye size={18} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-1">STEP 3</p>
                <h4 className="text-sm font-bold text-slate-400 mb-1">Visual Recognizer</h4>
                <p className="text-[10px] text-slate-500 font-mono">CNN / ResNet-50</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Users Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">System Nodes (Active Users)</h2>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 text-xs font-mono bg-dark-800 border border-dark-600 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> ACTIVE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
             [...Array(5)].map((_, i) => (
               <Card key={i} className="bg-dark-800 border-dark-600 p-4 h-48 animate-pulse"></Card>
             ))
          ) : users.map((user) => (
            <Card key={user.id} className="bg-dark-800 border-dark-600 p-4 hover:border-brand-500/30 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-500/50"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-dark-900 flex items-center justify-center text-slate-300 border border-dark-700 font-bold group-hover:border-brand-500/50 transition-colors">
                  {user.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-200 text-sm truncate">{user.full_name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono uppercase truncate">{user.role}</p>
                </div>
              </div>
              <div className="space-y-3 text-xs mb-6 font-mono text-slate-400">
                <div className="flex justify-between"><span>Status</span><span className={user.is_active ? "text-brand-500" : "text-slate-500"}>{user.is_active ? 'ONLINE' : 'OFFLINE'}</span></div>
                <div className="flex justify-between"><span>Total Scans</span><span className="text-white">{user.total_scans}</span></div>
              </div>
              <div className="bg-dark-900/50 border border-dark-700 p-3 rounded-lg">
                <p className="text-[9px] text-slate-500 font-mono mb-1 uppercase">MEMBER SINCE</p>
                <p className="text-xs text-slate-300 font-mono">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
          {users.length < 5 && (
            <Card className="bg-transparent border border-dashed border-dark-600 flex flex-col items-center justify-center text-center p-6 opacity-50">
              <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mb-4 text-dark-500">
                <UserPlus size={24} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono uppercase">Node Available</p>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attack Vector */}
        <Card className="bg-dark-800 border-dark-600">
          <CardHeader className="border-b border-dark-700 bg-dark-900/30">
            <CardTitle className="flex items-center gap-2"><Activity size={18} className="text-brand-500"/> Attack Vector Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>URL (PHISHING)</span>
                <span>{pUrl}%</span>
              </div>
              <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-dark-700">
                <div className="bg-brand-500 h-full transition-all duration-1000" style={{ width: `${pUrl}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>TEXT/SMS (SMISHING)</span>
                <span>{pMsg}%</span>
              </div>
              <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-dark-700">
                <div className="bg-accent-red h-full transition-all duration-1000" style={{ width: `${pMsg}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold font-mono mb-2 text-slate-300">
                <span>FILE (MALWARE)</span>
                <span>{pFile}%</span>
              </div>
              <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-dark-700">
                <div className="bg-slate-500 h-full transition-all duration-1000" style={{ width: `${pFile}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-center shadow-inner">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">Dominant Vector</p>
                <p className="text-sm font-bold text-white">
                  {pUrl >= pMsg && pUrl >= pFile ? 'URL' : pMsg >= pUrl && pMsg >= pFile ? 'TEXT/SMS' : 'FILE'}
                </p>
              </div>
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-inner">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">Trend</p>
                <TrendingUp size={16} className="text-accent-red" />
              </div>
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-center shadow-inner">
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-2">Accuracy</p>
                <p className="text-sm font-bold text-brand-500">
                  {metrics ? (metrics.avg_confidence * 100).toFixed(1) : '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Activity Log */}
        <Card className="bg-dark-800 border-dark-600 h-full flex flex-col">
          <CardHeader className="border-b border-dark-700 bg-dark-900/30">
            <CardTitle className="flex items-center gap-2"><Fingerprint size={18} className="text-brand-500"/> Live Scan Activity</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 bg-dark-950 font-mono text-xs overflow-auto rounded-b-xl max-h-[350px] custom-scrollbar">
            <div className="space-y-4">
              {loading ? (
                <div className="text-slate-500 text-center py-10">Syncing logs...</div>
              ) : scans.length > 0 ? (
                scans.map((scan: any) => (
                  <div 
                    key={scan.id} 
                    className="flex gap-3 hover:bg-dark-900 p-1 -mx-1 rounded transition-colors group cursor-pointer"
                    onClick={() => setSelectedScan(scan)}
                  >
                    <span className="text-slate-600 whitespace-nowrap shrink-0">
                      [{new Date(scan.created_at).toLocaleTimeString([], {hour12: false})}]
                    </span>
                    <span className={`font-bold whitespace-nowrap shrink-0 w-12 ${
                      scan.verdict === 'phishing' ? 'text-red-500' : 
                      scan.verdict === 'suspicious' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {scan.verdict === 'phishing' ? 'BLOCK' : scan.verdict === 'suspicious' ? 'WARN ' : 'SAFE '}
                    </span>
                    <span className="text-slate-300 leading-relaxed break-all line-clamp-2" title={scan.input_value}>
                      Analyzed {scan.scan_type}: "{scan.input_value}" 
                      <span className="text-slate-500 ml-2">({(scan.confidence*100).toFixed(0)}%)</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-center py-10">No recent scan activity detected.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {selectedScan && (
        <ScanDetailsModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </div>
  );
}
