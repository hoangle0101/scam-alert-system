import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Shield, AlertTriangle, FileText, Globe, CheckCircle, ArrowRight, Link as LinkIcon, ShieldAlert, ShieldCheck, ChevronRight, Activity, Clock, BrainCircuit, X } from 'lucide-react';
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

export function ReportHub() {
  const [activeTab, setActiveTab] = useState<'report' | 'appeal' | 'history'>('report');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
  
  // States cho Report Scam
  const [reportStep, setReportStep] = useState(1);
  const [reportTarget, setReportTarget] = useState('');
  const [reportCategory, setReportCategory] = useState('phishing');
  const [reportDesc, setReportDesc] = useState('');
  const [reportEvidence, setReportEvidence] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // States cho Appeal
  const [appealTarget, setAppealTarget] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [appealEvidence, setAppealEvidence] = useState('');
  const [appealSubmitting, setAppealSubmitting] = useState(false);
  const [appealSuccess, setAppealSuccess] = useState(false);

  // States cho History
  const [myHistory, setMyHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.reports.getMyReports();
      setMyHistory(data);
    } catch (e) {
      console.error(e);
      setToast({ message: 'Failed to load history.', type: 'error' });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSubmitReport = async () => {
    setReportSubmitting(true);
    try {
      await api.reports.submitScamReport({
        target_type: 'url',
        target_value: reportTarget,
        scam_category: reportCategory,
        description: reportDesc,
        evidence_url: reportEvidence
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportStep(1);
        setReportTarget('');
        setReportDesc('');
        setReportEvidence('');
        setReportSuccess(false);
        setActiveTab('history');
      }, 2500);
    } catch (e: any) {
      console.error(e);
      setToast({ message: e.message || 'Failed to submit report.', type: 'error' });
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleSubmitAppeal = async () => {
    setAppealSubmitting(true);
    try {
      await api.reports.submitAppeal({
        target_url: appealTarget,
        reason: appealReason,
        evidence_url: appealEvidence
      });
      setAppealSuccess(true);
      setTimeout(() => {
        setAppealTarget('');
        setAppealReason('');
        setAppealEvidence('');
        setAppealSuccess(false);
        setActiveTab('history');
      }, 2500);
    } catch (e: any) {
      console.error(e);
      setToast({ message: e.message || 'Failed to submit appeal.', type: 'error' });
    } finally {
      setAppealSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1200px] mx-auto relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- HERO SECTION --- */}
      <section className="relative p-10 lg:p-14 rounded-3xl bg-dark-800 overflow-hidden shadow-2xl border border-dark-600 group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-500/20 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="absolute top-8 right-8 p-4 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <ShieldAlert size={200} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-lg shadow-brand-500/5">
            <Activity size={12} className="animate-pulse" /> Community Protection Grid
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Threat Report <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Hub</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Help us make the internet safer. Report malicious links or appeal false positive detections. Your reports directly strengthen our global AI defense models.
          </p>
        </div>
      </section>

      {/* --- TABS --- */}
      <div className="flex border-b border-dark-600 bg-dark-900/40 p-1.5 rounded-2xl w-fit shadow-2xl backdrop-blur-md border border-white/5">
        <button 
          onClick={() => setActiveTab('report')}
          className={`px-10 py-4 text-sm font-bold uppercase tracking-wide flex items-center gap-3 rounded-xl transition-all duration-500 group ${activeTab === 'report' ? 'text-white bg-brand-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-brand-400/50' : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800'}`}
        >
          <AlertTriangle size={18} className={`${activeTab === 'report' ? 'text-white animate-pulse' : 'text-slate-600 group-hover:text-brand-500'}`} /> Report Scam
        </button>
        <button 
          onClick={() => setActiveTab('appeal')}
          className={`px-10 py-4 text-sm font-bold uppercase tracking-wide flex items-center gap-3 rounded-xl transition-all duration-500 group ${activeTab === 'appeal' ? 'text-white bg-yellow-600 shadow-[0_0_20px_rgba(202,138,4,0.3)] border border-yellow-400/50' : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800'}`}
        >
          <ShieldCheck size={18} className={`${activeTab === 'appeal' ? 'text-white' : 'text-slate-600 group-hover:text-yellow-500'}`} /> False Positive
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-10 py-4 text-sm font-bold uppercase tracking-wide flex items-center gap-3 rounded-xl transition-all duration-500 group ${activeTab === 'history' ? 'text-white bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)] border border-purple-400/50' : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800'}`}
        >
          <FileText size={18} className={`${activeTab === 'history' ? 'text-white' : 'text-slate-600 group-hover:text-purple-500'}`} /> Transmission History
        </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="mt-8">
        
        {/* REPORT SCAM TAB */}
        {activeTab === 'report' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-dark-800 border-dark-600 shadow-2xl shadow-brand-500/5">
                <CardContent className="p-10">
                  {reportSuccess ? (
                    <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/30 shadow-lg shadow-green-500/20">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-extrabold text-white mb-4">Threat Neutralized</h3>
                      <p className="text-slate-400 max-w-md mx-auto leading-relaxed">Thank you for helping protect the community. Your report has been securely transmitted to our AI grid for analysis.</p>
                    </div>
                  ) : (
                    <>
                      {/* Form Steps Progress */}
                      <div className="mb-12 relative">
                         <div className="absolute left-0 right-0 h-1 bg-dark-700 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>
                         <div className="absolute left-0 h-1 bg-brand-500 top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${(reportStep - 1) * 50}%` }}></div>
                         <div className="relative z-10 flex justify-between w-full">
                            {[1, 2, 3].map((step) => (
                              <div key={step} className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                                  reportStep === step ? 'bg-brand-500 border-brand-400 text-white shadow-lg shadow-brand-500/40 scale-110' : 
                                  reportStep > step ? 'bg-brand-500 border-brand-500 text-white' : 'bg-dark-800 border-dark-600 text-slate-500'
                                }`}>
                                  {reportStep > step ? <CheckCircle size={18} /> : step}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${reportStep >= step ? 'text-brand-400' : 'text-slate-600'}`}>
                                  {step === 1 ? 'Target URL' : step === 2 ? 'Analysis' : 'Evidence'}
                                </span>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Step 1: Target & Classification */}
                      {reportStep === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3">Suspicious URL Target</label>
                            <div className="relative group">
                              <Globe size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                              <input 
                                type="text" 
                                value={reportTarget}
                                onChange={(e) => setReportTarget(e.target.value)}
                                placeholder="e.g., https://secure-login-verify.com/bank"
                                className="w-full bg-dark-900/80 border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3">Threat Classification</label>
                            <div className="relative">
                              <select 
                                value={reportCategory}
                                onChange={(e) => setReportCategory(e.target.value)}
                                className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-5 py-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none cursor-pointer text-sm"
                              >
                                <option value="phishing">Phishing / Credential Theft</option>
                                <option value="impersonation">Brand/Person Impersonation</option>
                                <option value="malware">Malware / Virus Distribution</option>
                                <option value="fraud">Financial Fraud / Fake Store</option>
                                <option value="other">Other Suspicious Activity</option>
                              </select>
                              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronRight size={16} className="text-slate-500 rotate-90" />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end pt-8">
                            <Button onClick={() => setReportStep(2)} disabled={!reportTarget} variant="primary" className="px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform">
                              Analyze Details <ArrowRight size={18} className="ml-2 inline" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Details */}
                      {reportStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3">Context & Scenarion Description</label>
                            <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 mb-4">
                              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider mb-1">Analysis for:</p>
                              <p className="text-xs text-slate-200 font-mono truncate">{reportTarget}</p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-3">Context & Description <span className="text-slate-500 font-normal text-xs ml-2">(Optional)</span></label>
                            <textarea 
                              value={reportDesc}
                              onChange={(e) => setReportDesc(e.target.value)}
                              placeholder="How did you encounter this threat? What does it try to accomplish? The more context, the better our AI learns."
                              rows={5}
                              className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-5 py-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none custom-scrollbar"
                            ></textarea>
                          </div>
                          <div className="flex justify-between pt-8 border-t border-dark-700">
                            <Button onClick={() => setReportStep(1)} variant="outline" className="px-8 py-3 rounded-xl font-bold border-dark-600 hover:bg-dark-800 text-slate-300">
                              Back
                            </Button>
                            <Button onClick={() => setReportStep(3)} disabled={!reportTarget} variant="primary" className="px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform">
                              Add Evidence <ArrowRight size={18} className="ml-2 inline" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Evidence */}
                      {reportStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                          <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Evidence URL <span className="text-slate-500 font-normal text-xs ml-2">(Optional)</span></label>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Provide a link to a screenshot (e.g., Imgur, Google Drive) showing the scam in action. Please <strong className="text-red-400">do not upload</strong> sensitive personal or financial data.</p>
                            <div className="relative group">
                              <LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                              <input 
                                type="url" 
                                value={reportEvidence}
                                onChange={(e) => setReportEvidence(e.target.value)}
                                placeholder="https://imgur.com/a/..."
                                className="w-full bg-dark-900/80 border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-brand-500/10 border border-brand-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-inner">
                             <Shield size={24} className="text-brand-500 shrink-0 mt-0.5" />
                             <p className="text-sm text-brand-200/80 leading-relaxed font-medium">
                               By transmitting this report, you confirm that the information provided is accurate to the best of your knowledge. Intentional false reports degrade the AI model and may lead to account restrictions.
                             </p>
                          </div>

                          <div className="flex justify-between pt-8 border-t border-dark-700">
                            <Button onClick={() => setReportStep(2)} variant="outline" className="px-8 py-3 rounded-xl font-bold border-dark-600 hover:bg-dark-800 text-slate-300">
                              Back
                            </Button>
                            <Button onClick={handleSubmitReport} disabled={reportSubmitting} variant="primary" className="px-10 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:scale-[1.02] transition-transform">
                               {reportSubmitting ? (
                                 <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Transmitting...</span>
                               ) : 'Transmit Report'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar info */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-dark-800 via-dark-800 to-brand-900/10 border-dark-600 shadow-2xl overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all duration-700"></div>
                 <CardContent className="p-8 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/30">
                        <ShieldAlert className="text-brand-500" size={20} />
                      </div>
                      Reporting Intelligence
                    </h3>
                    <ul className="space-y-5 text-sm text-slate-400">
                       <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 text-brand-500">
                           <BrainCircuit size={16} />
                         </div>
                         <span className="leading-relaxed mt-1">Your reports directly train our AI models to recognize emerging threats.</span>
                       </li>
                       <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 text-brand-500">
                           <Globe size={16} />
                         </div>
                         <span className="leading-relaxed mt-1">Verified malicious nodes are shared with browser vendors globally.</span>
                       </li>
                       <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 text-brand-500">
                           <Activity size={16} />
                         </div>
                         <span className="leading-relaxed mt-1">You earn Reputation Score in the community for valid intel.</span>
                       </li>
                    </ul>
                 </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* FALSE POSITIVE APPEAL TAB */}
        {activeTab === 'appeal' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
             <Card className="bg-dark-800 border-dark-600 shadow-2xl">
                <CardContent className="p-10">
                  {appealSuccess ? (
                    <div className="text-center py-20 animate-in zoom-in-95 duration-500">
                      <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/30 shadow-lg shadow-green-500/20">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-extrabold text-white mb-4">Appeal Lodged Successfully</h3>
                      <p className="text-slate-400 max-w-md mx-auto leading-relaxed">Our security analysts will manually review your appeal. If a false positive is confirmed, the AI model weights will be adjusted accordingly.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-start gap-4 shadow-inner">
                          <AlertTriangle size={28} className="text-yellow-500 shrink-0 mt-1" />
                          <div>
                            <h4 className="text-white font-bold mb-2 text-lg">Did our AI make a mistake?</h4>
                            <p className="text-sm text-yellow-200/80 leading-relaxed font-medium">
                              Use this secure channel if a legitimate website or communication was incorrectly flagged. Clear reasoning expedites the review process.
                            </p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="md:col-span-2">
                           <label className="block text-sm font-bold text-slate-300 mb-3">Blocked Target / URL</label>
                           <input 
                             type="text" 
                             value={appealTarget}
                             onChange={(e) => setAppealTarget(e.target.value)}
                             placeholder="e.g., https://my-legit-business.com"
                             className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-5 py-4 text-slate-200 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                           />
                         </div>

                         <div className="md:col-span-2">
                           <label className="block text-sm font-bold text-slate-300 mb-3">Justification for Appeal</label>
                           <textarea 
                             value={appealReason}
                             onChange={(e) => setAppealReason(e.target.value)}
                             placeholder="Provide context. Are you the owner? Why is the content safe?"
                             rows={6}
                             className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-5 py-4 text-slate-200 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none custom-scrollbar"
                           ></textarea>
                         </div>

                         <div className="md:col-span-2">
                           <label className="block text-sm font-bold text-slate-300 mb-3">Evidence / Proof of Ownership <span className="text-slate-500 font-normal text-xs ml-2">(Optional)</span></label>
                           <div className="relative group">
                             <LinkIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                             <input 
                               type="url" 
                               value={appealEvidence}
                               onChange={(e) => setAppealEvidence(e.target.value)}
                               placeholder="Link to WHOIS, LinkedIn profile, or official registry"
                               className="w-full bg-dark-900/80 border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-slate-200 outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                             />
                           </div>
                         </div>
                       </div>

                       <div className="pt-8 border-t border-dark-700 flex justify-end">
                         <Button onClick={handleSubmitAppeal} disabled={appealSubmitting || !appealTarget || !appealReason} className="bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:scale-[1.02] transition-transform">
                            {appealSubmitting ? (
                              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Lodging Appeal...</span>
                            ) : 'Lodge Appeal'}
                         </Button>
                       </div>
                    </div>
                  )}
                </CardContent>
             </Card>
          </div>
        )}

        {/* MY HISTORY TAB */}
        {activeTab === 'history' && (
          <Card className="bg-dark-800 border-dark-600 shadow-2xl animate-in fade-in duration-500 overflow-hidden">
             <CardContent className="p-0">
                <div className="p-8 border-b border-dark-700 bg-dark-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Clock size={24} className="text-brand-500" /> Transmission History
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Review the status of your submitted reports and appeals.</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-dark-800 text-slate-500 text-[10px] uppercase tracking-widest border-b border-dark-700 font-mono">
                        <th className="p-6 font-semibold whitespace-nowrap">ID</th>
                        <th className="p-6 font-semibold whitespace-nowrap">Classification</th>
                        <th className="p-6 font-semibold">Target Node</th>
                        <th className="p-6 font-semibold whitespace-nowrap">State</th>
                        <th className="p-6 font-semibold text-right whitespace-nowrap">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50 bg-dark-900/20">
                      {historyLoading ? (
                        <tr><td colSpan={5} className="p-16 text-center text-slate-500"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>Fetching history logs...</td></tr>
                      ) : myHistory.length > 0 ? (
                        myHistory.map((item: any, i) => (
                          <tr key={i} className="hover:bg-dark-700/40 transition-colors group">
                            <td className="p-6 text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors">{item.id}</td>
                            <td className="p-6">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold shadow-sm ${item.type === 'Scam Report' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {item.type === 'Scam Report' ? <ShieldAlert size={14} className="mr-2" /> : <ShieldCheck size={14} className="mr-2" />}
                                {item.type}
                              </span>
                            </td>
                            <td className="p-6 text-sm font-medium text-slate-200 truncate max-w-[300px]" title={item.target}>
                              {item.target}
                            </td>
                            <td className="p-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                item.status === 'pending' ? 'bg-slate-500/10 text-slate-400 border-slate-500/30' :
                                item.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                item.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                              }`}>
                                {item.status === 'pending' && <Clock size={10} />}
                                {item.status === 'approved' && <CheckCircle size={10} />}
                                {item.status === 'rejected' && <X size={10} />}
                                {item.status}
                              </span>
                            </td>
                            <td className="p-6 text-right text-xs text-slate-500 font-mono">
                              {new Date(item.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-20 text-center text-slate-500 bg-dark-900/30">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-bold text-slate-400 mb-1">No Transmission History</p>
                            <p className="text-sm">You haven't submitted any reports or appeals yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
             </CardContent>
          </Card>
        )}
        
      </div>
    </div>
  );
}
