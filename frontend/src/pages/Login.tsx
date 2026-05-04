import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Shield, Mail, Lock, AlertTriangle } from 'lucide-react';
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
      const data = await api.auth.login({ email, password });
      
      // Quan trọng: Lưu token vào storage TRƯỚC KHI gọi getMe
      localStorage.setItem('sg_token', data.access_token);
      
      const user = await api.auth.getMe(); 
      login(data.access_token, user);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-dark-900 border-dark-700 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Scam Guardian</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to your secure portal</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3 mb-6">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@scamguardian.vn" 
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 mt-6">
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-800 text-center">
            <p className="text-xs text-slate-500">
              New to Scam Guardian? <span className="text-brand-500 font-bold cursor-pointer">Create an account</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
