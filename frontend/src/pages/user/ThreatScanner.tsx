import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertTriangle, Upload, Globe, MessageSquare, Image as ImageIcon, BrainCircuit, ShieldAlert, Fingerprint, ShieldCheck, CheckCircle, Clock, X, ChevronRight, XCircle } from 'lucide-react';
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

  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColor}`}>
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

export function ThreatScanner() {
  const [scanType, setScanType] = useState<'url' | 'message' | 'image'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const startScan = async () => {
    if (!inputValue && scanType !== 'image') {
      setToast({ message: 'Please enter content to scan.', type: 'warning' });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      let result;
      if (scanType === 'url') {
        result = await api.scanner.scanUrl(inputValue);
      } else if (scanType === 'message') {
        result = await api.scanner.scanMessage(inputValue);
      } else {
        // Mock image scan for now
        await new Promise(r => setTimeout(r, 2000));
        result = { verdict: 'legitimate', risk_level: 'SAFE', confidence: 0.99, analysis_details: { signals: [] } };
      }
      setScanResult(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during scanning');
      setToast({ message: err.message || 'Scan failed', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };

  const loadHistory = async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const res = await api.scanner.getHistory(1, 20);
      setHistory(res.results || []);
    } catch (err: any) {
      setToast({ message: 'Failed to load scan history', type: 'error' });
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* History Modal Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl bg-dark-800 border-brand-500/30 shadow-2xl shadow-brand-500/10 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 rounded-t-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="text-brand-500" /> Recent Scan History
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white transition-colors bg-dark-800 p-2 rounded-lg hover:bg-dark-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {historyLoading ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 font-mono text-sm">Retrieving analysis logs...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-dark-600 rounded-xl bg-dark-900/30">
                  <Fingerprint size={40} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 font-bold">No scan history found</p>
                  <p className="text-xs text-slate-500 mt-2">Your recent scans will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-900/50 border border-dark-700 rounded-xl hover:border-dark-500 transition-colors gap-4">
                      <div className="flex items-start gap-4 overflow-hidden">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          item.verdict === 'phishing' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                          item.verdict === 'suspicious' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                          'bg-green-500/10 text-green-500 border border-green-500/20'
                        }`}>
                          {item.scan_type === 'url' ? <Globe size={18} /> : 
                           item.scan_type === 'message' ? <MessageSquare size={18} /> : <ImageIcon size={18} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-200 truncate" title={item.input_value}>
                            {item.input_value.length > 50 ? item.input_value.substring(0, 50) + '...' : item.input_value}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs font-mono">
                            <span className="text-slate-500">{new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                            <span className="text-slate-600">•</span>
                            <span className={`font-bold ${
                              item.verdict === 'phishing' ? 'text-red-500' : 
                              item.verdict === 'suspicious' ? 'text-yellow-500' : 'text-green-500'
                            }`}>
                              {(item.confidence * 100).toFixed(1)}% CONFIDENCE
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end shrink-0">
                        <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
                          item.verdict === 'phishing' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                          item.verdict === 'suspicious' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                          'bg-green-500/10 border-green-500/30 text-green-400'
                        }`}>
                          {item.verdict}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-brand-500"></div>
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">ADVANCED SCANNER</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">AI Threat Scanner</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Use our deep-learning neural networks to analyze links, messages, and images for hidden scam signatures.
        </p>
      </section>

      {/* Main Scan Interface */}
      <Card className="bg-dark-800 border-dark-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Fingerprint size={200} />
        </div>
        <CardContent className="p-0 relative z-10">
          <div className="flex border-b border-dark-600 overflow-x-auto scrollbar-hide">
             <button 
               onClick={() => { setScanType('url'); setScanResult(null); setInputValue(''); }}
               className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                 scanType === 'url' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <Globe size={18} /> URL / LINK
             </button>
             <button 
               onClick={() => { setScanType('message'); setScanResult(null); setInputValue(''); }}
               className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                 scanType === 'message' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <MessageSquare size={18} /> SMS / MESSAGE
             </button>
             <button 
               onClick={() => { setScanType('image'); setScanResult(null); setInputValue(''); }}
               className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                 scanType === 'image' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <ImageIcon size={18} /> IMAGE / CAPTURE
             </button>
          </div>

          <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-6">
               {scanType === 'url' && (
                 <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Suspect Link</label>
                    <div className="flex flex-col md:flex-row gap-4">
                       <div className="flex-1 relative group">
                         <input 
                           type="text" 
                           value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && startScan()}
                           placeholder="e.g. https://vietcombank-verify.online/login" 
                           className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all pr-12"
                           disabled={isScanning}
                         />
                         {inputValue && !isScanning && (
                           <button onClick={() => setInputValue('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                             <X size={16} />
                           </button>
                         )}
                       </div>
                       <Button onClick={startScan} disabled={isScanning || !inputValue.trim()} className="bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 min-w-[180px] hover:scale-105 transition-transform">
                         {isScanning ? 'ANALYZING...' : 'RUN SCAN'}
                       </Button>
                    </div>
                 </div>
               )}

               {scanType === 'message' && (
                 <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Paste the SMS or Social Media message here..." 
                      className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl px-4 py-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none custom-scrollbar"
                      disabled={isScanning}
                    />
                    <Button onClick={startScan} disabled={isScanning || !inputValue.trim()} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform">
                      {isScanning ? 'SCANNING CONTENT...' : 'ANALYZE INTENT'}
                    </Button>
                 </div>
               )}

               {scanType === 'image' && (
                 <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Upload Screenshot</label>
                    <div className="border-2 border-dashed border-dark-600 rounded-2xl p-12 text-center hover:border-brand-500 hover:bg-brand-500/5 transition-all cursor-pointer group">
                       <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all">
                          <Upload size={32} className="text-slate-500 group-hover:text-brand-500" />
                       </div>
                       <h4 className="text-white font-bold mb-1">Drag & Drop or Click to Upload</h4>
                       <p className="text-xs text-slate-500">Supports PNG, JPG (Max 5MB)</p>
                    </div>
                    <Button onClick={startScan} disabled={isScanning} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-brand-500/20">
                      {isScanning ? 'PROCESSING IMAGE...' : 'VISUAL SCAN'}
                    </Button>
                 </div>
               )}

               {error && (
                 <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in-95">
                   <AlertTriangle size={18} /> {error}
                 </div>
               )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Pipeline Display (Only if scanning) */}
      {isScanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-300">
           <div className="bg-dark-800 border border-brand-500/30 p-6 rounded-2xl animate-pulse shadow-lg shadow-brand-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <Globe size={18} className="text-brand-500" />
                 <span className="text-sm font-bold text-white">DNS & Reputation</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 w-1/3 animate-ping"></div>
              </div>
           </div>
           <div className="bg-dark-800 border border-purple-500/30 p-6 rounded-2xl animate-pulse delay-75 shadow-lg shadow-purple-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <BrainCircuit size={18} className="text-purple-500" />
                 <span className="text-sm font-bold text-white">NLP Intent Engine</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full">
                 <div className="h-full bg-purple-500 w-1/2 animate-ping"></div>
              </div>
           </div>
           <div className="bg-dark-800 border border-cyan-500/30 p-6 rounded-2xl animate-pulse delay-150 shadow-lg shadow-cyan-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <Fingerprint size={18} className="text-cyan-500" />
                 <span className="text-sm font-bold text-white">Pattern Matching</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full">
                 <div className="h-full bg-cyan-500 w-1/4 animate-ping"></div>
              </div>
           </div>
        </div>
      )}

      {/* Result Display */}
      {!isScanning && scanResult && (
        <Card className={`border-2 animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 shadow-2xl ${
          scanResult.verdict === 'phishing' ? 'border-red-500 shadow-red-500/20 bg-gradient-to-br from-red-500/10 to-dark-800' : 
          scanResult.verdict === 'suspicious' ? 'border-yellow-500 shadow-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-dark-800' : 
          'border-green-500 shadow-green-500/20 bg-gradient-to-br from-green-500/10 to-dark-800'
        }`}>
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
               <div className={`w-32 h-32 rounded-full flex items-center justify-center shrink-0 border-4 shadow-inner ${
                 scanResult.verdict === 'phishing' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 
                 scanResult.verdict === 'suspicious' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 
                 'bg-green-500/20 text-green-500 border-green-500/50'
               }`}>
                 {scanResult.verdict === 'phishing' ? <ShieldAlert size={64} className="animate-pulse" /> : 
                  scanResult.verdict === 'suspicious' ? <AlertTriangle size={64} /> : <ShieldCheck size={64} />}
               </div>
               
               <div className="flex-1 text-center md:text-left space-y-4">
                 <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                   <h3 className={`text-3xl font-bold uppercase tracking-tight ${
                     scanResult.verdict === 'phishing' ? 'text-red-400' : 
                     scanResult.verdict === 'suspicious' ? 'text-yellow-400' : 'text-green-400'
                   }`}>
                     {scanResult.verdict === 'phishing' ? 'High Risk Threat Detected' : 
                      scanResult.verdict === 'suspicious' ? 'Caution: Suspicious Content' : 'Scan Clear & Safe'}
                   </h3>
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold border tracking-widest ${
                     scanResult.risk_level === 'CRITICAL' ? 'bg-red-500/20 border-red-500 text-red-500' : 
                     scanResult.risk_level === 'HIGH' ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 
                     scanResult.risk_level === 'SAFE' ? 'bg-green-500/20 border-green-500 text-green-500' : 
                     'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                   }`}>
                     {scanResult.risk_level} RISK
                   </span>
                 </div>
                 
                 <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-600 inline-block text-left w-full">
                    <p className="text-slate-400 text-sm font-mono mb-2">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] block mb-1">Target</span>
                      <span className="text-slate-200 break-all">{inputValue}</span>
                    </p>
                    <p className="text-slate-400 text-sm font-mono">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] block mb-1">AI Confidence Score</span>
                      <span className="text-white font-bold text-lg">{(scanResult.confidence * 100).toFixed(2)}%</span>
                    </p>
                 </div>

                 {scanResult.analysis_details?.signals && scanResult.analysis_details.signals.length > 0 && (
                   <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {scanResult.analysis_details.signals.map((signal: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 text-xs text-slate-300 bg-dark-900/80 p-3 rounded-lg border border-dark-700">
                          {signal.score > 0 ? <XCircle size={16} className="text-red-500 shrink-0" /> : <CheckCircle size={16} className="text-green-500 shrink-0" />}
                          <span className="leading-tight">{signal.detail}</span>
                        </div>
                      ))}
                   </div>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust & Transparency Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
         <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <ShieldCheck size={24} className="text-brand-500" /> How Our AI Protects You
            </h3>
            <div className="space-y-4">
               <div className="flex gap-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-dark-900 flex items-center justify-center shrink-0 border border-dark-700">
                     <BrainCircuit className="text-brand-500" size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-200 mb-1">Neural Network Analysis</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">Our models are specifically trained on character-level URL sequences and NLP patterns to detect subtle manipulation tactics.</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl hover:bg-dark-800 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-dark-900 flex items-center justify-center shrink-0 border border-dark-700">
                     <ShieldAlert className="text-brand-500" size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-200 mb-1">Real-time Blocklists</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">We sync with global threat intelligence feeds to identify and block emerging threats within minutes.</p>
                  </div>
               </div>
            </div>
         </div>

         <Card className="bg-gradient-to-br from-dark-800 to-dark-900 border-dark-600 shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-colors"></div>
            <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                       <AlertTriangle className="text-yellow-500" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Scan Disclaimer</h3>
                 </div>
                 <p className="text-sm text-slate-400 leading-relaxed mb-6">
                   While our AI is highly accurate, new scam tactics emerge daily. Always exercise caution when clicking links from unknown sources. When in doubt, report it to the community.
                 </p>
               </div>
               <Button onClick={loadHistory} variant="secondary" className="w-full border-dark-600 text-slate-300 bg-dark-900 hover:bg-dark-700 hover:text-white transition-all flex items-center justify-center gap-2 py-4">
                 <Clock size={16} /> View Scan History <ChevronRight size={16} className="opacity-50" />
               </Button>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}
