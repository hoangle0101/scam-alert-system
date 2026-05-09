import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Shield, Mail, Lock, User, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export function Register() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.auth.register({
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for luxury feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>

      <Card className="w-full max-w-lg bg-dark-900/80 backdrop-blur-xl border-dark-700 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/30 rotate-3">
              <Shield className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Join the Guardian Grid</h1>
            <p className="text-slate-400 text-sm mt-3">Protect yourself and the community from digital threats</p>
          </div>

          {success ? (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500/30">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Created!</h3>
              <p className="text-slate-400">Welcome on board. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-3 mb-8 animate-in slide-in-from-top-2">
                  <AlertTriangle size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="John Doe" 
                        className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" 
                        className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className="w-full bg-dark-800/50 border border-dark-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-brand-500 outline-none transition-all group-focus-within:bg-dark-800"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand-500/20 mt-6 group overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'INITIALIZING ACCOUNT...' : 'CREATE ACCOUNT'}
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>
              </form>

              <div className="mt-10 pt-6 border-t border-dark-800/50 text-center">
                <p className="text-sm text-slate-500">
                  Already part of the grid? <Link to="/login" className="text-brand-400 font-bold hover:text-brand-300 transition-colors underline underline-offset-4 decoration-brand-500/30">Sign in here</Link>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
