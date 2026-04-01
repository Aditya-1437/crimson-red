"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  Filter,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";

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
}

export default function StudioLibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchStories();
    }
  }, [user, authLoading]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error: any) {
      console.error("Error fetching stories:", error.message);
      toast.error("Failed to load your chronicles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Story removed from the Chronicles", {
        className: "bg-crimson text-white border-none",
      });
      
      setStories(stories.filter(s => s.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast.error("Failed to delete story");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || (loading && stories.length === 0)) {
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-3 uppercase tracking-tight">
            The <span className="text-crimson">Library</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your written works, drafts, and published chronicles from one central desk.
          </p>
        </div>
        
        <Link 
          href="/studio/new"
          className="bg-crimson text-white px-8 py-4 rounded-full font-bold flex items-center justify-center shadow-lg shadow-crimson/20 hover:shadow-crimson/30 hover:scale-[1.02] transition-all group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Pen New Story
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl p-4 mb-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search your chronicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-crimson/10 transition-all font-medium text-slate-700"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 hidden lg:block">
            {filteredStories.length} Volumes Found
          </div>
        </div>
      </div>

      {/* Stories Grid/List */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white border border-slate-100 rounded-3xl p-5 hover:border-crimson/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Thumbnail */}
                  <div className="w-full md:w-40 h-28 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0">
                    {story.cover_image ? (
                      <img 
                        src={story.cover_image} 
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                        story.is_published 
                          ? "bg-green-500 text-white" 
                          : "bg-amber-500 text-white"
                      }`}>
                        {story.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-crimson flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson mr-2"></span>
                        {story.genre}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 truncate group-hover:text-crimson transition-colors">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(story.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <Link 
                      href={`/studio/edit/${story.id}`}
                      className="flex-1 md:flex-none p-3 text-slate-600 hover:text-crimson hover:bg-crimson/5 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Edit2 size={18} />
                      <span className="md:hidden lg:inline">Edit</span>
                    </Link>
                    <button 
                      onClick={() => setDeleteId(story.id)}
                      className="flex-1 md:flex-none p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Trash2 size={18} />
                      <span className="md:hidden lg:inline">Delete</span>
                    </button>
                    <Link 
                      href={`/stories/${story.slug}`}
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
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 px-6 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">The shelves are empty</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            You haven't penned any stories yet. Start your journey by creating your first chronicle.
          </p>
          <Link 
            href="/studio/new"
            className="inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Create First Story
          </Link>
        </div>
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
              className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-crimson"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 text-crimson rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Erase from memory?</h3>
                  <p className="text-slate-500 text-sm font-medium">This action cannot be undone. The chronicle will be permanently deleted.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-crimson hover:bg-crimson-light transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
