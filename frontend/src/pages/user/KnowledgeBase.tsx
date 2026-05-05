import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Search, BookOpen, Shield, Bell, ArrowRight, Clock, Star, Filter } from 'lucide-react';
import { api } from '../../services/api';

export function KnowledgeBase() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await api.knowledge.getArticles(activeCategory === 'all' ? undefined : activeCategory);
        setArticles(data.articles);
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [activeCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Search Header */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-dark-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-bold uppercase tracking-widest">
              Scam Guardian Academy
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight">How can we help you stay safe?</h1>
           <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Search for security tips, scam patterns, or guides..." 
                className="w-full bg-dark-950 border border-dark-600 rounded-2xl py-4 pl-12 pr-4 text-slate-200 outline-none focus:border-brand-500 transition-all shadow-inner"
              />
           </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:w-64 space-y-6">
           <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                 <Filter size={12} /> Categories
              </h3>
              <nav className="space-y-1">
                 {[
                   { id: 'all', label: 'All Articles', icon: BookOpen },
                   { id: 'phishing', label: 'Phishing URLs', icon: Shield },
                   { id: 'social', label: 'Social Media', icon: Star },
                   { id: 'general', label: 'General Security', icon: Bell },
                 ].map((cat) => (
                   <button 
                     key={cat.id}
                     onClick={() => setActiveCategory(cat.id)}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                       activeCategory === cat.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-dark-800 rounded-2xl animate-pulse"></div>
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <Card key={article.id} className="bg-dark-800 border-dark-600 group hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/5 overflow-hidden">
                    <CardContent className="p-0">
                       <div className="h-40 bg-dark-900 relative overflow-hidden">
                          <img 
                            src={article.thumbnail_url || `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400`} 
                            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" 
                            alt={article.title}
                          />
                          <div className="absolute top-4 left-4 px-2 py-1 rounded bg-dark-950/80 backdrop-blur-md border border-dark-600 text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                             {article.category}
                          </div>
                       </div>
                       <div className="p-6 space-y-3">
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Clock size={12} /> {article.read_time_minutes} min read</span>
                             <span>•</span>
                             <span className="text-brand-500">{article.difficulty}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2">{article.title}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                             {article.content.substring(0, 100)}...
                          </p>
                          <div className="pt-4 border-t border-dark-700 flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-500 uppercase">
                                   {article.author_name.substring(0, 1)}
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{article.author_name}</span>
                             </div>
                             <Button variant="outline" size="sm" className="text-brand-500 hover:text-brand-400 p-0 h-auto font-bold text-xs flex items-center gap-1 group/btn">
                                Read More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-500 italic">No articles found in this category.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
