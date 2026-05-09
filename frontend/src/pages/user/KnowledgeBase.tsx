import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Search, BookOpen, Shield, Bell, ArrowRight, Clock, Star, Filter, Eye, X } from 'lucide-react';
import { api } from '../../services/api';

export function KnowledgeBase() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal state
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [fullArticle, setFullArticle] = useState<any>(null);
  const [loadingArticle, setLoadingArticle] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await api.knowledge.getArticles(activeCategory, debouncedSearch);
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Failed to fetch articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [activeCategory, debouncedSearch]);

  const handleReadMore = async (id: number) => {
    setSelectedArticleId(id);
    setLoadingArticle(true);
    try {
      const data = await api.knowledge.getArticle(id);
      setFullArticle(data);
      // Optimistically update the view count in the list
      setArticles(articles.map(a => a.id === id ? { ...a, view_count: a.view_count + 1 } : a));
    } catch (err) {
      console.error("Failed to load article", err);
    } finally {
      setLoadingArticle(false);
    }
  };

  const closeModal = () => {
    setSelectedArticleId(null);
    setFullArticle(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 relative">
      
      {/* Full Article Modal */}
      {selectedArticleId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-dark-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-dark-600 bg-dark-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-brand-500" />
                <span className="font-bold text-white uppercase tracking-widest text-sm">Academy Article</span>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors bg-dark-700 hover:bg-dark-600 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="overflow-y-auto p-6 sm:p-10 custom-scrollbar relative flex-1">
              {loadingArticle ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 font-mono text-sm">Decrypting contents...</p>
                </div>
              ) : fullArticle ? (
                <div className="space-y-8 max-w-3xl mx-auto">
                  {/* Article Hero */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-1 rounded">{fullArticle.category}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {fullArticle.read_time_minutes} min read</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {fullArticle.view_count} views</span>
                      <span className="text-brand-500">{fullArticle.difficulty} Level</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{fullArticle.title}</h1>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-sm font-bold text-white border border-dark-600">
                        {fullArticle.author_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200">{fullArticle.author_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Published {new Date(fullArticle.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-dark-700 relative">
                    <img 
                      src={fullArticle.thumbnail_url || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200`} 
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60"></div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-invert prose-brand max-w-none prose-p:leading-relaxed prose-p:text-slate-300 prose-headings:text-white prose-a:text-brand-400 hover:prose-a:text-brand-300 pb-10 whitespace-pre-wrap">
                    {fullArticle.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-400">Failed to load article content.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Header */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-dark-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold uppercase tracking-widest">
              Scam Guardian Academy
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight">How can we help you stay safe?</h1>
           <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for security tips, scam patterns, or guides..." 
                className="w-full bg-dark-950 border border-dark-600 rounded-2xl py-4 pl-12 pr-4 text-slate-200 outline-none focus:border-brand-500 transition-all shadow-inner"
              />
           </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-6">
           <div className="space-y-2 sticky top-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2 mb-4">
                 <Filter size={12} /> Categories
              </h3>
              <nav className="space-y-2">
                 {[
                   { id: 'all', label: 'All Articles', icon: BookOpen },
                   { id: 'PHISHING', label: 'Phishing Defense', icon: Shield },
                   { id: 'SOCIAL', label: 'Social Engineering', icon: Star },
                   { id: 'GENERAL', label: 'General Security', icon: Bell },
                 ].map((cat) => (
                   <button 
                     key={cat.id}
                     onClick={() => setActiveCategory(cat.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                       activeCategory === cat.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 border border-brand-400/50' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800 border border-transparent'
                     }`}
                   >
                     <cat.icon size={18} /> {cat.label}
                   </button>
                 ))}
              </nav>
           </div>
        </aside>

        {/* Article Grid */}
        <div className="flex-1 space-y-8">
           <div className="flex justify-between items-end border-b border-dark-700 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {activeCategory === 'all' ? 'Latest Knowledge' : `${activeCategory} Articles`}
              </h2>
              {debouncedSearch && (
                <span className="text-sm text-brand-400 bg-brand-500/10 px-2 py-1 rounded border border-brand-500/20">
                  Results for "{debouncedSearch}"
                </span>
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-80 bg-dark-800 rounded-2xl animate-pulse border border-dark-600"></div>
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <Card key={article.id} className="bg-dark-800 border-dark-600 group hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 overflow-hidden flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                       <div className="h-48 bg-dark-900 relative overflow-hidden shrink-0">
                          <img 
                            src={article.thumbnail_url || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400`} 
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                            alt={article.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
                          <div className="absolute top-4 left-4 px-2 py-1 rounded bg-dark-950/80 backdrop-blur-md border border-dark-600 text-[9px] font-bold text-brand-400 uppercase tracking-widest">
                             {article.category}
                          </div>
                          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] font-bold text-slate-300 bg-dark-950/80 backdrop-blur-md px-2 py-1 rounded border border-dark-600">
                             <Eye size={12} className="text-brand-500" /> {article.view_count}
                          </div>
                       </div>
                       
                       <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                             <span className="flex items-center gap-1"><Clock size={12} /> {article.read_time_minutes} min read</span>
                             <span>•</span>
                             <span className="text-brand-500">{article.difficulty} Level</span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                             {article.content.substring(0, 150)}...
                          </p>
                          
                          <div className="pt-4 border-t border-dark-700 flex justify-between items-center mt-auto">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                   {article.author_name.substring(0, 1)}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{article.author_name}</span>
                             </div>
                             <Button onClick={() => handleReadMore(article.id)} variant="outline" size="sm" className="text-brand-400 hover:text-white border-brand-500/30 hover:bg-brand-500/20 p-2 h-auto font-bold text-xs flex items-center gap-1 group/btn transition-colors rounded-lg">
                                Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-24 text-center border border-dashed border-dark-600 rounded-2xl bg-dark-800/50">
                  <BookOpen size={40} className="mx-auto text-slate-600 mb-4 opacity-50" />
                  <p className="text-slate-400 font-bold">No knowledge articles found.</p>
                  <p className="text-sm text-slate-500 mt-2">Try adjusting your search or category filters.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
