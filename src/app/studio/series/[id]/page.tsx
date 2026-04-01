"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, ExternalLink, Loader2, BookOpen, Clock, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Playfair_Display, Inter } from "next/font/google";
import { motion } from "framer-motion";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-inter" });

export default function SeriesManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [series, setSeries] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchSeriesData();
    }
  }, [user, id]);

  const fetchSeriesData = async () => {
    try {
      setLoading(true);
      const { data: sData, error: sErr } = await supabase
        .from('series')
        .select('*')
        .eq('id', id)
        .eq('author_id', user!.id)
        .single();

      if (sErr) throw sErr;
      setSeries(sData);

      const { data: cData, error: cErr } = await supabase
        .from('stories')
        .select('*')
        .eq('series_id', id)
        .order('chapter_number', { ascending: true });

      if (cErr) throw cErr;
      setChapters(cData || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load series data");
      router.push("/studio/library");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9F9]">
        <Loader2 className="w-12 h-12 text-crimson animate-spin mb-4" />
        <p className="text-slate-500 font-medium uppercase tracking-widest text-sm animate-pulse">Consulting the Archives...</p>
      </div>
    );
  }

  if (!series) return null;

  return (
    <div className={`min-h-screen bg-[#F9F9F9] flex flex-col ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20`}>
      {/* Header */}
      <header className="h-20 bg-white border-b border-crimson/10 flex items-center justify-between px-8 shrink-0 relative w-full sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-6">
          <Link href="/studio/library" className="flex items-center text-slate-500 hover:text-crimson transition-all text-sm font-bold tracking-widest group uppercase">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Library
          </Link>
          <div className="h-6 w-px bg-slate-200 shrink-0"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson md:block hidden shrink-0">
            Series Hub
          </span>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg overflow-hidden whitespace-nowrap text-ellipsis self-center">
          <span className="font-serif font-bold text-slate-800 text-sm truncate">
            {series.title}
          </span>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <Link 
            href={`/studio/new?series_id=${id}`}
            className="px-8 py-2.5 bg-crimson text-white text-sm font-bold rounded-full hover:bg-crimson-light transition-all flex items-center shadow-lg shadow-crimson/20 hover:shadow-crimson/30 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus size={16} className="mr-2" />
            Add New Chapter
          </Link>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-12 max-w-6xl mx-auto w-full">
        {/* Series Metadata Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-16 flex flex-col md:flex-row gap-8 md:gap-12 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-crimson/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="w-full md:w-64 aspect-[16/9] md:aspect-[3/4] rounded-3xl bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0 shadow-inner group">
            {series.cover_image ? (
              <img src={series.cover_image} alt={series.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <BookOpen size={40} />
                <span className="text-xs uppercase tracking-widest font-bold">No Cover</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-crimson shadow-sm">
              {series.genre || "Series"}
            </div>
          </div>

          <div className="flex-1 relative z-10 py-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">{series.title}</h1>
            <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-2xl text-lg">
              {series.synopsis || "No synopsis available for this series."}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/series/${series.slug}`} target="_blank" className="text-sm font-bold flex items-center gap-2 text-crimson bg-crimson/5 border border-crimson/10 hover:bg-crimson/10 px-6 py-3 rounded-full transition-colors uppercase tracking-widest">
                <ExternalLink size={16} className="mr-1" /> Public Page
              </Link>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Chapters</h2>
            <div className="h-px bg-slate-200 flex-grow mx-6"></div>
            <span className="text-xs font-sans font-bold text-crimson bg-crimson/5 border border-crimson/10 px-4 py-2 rounded-full uppercase tracking-widest">
              {chapters.length} Total
            </span>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={chapter.id} 
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 lg:px-8 lg:py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-crimson/20 hover:shadow-lg hover:shadow-crimson/5 transition-all duration-300 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson/60 group-hover:text-crimson flex items-center transition-colors">
                         Chapter {chapter.chapter_number}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${chapter.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                         {chapter.is_published ? "Published" : "Draft"}
                       </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800">{chapter.title}</h3>
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-4 mt-3">
                       <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(chapter.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                    <Link 
                      href={`/studio/edit/${chapter.id}`}
                      className="flex-1 md:flex-none px-6 py-3 text-slate-600 border border-slate-200 hover:text-crimson hover:bg-crimson/5 hover:border-crimson/20 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    {chapter.is_published && (
                      <Link 
                        href={`/stories/${chapter.slug}`}
                        target="_blank"
                        className="p-3 text-slate-600 hover:text-black hover:bg-slate-100 rounded-2xl transition-all"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-[3px] border-dashed border-slate-200 rounded-[3rem] py-24 px-6 text-center">
              <div className="w-20 h-20 bg-crimson/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={36} className="text-crimson/40" />
              </div>
              <p className="text-slate-500 font-medium text-xl mb-8 font-serif italic">This series has no chapters yet.</p>
              <Link 
                href={`/studio/new?series_id=${id}`}
                className="inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all shadow-xl"
              >
                <Plus size={18} className="mr-2" /> Write Chapter 1
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
