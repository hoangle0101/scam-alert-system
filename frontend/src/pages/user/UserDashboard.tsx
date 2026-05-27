import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Shield, Search, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, Zap, Settings, BookOpen, Activity, Globe, Clock, XCircle, Download, Copy, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { GeographicMap } from '../../components/GeographicMap';

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
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : type === 'warning' ? AlertTriangle : Activity;

  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColor}`}>
      <Icon size={18} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

export function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    total_scans: 0,
    phishing_scans: 0,
    suspicious_scans: 0,
    safe_scans: 0,
    avg_latency_ms: 0.0,
    status: 'Initializing...',
    threat_level: 'UNKNOWN'
  });
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'cnn' | 'xgboost'>('cnn');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [historyData, statsData, reportsData] = await Promise.all([
        api.scanner.getHistory(1, 10),
        api.scanner.getStats(),
        api.reports.getMyReports().catch(() => []) // Phân trang báo cáo cá nhân
      ]);
      
      setRecentAlerts(historyData?.results || []);
      setStats(statsData || {});
      setMyReports(reportsData.slice(0, 4) || []); // Lấy 4 báo cáo mới nhất
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setToast({ message: 'Lỗi đồng bộ dữ liệu từ Server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickScan = async () => {
    if (!inputValue.trim()) return;
    setIsScanning(true);
    try {
      const result = await api.scanner.scanUrl(inputValue, activeTab);
      
      setInputValue('');
      
      // Hiển thị kết quả bằng Toast
      if (result.verdict === 'phishing') {
        setToast({ message: `Cảnh báo: Phát hiện liên kết ĐỘC HẠI (${(result.confidence*100).toFixed(0)}%)`, type: 'error' });
      } else if (result.verdict === 'suspicious') {
        setToast({ message: `Chú ý: Nội dung ĐÁNG NGỜ (${(result.confidence*100).toFixed(0)}%)`, type: 'warning' });
      } else {
        setToast({ message: 'An toàn: Không phát hiện rủi ro.', type: 'success' });
      }
      
      // Refresh lịch sử quét
      fetchDashboardData();
    } catch (e: any) {
      console.error(e);
      setToast({ message: e.message || 'Lỗi hệ thống phân tích', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  const exportUserReport = () => {
    if (!recentAlerts || recentAlerts.length === 0) {
      setToast({ message: 'Không có dữ liệu để xuất file', type: 'warning' });
      return;
    }
    
    const csvRows = ['ID,Loại,Nội dung,Kết quả,Độ tin cậy,Thời gian'];
    recentAlerts.forEach((scan: any) => {
      csvRows.push(`${scan.id},${scan.scan_type},"${scan.input_value}",${scan.verdict},${scan.confidence},${scan.created_at}`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_security_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setToast({ message: 'Đã xuất file báo cáo CSV', type: 'info' });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://scamguardian.vn/invite/FML-849X');
    setToast({ message: 'Đã sao chép link mời Family Shield!', type: 'success' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-[1600px] mx-auto relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- HERO SECTION --- */}
      <section className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-800 to-dark-900 overflow-hidden shadow-2xl shadow-brand-500/20 border border-brand-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Shield size={400} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              System {stats.status || 'Active'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-300">Guardian</span>
            </h1>
            <p className="text-brand-100 text-lg max-w-2xl leading-relaxed mb-8">
              Your comprehensive protection shield is active. We have analyzed <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{stats.total_scans || 0}</span> threats to date. The current network threat level is <span className={`font-bold px-2 py-0.5 rounded ${stats.threat_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : stats.threat_level === 'ELEVATED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{stats.threat_level || 'NORMAL'}</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/user/scanner')} className="bg-white text-brand-700 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold shadow-lg shadow-white/10 transition-all hover:scale-105">
                Go to Deep Scanner
              </Button>
              <Button onClick={exportUserReport} variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold backdrop-blur-sm transition-all group">
                <Download size={18} className="mr-2 inline-block group-hover:-translate-y-1 transition-transform" /> View Full Report
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
             <div className="bg-dark-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-brand-500/50 transition-colors">
                <ShieldCheck className="text-green-400 mb-3" size={32} />
                <div className="text-3xl font-black text-white mb-1">{stats.safe_scans || 0}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Safe Items</div>
             </div>
             <div className="bg-dark-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-red-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 blur-2xl rounded-full"></div>
                <AlertTriangle className="text-red-400 mb-3 relative z-10" size={32} />
                <div className="text-3xl font-black text-white mb-1 relative z-10">{stats.phishing_scans || 0}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold relative z-10">Threats Blocked</div>
             </div>
             <div className="bg-dark-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-colors">
                <Search className="text-yellow-400 mb-3" size={32} />
                <div className="text-3xl font-black text-white mb-1">{stats.suspicious_scans || 0}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Suspicious</div>
             </div>
             <div className="bg-dark-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <Zap className="text-blue-400 mb-3" size={32} />
                <div className="text-3xl font-black text-white mb-1">{stats.avg_latency_ms || 0} <span className="text-sm font-normal text-slate-400">ms</span></div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Avg Response Time</div>
             </div>
          </div>
        </div>
      </section>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: 2/3 width */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Universal Quick Scan Widget */}
          <Card className="bg-dark-800 border-dark-600 overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="flex border-b border-dark-600 bg-dark-900/50">
                <button 
                  onClick={() => setActiveTab('cnn')}
                  className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'cnn' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Globe size={18} /> 1D-CNN Model
                </button>
                <button 
                  onClick={() => setActiveTab('xgboost')}
                  className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'xgboost' ? 'text-green-500 border-b-2 border-green-500 bg-green-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Search size={18} /> XGBoost Model
                </button>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={20} className={isScanning ? "text-brand-500 animate-pulse" : "text-slate-500"} />
                    </div>
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickScan()}
                      placeholder="Paste a suspicious URL here..."
                      disabled={isScanning}
                      className={`w-full bg-dark-900 border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-slate-200 transition-all outline-none disabled:opacity-50 focus:ring-1 ${
                        activeTab === 'cnn' ? 'focus:border-brand-500 focus:ring-brand-500' : 'focus:border-green-500 focus:ring-green-500'
                      }`}
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    className={`px-8 py-4 rounded-xl font-bold shadow-lg whitespace-nowrap min-w-[160px] text-white ${
                      activeTab === 'cnn' ? 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20' : 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                    }`}
                    onClick={handleQuickScan}
                    disabled={!inputValue.trim() || isScanning}
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Scanning...</span>
                    ) : 'Quick Analyze'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Detailed Recent Activity Table */}
            <Card className="bg-dark-800 border-dark-600 shadow-xl col-span-1 lg:col-span-2">
              <CardContent className="p-0">
                <div className="p-6 border-b border-dark-600 flex justify-between items-center bg-dark-900/30">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock size={20} className="text-brand-500" /> My Scan History
                  </h3>
                  <Button variant="outline" size="sm" className="text-xs font-bold border-dark-600 text-slate-300 hover:text-white" onClick={() => navigate('/user/scanner')}>
                    View Deep Logs
                  </Button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-dark-900/50 text-slate-400 text-[10px] uppercase tracking-widest">
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Content Target</th>
                        <th className="p-4 font-semibold">Verdict</th>
                        <th className="p-4 font-semibold text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="p-4"><div className="w-8 h-8 bg-dark-700 rounded-lg"></div></td>
                            <td className="p-4"><div className="w-32 h-4 bg-dark-700 rounded"></div></td>
                            <td className="p-4"><div className="w-20 h-6 bg-dark-700 rounded-full"></div></td>
                            <td className="p-4 text-right"><div className="w-20 h-4 bg-dark-700 rounded ml-auto"></div></td>
                          </tr>
                        ))
                      ) : recentAlerts.length > 0 ? (
                        recentAlerts.map((alert: any) => (
                          <tr key={alert.id} className="hover:bg-dark-700/30 transition-colors group">
                            <td className="p-4 w-16">
                              <div className="w-8 h-8 rounded-lg bg-dark-900 border border-dark-600 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                                <Globe size={14} />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-xs font-medium text-slate-200 truncate max-w-[200px]" title={alert.input_value}>
                                {alert.input_value}
                              </div>
                            </td>
                            <td className="p-4 w-32">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                                alert.verdict === 'phishing' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                                alert.verdict === 'suspicious' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'
                              }`}>
                                {alert.verdict === 'phishing' ? <XCircle size={10} /> : alert.verdict === 'suspicious' ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}
                                {alert.verdict.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-right text-[10px] text-slate-500 whitespace-nowrap">
                              {new Date(alert.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">
                            <Activity size={24} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No scans recorded yet. Try scanning a link or message.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* My Community Reports */}
            <Card className="bg-dark-800 border-dark-600 shadow-xl col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between border-b border-dark-700 pb-4 bg-dark-900/30">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" /> My Submissions
                </CardTitle>
                <Button variant="outline" size="sm" className="border-dark-600 text-slate-300 h-8 hover:text-white" onClick={() => navigate('/user/reports')}>
                  Report Hub
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-dark-700">
                  {loading ? (
                    <div className="p-6 text-center text-slate-500 text-sm">Loading reports...</div>
                  ) : myReports.length > 0 ? (
                    myReports.map((report: any, idx) => (
                      <div key={idx} className="p-4 hover:bg-dark-900/50 transition-colors cursor-pointer" onClick={() => navigate('/user/reports')}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${report.type === 'Scam Report' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                            {report.type}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : report.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {report.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-200 truncate">{report.target}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span className="uppercase text-[9px] border border-dark-600 px-1 rounded">{report.category}</span>
                          <span>Submitted on {new Date(report.date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      <div className="w-10 h-10 rounded-full bg-dark-700/30 flex items-center justify-center mx-auto mb-3 border border-dark-600">
                        <ShieldAlert size={16} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-300">No submissions yet</p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">Help the community by reporting scams</p>
                      <Button variant="outline" size="sm" className="border-brand-500/30 text-brand-400 hover:bg-brand-500/10" onClick={() => navigate('/user/reports')}>
                        Submit a Report
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: 1/3 width */}
        <div className="space-y-8">
          
          {/* Threat Landscape Map */}
          <Card className="bg-dark-800 border-dark-600 shadow-xl overflow-hidden flex flex-col h-[350px]">
             <div className="p-4 border-b border-dark-600 shrink-0 bg-dark-900/30">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                  <Globe size={16} className="text-brand-500" /> Global Threat Landscape
                </h3>
             </div>
             <div className="flex-1 relative bg-dark-900">
                <GeographicMap />
                <div className="absolute bottom-4 left-4 right-4 bg-dark-900/90 backdrop-blur p-4 rounded-xl border border-dark-600 z-[500] shadow-lg">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Current Threat Level</span>
                      <span className="text-xs font-bold text-red-400 animate-pulse">HIGH RISK</span>
                   </div>
                   <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-red-500 w-[75%] relative">
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                   </div>
                </div>
             </div>
          </Card>

          {/* Family Shield Sidebar */}
          <Card className="bg-gradient-to-b from-brand-900/20 to-dark-800 border-brand-500/20 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-blue-500 to-purple-500"></div>
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                        <Shield size={20} />
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-white">Family Shield</h3>
                        <p className="text-[10px] text-brand-300 font-mono tracking-widest uppercase">3/5 Seats</p>
                     </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/user/settings')} className="border-dark-600 h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-white flex items-center justify-center">
                    <Settings size={14} />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-6">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-brand-500/30 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3 relative z-10">
                         <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold border border-brand-500/20">ME</div>
                         <div>
                            <div className="text-sm font-bold text-white">My Device</div>
                            <div className="text-[10px] text-green-400 flex items-center gap-1 font-bold uppercase"><CheckCircle size={10} /> Active</div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-dark-600 hover:border-brand-500/30 transition-colors relative group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold border border-purple-500/20">MD</div>
                         <div>
                            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Mom's Phone</div>
                            <div className="text-[10px] text-yellow-500 flex items-center gap-1 font-bold uppercase"><AlertTriangle size={10} /> 1 blocked</div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-dark-600 hover:border-brand-500/30 transition-colors relative group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold border border-blue-500/20">KD</div>
                         <div>
                            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Kid's iPad</div>
                            <div className="text-[10px] text-green-500 flex items-center gap-1 font-bold uppercase"><CheckCircle size={10} /> Active</div>
                         </div>
                      </div>
                   </div>
                </div>

                <Button onClick={copyInviteLink} variant="outline" className="w-full border-brand-500/30 text-brand-400 hover:bg-brand-500/10 font-bold py-3 rounded-xl border-dashed group">
                   <Copy size={16} className="mr-2 inline-block group-hover:scale-110 transition-transform" /> Copy Invite Link
                </Button>
             </CardContent>
          </Card>

          {/* Security Academy Tip */}
          <Card className="bg-dark-800 border-dark-600 shadow-xl group cursor-pointer" onClick={() => navigate('/user/knowledge')}>
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <BookOpen size={16} className="text-brand-500" /> Academy Tip
                   </h3>
                   <span className="text-[10px] bg-brand-500/20 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Daily</span>
                </div>
                <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 relative overflow-hidden">
                   <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
                     <Shield size={100} />
                   </div>
                   <h4 className="text-sm font-bold text-brand-300 mb-2 relative z-10 group-hover:text-brand-400 transition-colors">The "Urgent Action" Trap</h4>
                   <p className="text-xs text-slate-400 leading-relaxed mb-4 relative z-10">
                     Scammers often create a false sense of urgency (e.g., "Your account will be locked in 24 hours"). Always pause and verify independently before clicking any links.
                   </p>
                   <div className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-500 uppercase tracking-widest relative z-10 group-hover:translate-x-1 transition-transform">
                      Read full article <ArrowRight size={12} />
                   </div>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
