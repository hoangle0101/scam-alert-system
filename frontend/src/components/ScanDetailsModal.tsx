import { X, ShieldAlert, AlertTriangle, ShieldCheck, Clock, Cpu, FileText } from 'lucide-react';

interface ScanDetailsModalProps {
  scan: any | null;
  onClose: () => void;
}

export function ScanDetailsModal({ scan, onClose }: ScanDetailsModalProps) {
  if (!scan) return null;

  const isPhishing = scan.verdict === 'phishing';
  const isSuspicious = scan.verdict === 'suspicious';

  const titleColor = isPhishing ? 'text-red-400' : isSuspicious ? 'text-yellow-400' : 'text-green-400';
  const borderColor = isPhishing ? 'border-red-500/30' : isSuspicious ? 'border-yellow-500/30' : 'border-green-500/30';
  const bgColor = isPhishing ? 'bg-red-500/10' : isSuspicious ? 'bg-yellow-500/10' : 'bg-green-500/10';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`relative w-full max-w-2xl bg-dark-800 border ${borderColor} rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col`}>
        {/* Color stripe */}
        <div className={`h-1.5 w-full ${isPhishing ? 'bg-red-500' : isSuspicious ? 'bg-yellow-500' : 'bg-green-500'}`} />

        {/* Header */}
        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bgColor} ${titleColor} border ${borderColor}`}>
              {isPhishing ? <ShieldAlert size={22} /> : isSuspicious ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Scan Audit Logs</h3>
              <p className="text-xs text-slate-500 font-mono">ID: SCAN-{scan.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* Scanned Input */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Scanned Target</label>
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-sm font-mono text-slate-200 break-all select-all shadow-inner">
              {scan.input_value}
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-5 rounded-xl border ${borderColor} ${bgColor} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                isPhishing ? 'bg-red-500/20 text-red-500' : isSuspicious ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
              }`}>
                {scan.verdict}
              </span>
              <h4 className="text-lg font-extrabold text-white mt-2">
                {isPhishing ? 'Severe Threat Neutralized' : isSuspicious ? 'Cautionary Warnings Issued' : 'Verified Secure Node'}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Inference Confidence</span>
              <span className={`text-2xl font-black ${titleColor}`}>{(scan.confidence * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Performance & Model Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-900/50 border border-dark-700 p-4 rounded-xl flex items-center gap-3">
              <Cpu size={20} className="text-purple-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Analysis Engine</p>
                <p className="text-xs font-bold text-slate-300 truncate max-w-[140px]" title={scan.model_version}>{scan.model_version}</p>
              </div>
            </div>

            <div className="bg-dark-900/50 border border-dark-700 p-4 rounded-xl flex items-center gap-3">
              <Clock size={20} className="text-blue-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Latency</p>
                <p className="text-xs font-bold text-slate-300">{scan.processing_time_ms ? `${scan.processing_time_ms.toFixed(1)} ms` : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-dark-900/50 border border-dark-700 p-4 rounded-xl flex items-center gap-3">
              <FileText size={20} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold">Scan Time</p>
                <p className="text-xs font-bold text-slate-300">{new Date(scan.created_at || scan.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Threat Signals Breakdown */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Threat Signals Pipeline</label>
            {scan.analysis_details?.signals && scan.analysis_details.signals.length > 0 ? (
              <div className="space-y-3">
                {scan.analysis_details.signals.map((signal: any, idx: number) => (
                  <div key={idx} className="bg-dark-900/70 border border-dark-700/60 rounded-xl p-4 flex gap-4 items-start hover:border-dark-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-red-400 font-mono">{(signal.score * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1">{signal.name}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{signal.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-dark-900/30 border border-dashed border-dark-700 rounded-xl p-6 text-center text-slate-500 text-xs">
                No active threat patterns or heuristic matches detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
