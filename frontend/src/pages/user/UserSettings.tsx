import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, Bell, Shield, Users, Lock, ChevronRight, Edit2, ShieldCheck, Mail, Phone, CheckCircle, XCircle, AlertTriangle, Activity, UserPlus, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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

export function UserSettings() {
  const { token, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'family'>('profile');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
  
  // Profile State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ full_name: '', phone: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Family State
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [isAddingFamily, setIsAddingFamily] = useState(false);
  const [newFamilyEmail, setNewFamilyEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState({
    push: true,
    email: true
  });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, familyRes] = await Promise.all([
        api.users.getMe(),
        api.users.getFamilyMembers().catch(() => []) // Handle case if not implemented
      ]);
      setUserProfile(profileRes);
      setEditProfileForm({ full_name: profileRes.full_name || '', phone: profileRes.phone || '' });
      setFamilyMembers(familyRes || []);
      setNotifications({
        push: profileRes.notify_push !== false,
        email: profileRes.notify_email !== false
      });
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Failed to load user data', type: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    if (!editProfileForm.full_name) {
      setToast({ message: 'Full name is required', type: 'warning' });
      return;
    }
    setIsSavingProfile(true);
    try {
      const updated = await api.users.updateProfile(editProfileForm);
      setUserProfile(updated);
      if (token) {
        login(token, {
          id: updated.id,
          email: updated.email,
          full_name: updated.full_name,
          role: updated.role
        });
      }
      setIsEditingProfile(false);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddFamily = async () => {
    if (!newFamilyEmail || !newFamilyEmail.includes('@')) {
      setToast({ message: 'Please enter a valid email address', type: 'warning' });
      return;
    }
    setIsAddingMember(true);
    try {
      const member = await api.users.addFamilyMember(newFamilyEmail);
      setFamilyMembers([...familyMembers, member]);
      setNewFamilyEmail('');
      setIsAddingFamily(false);
      setToast({ message: 'Family member added successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to add family member', type: 'error' });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveFamily = async (linkId: number) => {
    if (!window.confirm("Are you sure you want to remove this family member's protection?")) return;
    try {
      await api.users.removeFamilyMember(linkId);
      setFamilyMembers(familyMembers.filter(m => m.id !== linkId));
      setToast({ message: 'Family member removed', type: 'info' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to remove member', type: 'error' });
    }
  };

  const handleToggleNotification = async (channel: 'push' | 'email') => {
    const newValue = !notifications[channel];
    // Optimistic update
    setNotifications(prev => ({ ...prev, [channel]: newValue }));
    try {
      await api.users.updateProfile({
        [channel === 'push' ? 'notify_push' : 'notify_email']: newValue
      });
      setToast({ message: `${channel === 'push' ? 'Push Notifications' : 'Email Alerts'} updated!`, type: 'success' });
    } catch (err: any) {
      // Rollback
      setNotifications(prev => ({ ...prev, [channel]: !newValue }));
      setToast({ message: err.message || 'Failed to update preferences', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      setToast({ message: 'All fields are required', type: 'warning' });
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setToast({ message: 'New password must be at least 6 characters long', type: 'warning' });
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setToast({ message: 'Passwords do not match', type: 'warning' });
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await api.users.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setToast({ message: 'Password changed successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to change password', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile Information' },
    { id: 'security', icon: Lock, label: 'Security & Password' },
    { id: 'notifications', icon: Bell, label: 'Notification Settings' },
    { id: 'family', icon: Users, label: 'Family Management' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-slate-500"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">USER SETTINGS</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Personal Preferences</h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
          Manage your account security, family shield members, and how you want to be notified about threats.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation Cards */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
              {tabs.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between p-4 text-sm font-semibold transition-all border-b border-dark-600 last:border-0 ${
                    activeTab === item.id ? 'bg-brand-600/10 text-brand-500' : 'text-slate-400 hover:bg-dark-700/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-30'} />
                </button>
              ))}
           </div>

           <Card className="bg-gradient-to-br from-brand-600/20 to-transparent border-brand-500/20">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-brand-500" size={24} />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Protection</h4>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed mb-4">
                   Your Family Shield covers up to 5 members. You are currently using {familyMembers.length} slots.
                 </p>
                 <div className="w-full h-2 bg-dark-900 rounded-full mb-4 overflow-hidden border border-dark-700">
                    <div className="h-full bg-brand-500" style={{ width: `${(familyMembers.length / 5) * 100}%` }}></div>
                 </div>
                 <Button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-3 rounded-xl transition-transform hover:scale-[1.02]">
                    UPGRADE PLAN
                 </Button>
              </CardContent>
           </Card>
        </div>

        {/* Right Column - Active Panel */}
        <div className="lg:col-span-2 space-y-8 min-h-[500px]">
           
           {/* Profile Tab */}
           {activeTab === 'profile' && (
             <Card className="bg-dark-800 border-dark-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-8 border-b border-dark-700 pb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                           <User size={20} className="text-brand-500" /> Account Information
                        </h3>
                        <p className="text-xs text-slate-400">Update your personal details and contact information.</p>
                      </div>
                      {!isEditingProfile ? (
                        <Button onClick={() => setIsEditingProfile(true)} variant="secondary" size="sm" className="flex items-center gap-2 rounded-lg text-xs font-bold px-4 py-2 border border-dark-600 hover:border-brand-500/50">
                           <Edit2 size={12} /> EDIT PROFILE
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                           <Button onClick={() => {setIsEditingProfile(false); setEditProfileForm({full_name: userProfile?.full_name||'', phone: userProfile?.phone||''})}} variant="outline" size="sm" className="border-dark-600 text-slate-400">Cancel</Button>
                           <Button onClick={handleSaveProfile} disabled={isSavingProfile} size="sm" className="bg-brand-600 text-white font-bold">
                             {isSavingProfile ? 'Saving...' : 'Save Changes'}
                           </Button>
                        </div>
                      )}
                   </div>

                   {userProfile ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                              {isEditingProfile ? (
                                <input 
                                  value={editProfileForm.full_name} 
                                  onChange={e => setEditProfileForm({...editProfileForm, full_name: e.target.value})}
                                  className="w-full bg-dark-950 border border-brand-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-500"
                                />
                              ) : (
                                <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-slate-200 text-sm">
                                   {userProfile.full_name || 'N/A'}
                                </div>
                              )}
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                              <div className="bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-slate-400 text-sm flex items-center gap-3 cursor-not-allowed">
                                 <Mail size={14} className="text-slate-500" /> {userProfile.email}
                              </div>
                              <p className="text-[10px] text-slate-500 ml-1">Email cannot be changed.</p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                              {isEditingProfile ? (
                                <input 
                                  value={editProfileForm.phone} 
                                  onChange={e => setEditProfileForm({...editProfileForm, phone: e.target.value})}
                                  placeholder="+84 9xx xxx xxx"
                                  className="w-full bg-dark-950 border border-brand-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-brand-500"
                                />
                              ) : (
                                <div className="bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-slate-200 text-sm flex items-center gap-3">
                                   <Phone size={14} className="text-slate-500" /> {userProfile.phone || 'Not set'}
                                </div>
                              )}
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Protection Level</label>
                              <div className="bg-dark-900 border border-brand-500/20 rounded-xl px-4 py-3 text-brand-500 font-bold text-sm flex items-center gap-3">
                                 <Shield size={14} /> Maximum Security Active
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="py-10 text-center text-slate-500">Loading profile...</div>
                   )}
                </CardContent>
             </Card>
           )}

           {/* Family Tab */}
           {activeTab === 'family' && (
             <Card className="bg-dark-800 border-dark-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-8 border-b border-dark-700 pb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                           <Users size={20} className="text-brand-500" /> Family Management
                        </h3>
                        <p className="text-xs text-slate-400">Protect the devices of your loved ones under one unified shield.</p>
                      </div>
                      <Button onClick={() => setIsAddingFamily(!isAddingFamily)} variant="secondary" size="sm" className="flex items-center gap-2 rounded-lg text-xs font-bold px-4 py-2 border border-brand-500/30 text-brand-400 hover:bg-brand-500/10">
                         {isAddingFamily ? <X size={14} /> : <UserPlus size={14} />} {isAddingFamily ? 'CANCEL' : 'ADD MEMBER'}
                      </Button>
                   </div>

                   {isAddingFamily && (
                     <div className="mb-8 p-6 bg-dark-900 border border-brand-500/30 rounded-xl animate-in zoom-in-95 duration-200">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                          <ShieldCheck size={16} className="text-brand-500" /> Invite to Family Shield
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <input 
                             type="email"
                             value={newFamilyEmail}
                             onChange={e => setNewFamilyEmail(e.target.value)}
                             placeholder="Enter their registered email address..."
                             className="flex-1 bg-dark-950 border border-dark-600 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-500 outline-none"
                           />
                           <Button onClick={handleAddFamily} disabled={isAddingMember || !newFamilyEmail} className="bg-brand-600 text-white font-bold whitespace-nowrap">
                             {isAddingMember ? 'Inviting...' : 'Send Shield Invite'}
                           </Button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3">
                          * The user must already have a Scam Guardian account to be linked. They will be added to your protection umbrella immediately.
                        </p>
                     </div>
                   )}

                   <div className="space-y-4">
                      {familyMembers.length > 0 ? (
                        familyMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-900/50 border border-dark-700 hover:border-dark-500 transition-colors group">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-dark-700 text-slate-300 flex items-center justify-center font-bold text-lg border border-dark-600 shadow-inner">
                                  {member.protected_name.substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                   <div className="text-base font-bold text-white group-hover:text-brand-400 transition-colors">{member.protected_name}</div>
                                   <div className="text-xs text-slate-500 flex items-center gap-2">
                                     <Mail size={10} /> {member.protected_email}
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 uppercase tracking-widest">
                                   <CheckCircle size={10} /> Active Shield
                                </span>
                                <button 
                                  onClick={() => handleRemoveFamily(member.id)}
                                  className="text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Remove Protection"
                                >
                                  <Trash2 size={16} />
                                </button>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 border border-dashed border-dark-600 rounded-xl bg-dark-900/30">
                           <Users size={32} className="mx-auto text-slate-600 mb-3" />
                           <p className="text-slate-400 font-bold">No family members added yet.</p>
                           <p className="text-xs text-slate-500 mt-1">Add your loved ones to protect their devices.</p>
                        </div>
                      )}
                   </div>
                </CardContent>
             </Card>
           )}

           {/* Notifications Tab */}
           {activeTab === 'notifications' && (
             <Card className="bg-dark-800 border-dark-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-8 border-b border-dark-700 pb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                           <Bell size={20} className="text-brand-500" /> Notification Channels
                        </h3>
                        <p className="text-xs text-slate-400">Control how and when you receive security alerts.</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      {[
                        { id: 'push', label: 'Push Notifications', desc: 'Get instant alerts on your device when a threat is detected.' },
                        { id: 'email', label: 'Email Alerts', desc: 'Receive weekly security summaries and critical breach reports.' },
                      ].map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between gap-8 pb-6 border-b border-dark-700 last:border-0 last:pb-0 group">
                           <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">{pref.label}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{pref.desc}</p>
                           </div>
                           <button 
                             onClick={() => {
                               setNotifications(prev => ({...prev, [pref.id]: !(prev as any)[pref.id]}));
                               setToast({ message: `${pref.label} updated!`, type: 'success' });
                             }}
                             className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 shadow-inner ${
                               (notifications as any)[pref.id] ? 'bg-brand-500' : 'bg-dark-600'
                             }`}
                           >
                              <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-transform ${
                                (notifications as any)[pref.id] ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                           </button>
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
           )}

           {/* Security Tab */}
           {activeTab === 'security' && (
             <Card className="bg-dark-800 border-dark-600 animate-in fade-in slide-in-from-right-4 duration-300">
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-8 border-b border-dark-700 pb-6">
                      <div>
                         <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-1">
                            <Lock size={20} className="text-brand-500" /> Password & Authentication
                         </h3>
                         <p className="text-xs text-slate-400">Update your password to secure your account.</p>
                      </div>
                   </div>
                   <div className="max-w-md space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                         <input 
                           type="password"
                           value={passwordForm.current_password}
                           onChange={e => setPasswordForm({...passwordForm, current_password: e.target.value})}
                           className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                           placeholder="••••••••"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                         <input 
                           type="password"
                           value={passwordForm.new_password}
                           onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})}
                           className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                           placeholder="••••••••"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                         <input 
                           type="password"
                           value={passwordForm.confirm_password}
                           onChange={e => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                           className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                           placeholder="••••••••"
                         />
                      </div>
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={isChangingPassword} 
                        className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
                      >
                         {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                      </Button>
                   </div>
                </CardContent>
             </Card>
           )}

        </div>
      </div>
    </div>
  );
}
