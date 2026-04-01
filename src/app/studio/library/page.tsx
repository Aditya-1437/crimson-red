"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  Layers,
  Loader2,
  AlertCircle,
  Inbox,
  BarChart3
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import LibraryFilters from "@/components/studio/LibraryFilters";
import LoadingButton from "@/components/ui/LoadingButton";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

interface Story {
  id: string;
  title: string;
  genre: string;
  is_published: boolean;
  created_at: string;
  cover_image: string | null;
  slug: string;
  type: "story" | "series";
}

export default function StudioLibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "all";
  const type = searchParams.get("type") || "all";

  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"story" | "series" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, q, status, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let storyQuery = supabase
        .from("stories")
        .select("*")
        .eq("author_id", user.id)
        .is("series_id", null);

      let seriesQuery = supabase
        .from("series")
        .select("*")
        .eq("author_id", user.id);

      // Apply Search
      if (q) {
        const filter = `title.ilike.%${q}%,genre.ilike.%${q}%`;
        storyQuery = storyQuery.or(filter);
        seriesQuery = seriesQuery.or(filter);
      }

      // Apply Status (Only for stories, series don't have is_published currently)
      if (status === "published") {
        storyQuery = storyQuery.eq("is_published", true);
      } else if (status === "draft") {
        storyQuery = storyQuery.eq("is_published", false);
      }

      const queries = [];
      if (type === "all" || type === "standalones") queries.push(storyQuery.order("created_at", { ascending: false }));
      if (type === "all" || type === "series") queries.push(seriesQuery.order("created_at", { ascending: false }));

      const results = await Promise.all(queries);
      
      let allItems: Story[] = [];
      let stData: any[] = [];
      let srData: any[] = [];

      if (type === "all") {
        stData = results[0].data || [];
        srData = results[1].data || [];
      } else if (type === "standalones") {
        stData = results[0].data || [];
      } else if (type === "series") {
        srData = results[0].data || [];
      }

      const formattedStories = stData.map(s => ({ ...s, type: "story" }));
      const formattedSeries = srData.map(s => ({ ...s, type: "series" }));
      
      allItems = [...formattedStories, ...formattedSeries].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setItems(allItems as any);

      // Summary metrics (of formatted items)
      setMetrics({
        total: allItems.length,
        published: allItems.filter(i => (i as any).is_published === true || i.type === "series").length, // Series count as published for now
        drafts: allItems.filter(i => (i as any).is_published === false).length
      });

    } catch (error: any) {
      console.error("Error fetching archives:", error.message);
      toast.error("Failed to sync with the Archives");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    
    setIsDeleting(true);
    try {
      const table = deleteType === "story" ? "stories" : "series";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} expunged from the Archives`, {
        className: "bg-crimson text-white border-none",
      });
      
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
      setDeleteType(null);
    } catch (error: any) {
      toast.error("Failed to expunge record");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (loading && items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-crimson animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Consulting the Archives...</p>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 ${playfair.variable} ${inter.variable} font-sans`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-3 uppercase tracking-tight italic">
            The <span className="text-crimson">Archives</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Advanced management console for your written legacies and serialized chronicles.
          </p>
        </div>
      </div>

      <LibraryFilters />

      {/* Metrics Row */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <BarChart3 size={16} className="text-crimson/40" />
          <span>Showing {metrics.total} results</span>
          <span className="mx-2 text-slate-200">|</span>
          <span className="text-green-600/70">{metrics.published} Published</span>
          <span className="mx-2 text-slate-200">|</span>
          <span className="text-amber-600/70">{metrics.drafts} Drafts</span>
        </div>
      </div>

      {/* Grid Display */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-5 hover:border-crimson/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Thumbnail */}
                  <div className="w-full md:w-40 h-28 rounded-2xl bg-slate-50 overflow-hidden relative shrink-0">
                    {item.cover_image ? (
                      <img 
                        src={item.cover_image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        {item.type === "series" ? <Layers size={32} /> : <BookOpen size={32} />}
                      </div>
                    )}
                    {item.type === "story" && (
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                          item.is_published 
                            ? "bg-green-500 text-white" 
                            : "bg-amber-500 text-white"
                        }`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson mr-2"></span>
                        {item.type === "series" ? "Epic Series" : item.genre}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 truncate group-hover:text-crimson transition-colors italic">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <LoadingButton 
                      href={item.type === "story" ? `/studio/edit/${item.id}` : `/studio/series/${item.id}`}
                      loadingText={item.type === "series" ? "Opening Hub..." : "Opening Editor..."}
                      className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-crimson/5 text-slate-600 hover:text-crimson hover:border-crimson/20 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-sm"
                    >
                      <Edit2 size={16} />
                      <span>{item.type === "series" ? "Manage" : "Edit"}</span>
                    </LoadingButton>
                    <button 
                      onClick={() => { setDeleteId(item.id); setDeleteType(item.type as any); }}
                      className="flex-1 md:flex-none p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <Link 
                      href={item.type === "story" ? `/stories/${item.slug}` : `/series/${item.slug}`}
                      className="p-3 text-slate-600 hover:text-black hover:bg-slate-100 rounded-2xl transition-all"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-dashed border-crimson/10 rounded-[3rem] py-24 px-6 text-center max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-crimson/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Inbox size={48} className="text-crimson/30" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">No records found</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
            The archives are silent for this query. Try adjusting your filters or search terms.
          </p>
          <LoadingButton 
            href={pathname}
            loadingText="Resetting..."
            className="mx-auto px-8 py-3 bg-crimson text-white rounded-full font-bold shadow-xl shadow-crimson/20 hover:shadow-crimson/30 transition-all font-sans"
          >
            Reset All Filters
          </LoadingButton>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl overflow-hidden border border-crimson/10"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-crimson"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-crimson rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 italic">Expunge Record?</h3>
                <p className="text-slate-500 font-medium mb-8">This action is irreversible. The chronicle will be permanently deleted from the Archives.</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white bg-crimson hover:bg-crimson-light transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-crimson/20"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Confirm Expunge"}
                </button>
                <button 
                  onClick={() => setDeleteId(null)}
                  className="w-full py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Return to Safety
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
