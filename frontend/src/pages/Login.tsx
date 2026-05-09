import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Shield, Mail, Lock, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log("[LOGIN] Attempting login for:", email);
      const data = await api.auth.login({ email, password });
      console.log("[LOGIN] Success! Received token:", !!data.access_token);
      
      localStorage.setItem('sg_token', data.access_token);
      
      console.log("[LOGIN] Fetching user profile...");
      const user = await api.auth.getMe(); 
      console.log("[LOGIN] Profile loaded:", user.full_name, "Role:", user.role);
      
      login(data.access_token, user);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      console.error("[LOGIN] Error:", err);
      setError(err.message || 'Login failed. Please check your credentials.');
      localStorage.removeItem('sg_token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <Card className="w-full max-w-md bg-dark-900/90 backdrop-blur-xl border-dark-700 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/30">
              <Shield className="text-white" size={36} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Activity size={12} className="animate-pulse" /> Secure Access Node
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Scam Guardian</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Authentication required to access the grid</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3 mb-8 animate-in shake duration-300">
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@scamguardian.vn" 
                  className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secret Key</label>
                <button type="button" className="text-[10px] font-bold text-brand-500 hover:text-brand-400 uppercase tracking-widest transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800 shadow-inner"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-brand-500/20 mt-8 group">
              <span className="flex items-center justify-center gap-2">
                {loading ? 'VALIDATING...' : 'ACCESS PORTAL'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-dark-800/50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New identity? <Link to="/register" className="text-brand-400 font-bold hover:text-brand-300 transition-colors underline underline-offset-4 decoration-brand-500/30">Request authorization</Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] pointer-events-none">
        Protocol v1.0.4 // Zero Trust Architecture
      </div>
    </div>
  );
}
