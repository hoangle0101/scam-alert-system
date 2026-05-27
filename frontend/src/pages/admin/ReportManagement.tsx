import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Eye, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../services/api';

export function ReportManagement() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (selectedReport) {
      setEditCategory(selectedReport.category || 'phishing');
      setEditDescription(selectedReport.description || '');
    } else {
      setEditCategory('');
      setEditDescription('');
    }
  }, [selectedReport]);

  const fetchReports = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await api.admin.getReports();
      setReports(data);
    } catch (e: any) {
      console.error('Failed to fetch reports', e);
      setFetchError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (type: string, id: number, status: string) => {
    try {
      await api.admin.updateReportStatus(
        type, 
        id, 
        status, 
        type === 'scam_report' ? editCategory : undefined, 
        type === 'scam_report' ? editDescription : undefined
      );
      // Update local state
      setReports(prev => prev.map(r => 
        (r.type === type && r.id === id) ? { 
          ...r, 
          status,
          category: type === 'scam_report' ? editCategory : r.category,
          description: type === 'scam_report' ? editDescription : r.description
        } : r
      ));
      if (selectedReport && selectedReport.id === id && selectedReport.type === type) {
        setSelectedReport({ 
          ...selectedReport, 
          status,
          category: type === 'scam_report' ? editCategory : selectedReport.category,
          description: type === 'scam_report' ? editDescription : selectedReport.description
        });
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const processedReports = reports.filter(r => r.status !== 'pending');

  const displayList = activeTab === 'pending' ? pendingReports : processedReports;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-brand-500" /> Report Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review user-submitted scam reports and false positive appeals.</p>
        </div>
        <Button onClick={fetchReports} variant="outline" className="border-dark-600 text-slate-300">
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIST COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 border-b border-dark-600 pb-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`text-sm font-bold pb-2 transition-colors relative ${activeTab === 'pending' ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Needs Review ({pendingReports.length})
              {activeTab === 'pending' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-brand-500"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('processed')}
              className={`text-sm font-bold pb-2 transition-colors relative ${activeTab === 'processed' ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Processed ({processedReports.length})
              {activeTab === 'processed' && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-brand-500"></div>}
            </button>
          </div>

          <Card className="bg-dark-800 border-dark-600">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-900/50 text-slate-400 text-xs tracking-wider border-b border-dark-600">
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Target</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading queue...</td></tr>
                  ) : fetchError ? (
                    <tr><td colSpan={5} className="p-8 text-center text-red-500 font-bold">Error loading reports: {fetchError}</td></tr>
                  ) : displayList.length > 0 ? (
                    displayList.map((item, i) => (
                      <tr 
                        key={i} 
                        className={`hover:bg-dark-700/50 transition-colors cursor-pointer ${selectedReport?.id === item.id && selectedReport?.type === item.type ? 'bg-dark-700/80 border-l-2 border-brand-500' : ''}`}
                        onClick={() => setSelectedReport(item)}
                      >
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${item.type === 'scam_report' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {item.type === 'scam_report' ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                            {item.type === 'scam_report' ? 'Scam Report' : 'Appeal'}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-200 truncate max-w-[200px]" title={item.target}>
                          {item.target}
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                              }`}>
                                {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="outline" className="px-3 py-1 text-xs border-dark-600 hover:bg-dark-600" onClick={(e) => { e.stopPropagation(); setSelectedReport(item); }}>
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        <CheckCircle size={32} className="mx-auto mb-3 opacity-20" />
                        <p>No items in this queue. Great job!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* DETAILS COLUMN */}
        <div>
          {selectedReport ? (
            <Card className="bg-dark-800 border-dark-600 sticky top-24 animate-in slide-in-from-right-8">
              <div className={`h-1.5 w-full ${selectedReport.type === 'scam_report' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {selectedReport.type === 'scam_report' ? 'Review Scam Report' : 'Review Appeal'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">ID: {selectedReport.type.toUpperCase()}-{selectedReport.id}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                selectedReport.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                selectedReport.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                selectedReport.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                              }`}>
                    {selectedReport.status}
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Target URL/Content</label>
                    <div className="bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-slate-200 break-all font-mono">
                      {selectedReport.target}
                    </div>
                  </div>

                  {selectedReport.type === 'scam_report' ? (
                    <>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Threat Classification</label>
                        <select 
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full bg-dark-900 border border-dark-700 rounded-lg p-2.5 text-sm text-slate-200 outline-none focus:border-brand-500 transition-all cursor-pointer"
                        >
                          <option value="phishing">Phishing / Credential Theft</option>
                          <option value="impersonation">Brand/Person Impersonation</option>
                          <option value="malware">Malware / Virus Distribution</option>
                          <option value="fraud">Financial Fraud / Fake Store</option>
                          <option value="other">Other Suspicious Activity</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Description</label>
                        <textarea 
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          className="w-full bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-brand-500 transition-all resize-none custom-scrollbar"
                          placeholder="Add detail description for this scam..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Category</label>
                        <div className="text-sm text-slate-300">{selectedReport.category}</div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Description / Reason</label>
                        <div className="bg-dark-900 border border-dark-700 rounded-lg p-3 text-sm text-slate-300 min-h-[80px]">
                          {selectedReport.description || <span className="text-slate-600 italic">No description provided.</span>}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedReport.evidence_url && (
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Evidence Link</label>
                      <a href={selectedReport.evidence_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 hover:underline bg-brand-500/10 p-2 rounded border border-brand-500/20">
                        <ExternalLink size={14} /> Open Evidence
                      </a>
                    </div>
                  )}

                  <div className="pt-6 border-t border-dark-700 space-y-3">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Admin Actions</label>
                    
                    {selectedReport.status === 'pending' ? (
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleUpdateStatus(selectedReport.type, selectedReport.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold"
                        >
                          <CheckCircle size={16} className="mr-2" /> Approve
                        </Button>
                        <Button 
                          onClick={() => handleUpdateStatus(selectedReport.type, selectedReport.id, 'rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold"
                        >
                          <XCircle size={16} className="mr-2" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-dark-900 p-3 rounded text-center text-sm text-slate-400 border border-dark-700">
                        This item has already been processed.
                        <Button 
                          variant="outline" 
                          className="w-full mt-3 border-dark-600 text-xs"
                          onClick={() => handleUpdateStatus(selectedReport.type, selectedReport.id, 'pending')}
                        >
                          Revert to Pending
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-dark-600 rounded-2xl flex flex-col items-center justify-center text-slate-500 bg-dark-800/30">
              <Eye size={48} className="mb-4 opacity-20" />
              <p>Select an item from the queue<br/>to review details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
