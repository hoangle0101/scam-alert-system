import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-300 font-sans selection:bg-brand-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[128px] pointer-events-none"></div>
        
        <Header />
        <main className="flex-1 p-6 z-0 overflow-auto">
          <Outlet />
        </main>
        
        <footer className="mt-12 py-8 px-6 border-t border-dark-600 bg-dark-900/50 z-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2 pr-12">
              <h3 className="text-lg font-bold text-white mb-4">Guardian AI</h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                The next-generation artificial intelligence defense system designed for the absolute security of families and organizations. Built on top of advanced machine learning platforms.
              </p>
              <div className="flex gap-4 text-slate-400">
                <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></a>
                <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></a>
                <a href="#" className="hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider">System Parameters</h4>
              <ul className="space-y-3 text-xs text-slate-400 font-mono">
                <li className="flex justify-between"><span>Core Engine</span><span className="text-slate-300">v4.8.2-stable</span></li>
                <li className="flex justify-between"><span>AI Latency</span><span className="text-slate-300">0.04 ms</span></li>
                <li className="flex justify-between"><span>Data Integrity</span><span className="text-slate-300">Checksum Valid</span></li>
                <li className="flex justify-between"><span>Region</span><span className="text-slate-300">VN-SOUTH-1</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider">Legal & Technical</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-dark-600/50 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest gap-4">
            <p>© 2026 GUARDIAN AI OPERATIONS CLUSTER. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              256-BIT ENCRYPTION ACTIVE
            </div>
          </div>
        </footer>
        
        {/* Floating Shield Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-brand-600 rounded-lg shadow-lg shadow-brand-500/30 flex items-center justify-center text-white hover:bg-brand-500 transition-colors z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </button>
      </div>
    </div>
  );
}
