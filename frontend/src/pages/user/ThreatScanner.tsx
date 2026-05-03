import { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertTriangle, Upload, Globe, MessageSquare, Image as ImageIcon, BrainCircuit, ShieldAlert, Fingerprint, ShieldCheck } from 'lucide-react';

export function ThreatScanner() {
  const [scanType, setScanType] = useState<'url' | 'message' | 'image'>('url');
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
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
      <Card className="bg-dark-800 border-dark-600 shadow-2xl">
        <CardContent className="p-0">
          <div className="flex border-b border-dark-600 overflow-x-auto scrollbar-hide">
             <button 
               onClick={() => setScanType('url')}
               className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                 scanType === 'url' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <Globe size={18} /> URL / LINK
             </button>
             <button 
               onClick={() => setScanType('message')}
               className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                 scanType === 'message' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-500/5' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               <MessageSquare size={18} /> SMS / MESSAGE
             </button>
             <button 
               onClick={() => setScanType('image')}
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
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Suspect Link</label>
                    <div className="flex flex-col md:flex-row gap-4">
                       <input 
                         type="text" 
                         placeholder="e.g. https://vietcombank-verify.online/login" 
                         className="flex-1 bg-dark-900 border border-dark-600 rounded-xl px-4 py-4 text-slate-200 outline-none focus:border-brand-500 transition-colors"
                       />
                       <Button onClick={startScan} disabled={isScanning} className="bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20">
                         {isScanning ? 'ANALYZING...' : 'RUN SCAN'}
                       </Button>
                    </div>
                 </div>
               )}

               {scanType === 'message' && (
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                    <textarea 
                      placeholder="Paste the SMS or Social Media message here..." 
                      className="w-full h-32 bg-dark-900 border border-dark-600 rounded-xl px-4 py-4 text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                    <Button onClick={startScan} disabled={isScanning} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold shadow-lg">
                      {isScanning ? 'SCANNING CONTENT...' : 'ANALYZE INTENT'}
                    </Button>
                 </div>
               )}

               {scanType === 'image' && (
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Upload Screenshot</label>
                    <div className="border-2 border-dashed border-dark-600 rounded-2xl p-12 text-center hover:border-brand-500 transition-colors cursor-pointer group">
                       <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/10 transition-colors">
                          <Upload size={32} className="text-slate-500 group-hover:text-brand-500" />
                       </div>
                       <h4 className="text-white font-bold mb-1">Drag & Drop or Click to Upload</h4>
                       <p className="text-xs text-slate-500">Supports PNG, JPG (Max 5MB)</p>
                    </div>
                    <Button onClick={startScan} disabled={isScanning} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold">
                      {isScanning ? 'PROCESSING IMAGE...' : 'VISUAL SCAN'}
                    </Button>
                 </div>
               )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Pipeline Display (Only if scanning or showing results) */}
      {isScanning && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-dark-800 border border-dark-600 p-6 rounded-2xl animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                 <Globe size={18} className="text-brand-500" />
                 <span className="text-sm font-bold text-white">DNS & Reputation</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 w-1/3 animate-ping"></div>
              </div>
           </div>
           <div className="bg-dark-800 border border-dark-600 p-6 rounded-2xl opacity-50">
              <div className="flex items-center gap-3 mb-4">
                 <BrainCircuit size={18} className="text-purple-500" />
                 <span className="text-sm font-bold text-white">NLP Intent Engine</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full"></div>
           </div>
           <div className="bg-dark-800 border border-dark-600 p-6 rounded-2xl opacity-50">
              <div className="flex items-center gap-3 mb-4">
                 <Fingerprint size={18} className="text-cyan-500" />
                 <span className="text-sm font-bold text-white">Pattern Matching</span>
              </div>
              <div className="h-2 w-full bg-dark-700 rounded-full"></div>
           </div>
        </div>
      )}

      {/* Trust & Transparency Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
         <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <ShieldCheck size={24} className="text-brand-500" /> How Our AI Protects You
            </h3>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center shrink-0">
                     <BrainCircuit className="text-brand-500" size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-200">Neural Network Analysis</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">Our PhoBERT-based models are specifically trained on Vietnamese scam dialects to detect subtle manipulation tactics.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center shrink-0">
                     <ShieldAlert className="text-brand-500" size={20} />
                  </div>
                  <div>
                     <h4 className="text-sm font-bold text-slate-200">Real-time Blocklists</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">We sync with global threat intelligence feeds and the ScamVN community to block new threats within minutes.</p>
                  </div>
               </div>
            </div>
         </div>

         <Card className="bg-gradient-to-br from-dark-800 to-dark-700 border-dark-600">
            <CardContent className="p-8">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                     <AlertTriangle className="text-yellow-500" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Scan Disclaimer</h3>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">
                 While our AI is 99% accurate, new scam tactics emerge daily. Always exercise caution when clicking links from unknown sources, even if they pass our initial scan. When in doubt, report it to the community.
               </p>
               <Button variant="secondary" className="w-full border-dark-600 text-slate-300">View Scan History</Button>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}
