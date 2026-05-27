import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { MessageSquare, ChevronUp, ChevronDown, ShieldCheck, ShieldAlert, Send, Plus, X, Activity } from 'lucide-react';
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

export function CommunityFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);
  
  // Comments state per post: { [postId]: { comments: any[], loading: boolean, open: boolean } }
  const [commentsState, setCommentsState] = useState<Record<number, any>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  // New Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', scam_type: 'PHISHING', evidence_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.community.getPosts(1);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load community posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (postId: number, voteType: 'up' | 'down') => {
    try {
      const result = await api.community.votePost(postId, voteType);
      
      // Optimistic Update
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, upvotes: result.upvotes, downvotes: result.downvotes };
        }
        return p;
      }));
      if (result.message !== 'Vote unchanged') {
        setToast({ message: 'Vote registered!', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to vote', type: 'error' });
    }
  };

  const toggleComments = async (postId: number) => {
    const currentState = commentsState[postId];
    if (currentState?.open) {
      setCommentsState({ ...commentsState, [postId]: { ...currentState, open: false } });
      return;
    }

    // Open and fetch if not already loaded
    setCommentsState({ ...commentsState, [postId]: { open: true, loading: true, comments: currentState?.comments || [] } });
    try {
      const comments = await api.community.getPostComments(postId);
      setCommentsState(prev => ({ ...prev, [postId]: { open: true, loading: false, comments } }));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load comments', type: 'error' });
      setCommentsState(prev => ({ ...prev, [postId]: { ...prev[postId], loading: false } }));
    }
  };

  const submitComment = async (postId: number) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const newComment = await api.community.addComment(postId, text);
      setCommentInputs({ ...commentInputs, [postId]: '' });
      
      // Update local state
      setCommentsState(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          comments: [...(prev[postId]?.comments || []), newComment]
        }
      }));
      
      // Update post comment count
      setPosts(posts.map(p => p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p));
      
      setToast({ message: 'Comment added', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to add comment', type: 'error' });
    }
  };

  const submitNewPost = async () => {
    if (!newPost.title || !newPost.content) {
      setToast({ message: 'Title and Content are required', type: 'warning' });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.community.createPost(newPost);
      setToast({ message: 'Intel shared successfully!', type: 'success' });
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', scam_type: 'PHISHING', evidence_url: '' });
      fetchPosts(); // Reload posts
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to submit post', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- NEW INTEL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="text-brand-500" /> Share New Intel
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 outline-none" 
                  placeholder="E.g., New Fake UPS Delivery Link"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                <select 
                  value={newPost.scam_type} onChange={e => setNewPost({...newPost, scam_type: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                >
                  <option value="PHISHING">Domain Threats</option>
                  <option value="LINK_SCAM">Link-based Scams</option>
                  <option value="DEEPFAKES">Deepfakes / AI</option>
                  <option value="PHONE SCAMS">Phone / Call Scams</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={4}
                  value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 outline-none resize-none" 
                  placeholder="Describe the scam in detail to warn others..."
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Evidence URL (Optional)</label>
                <input 
                  type="text" 
                  value={newPost.evidence_url} onChange={e => setNewPost({...newPost, evidence_url: e.target.value})}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 outline-none" 
                  placeholder="https://..."
                />
              </div>
              <Button onClick={submitNewPost} disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl mt-4">
                {isSubmitting ? 'Publishing...' : 'Publish Intel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Alerts Section (Static Header with Dynamic Share Button) */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">COMMUNITY INTEL HUB</p>
            <h2 className="text-2xl font-bold text-white">Threat Intelligence</h2>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-2 font-bold px-4 py-2 rounded-lg">
            <Plus size={18} /> Submit Intel
          </Button>
        </div>

        {/* Featured Alert Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-dark-800 to-[#12141f] border-dark-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-[80px] pointer-events-none"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-accent-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> HIGH PRIORITY
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase">VERIFIED BY ADMINS</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">"Kinetic Vault" Phishing Protocol via Redirects</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xl">
                A sophisticated campaign mimicking official system alerts. Users report receiving malicious links via redirects and ads. Do not click.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Intel Threads */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6 border-b border-dark-700 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Activity size={20} className="text-brand-500"/> Active Intel Threads</h2>
            <div className="flex gap-4">
              <button className="text-xs font-bold text-white bg-dark-700 px-3 py-1.5 rounded-full">All Categories</button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="bg-dark-800 border-dark-600 animate-pulse">
                  <CardContent className="p-5 h-32"></CardContent>
                </Card>
              ))
            ) : posts.length === 0 ? (
              <div className="p-8 text-center bg-dark-800 border border-dark-600 rounded-xl">
                <p className="text-slate-400">No community posts yet. Be the first to share intel!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="space-y-2">
                  <Card className="bg-dark-800/80 hover:bg-dark-800 transition-colors border-dark-600">
                    <CardContent className="p-5 flex gap-5">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button onClick={() => handleVote(post.id, 'up')} className="text-slate-500 hover:text-brand-500 p-1 bg-dark-900 rounded hover:bg-dark-700 transition-colors"><ChevronUp size={20} /></button>
                        <span className="text-sm font-bold text-white w-8 text-center">{post.upvotes - post.downvotes}</span>
                        <button onClick={() => handleVote(post.id, 'down')} className="text-slate-500 hover:text-accent-red p-1 bg-dark-900 rounded hover:bg-dark-700 transition-colors"><ChevronDown size={20} /></button>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded uppercase">{post.scam_type || 'GENERAL'}</span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[10px] text-slate-400">Posted by <span className="text-slate-200 font-bold">{post.author_name}</span></span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[10px] text-slate-500">{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 mb-2 truncate">{post.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 whitespace-pre-wrap">{post.content}</p>
                        
                        {post.evidence_url && (
                          <div className="mb-4">
                            <a href={post.evidence_url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:underline bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 inline-block truncate max-w-full">
                              Evidence: {post.evidence_url}
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-6">
                          <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white font-mono bg-dark-900 px-3 py-1.5 rounded transition-colors border border-dark-600 hover:border-brand-500/50">
                            <MessageSquare size={14} /> {post.comment_count} REPLIES
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expandable Comments Section */}
                  {commentsState[post.id]?.open && (
                    <div className="pl-14 pr-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-4 space-y-4">
                        
                        {/* List Comments */}
                        {commentsState[post.id].loading ? (
                          <div className="text-center text-xs text-slate-500 py-2">Loading comments...</div>
                        ) : commentsState[post.id].comments?.length === 0 ? (
                          <div className="text-center text-xs text-slate-500 py-2 border-b border-dark-700/50 pb-4">No replies yet. Be the first to share!</div>
                        ) : (
                          <div className="space-y-3 border-b border-dark-700/50 pb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {commentsState[post.id].comments.map((comment: any) => (
                              <div key={comment.id} className="bg-dark-900/50 rounded-lg p-3 border border-dark-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-5 h-5 rounded-full bg-dark-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                    {comment.author_name.substring(0, 1)}
                                  </div>
                                  <span className="text-xs font-bold text-slate-300">{comment.author_name}</span>
                                  <span className="text-[10px] text-slate-500">{new Date(comment.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-400 pl-7 whitespace-pre-wrap">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment Input */}
                        <div className="flex gap-2 relative">
                          <input 
                            type="text" 
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                            onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                            placeholder="Add to the investigation..."
                            className="flex-1 bg-dark-900 border border-dark-600 rounded-lg py-2 pl-3 pr-10 text-sm text-white focus:border-brand-500 outline-none"
                          />
                          <button 
                            onClick={() => submitComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-500 hover:text-brand-400 disabled:opacity-50 disabled:hover:text-brand-500 transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Live Reports & Contributors */}
        <aside className="space-y-8">
          
          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span> SYSTEM FEEDS
            </h2>
            <Card className="bg-dark-800/50 border-dark-600">
              <CardContent className="p-0 divide-y divide-dark-700/50">
                <div className="p-4 hover:bg-dark-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">SYSTEM ALERT</span>
                    <span className="text-[9px] text-slate-500 font-mono">Just now</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">Threat definitions updated to Engine v2.1.4</p>
                </div>
                <div className="p-4 hover:bg-dark-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-accent-red bg-accent-red/10 px-1.5 py-0.5 rounded border border-accent-red/20">BOT MITIGATION</span>
                    <span className="text-[9px] text-slate-500 font-mono">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">Autoban triggered for entity @ScamHub_Bot1.</p>
                </div>
                <div className="p-4 hover:bg-dark-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-bold text-slate-400 bg-dark-700 px-1.5 py-0.5 rounded border border-dark-600">USER REPORT</span>
                    <span className="text-[9px] text-slate-500 font-mono">15m ago</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">Multiple users reporting fake Discord support links.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-500" /> TOP CONTRIBUTORS
            </h2>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Vortex_Scanner', role: 'ELITE SENTINEL', count: '2,840', color: 'bg-brand-500 text-white' },
                { id: 2, name: 'Neural_Link', role: 'MASTER GUARDIAN', count: '1,920', color: 'bg-accent-red text-white' },
                { id: 3, name: 'Proxy_Zero', role: 'LEAD INVESTIGATOR', count: '1,450', color: 'bg-orange-500 text-white' },
              ].map((user) => (
                <div key={user.id} className="bg-dark-800/80 border border-dark-600 rounded-xl p-3 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center border border-dark-600 font-bold text-slate-300">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-200 text-sm">{user.name}</h4>
                    <p className="text-[9px] text-brand-400 font-mono tracking-widest uppercase">{user.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{user.count}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Alerts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
