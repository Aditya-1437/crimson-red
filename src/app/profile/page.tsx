"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import LoadingButton from "@/components/ui/LoadingButton";
import { Loader2, Clock, BookOpen, Bookmark, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";

interface ReadingProgress {
  id: string;
  progress_percentage: number;
  time_spent_seconds: number;
  last_read_at: string;
  story_id: string;
  series_id: string | null;
  stories: {
    title: string;
    slug: string;
    genre: string;
    cover_image: string | null;
    chapter_number: number;
    series: {
      title: string;
      slug: string;
    } | null;
  };
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalTime: "0h 0m", topGenre: "Explorer" });

  useEffect(() => {
    if (!authLoading && user) {
      fetchReadingHistory();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchReadingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select(`
          id, 
          progress_percentage, 
          time_spent_seconds, 
          last_read_at, 
          story_id, 
          series_id,
          stories (
            title, 
            slug, 
            genre, 
            cover_image, 
            chapter_number,
            series:series_id (
              title, 
              slug
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('last_read_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const history = data as any[];
        setReadingHistory(history);
        calculateMetrics(history);
      }
    } catch (err) {
      console.error("Error fetching reading history:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (history: any[]) => {
    // Total Time
    const totalSeconds = history.reduce((acc, curr) => acc + (curr.time_spent_seconds || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const timeStr = `${hours}h ${minutes}m`;

    // Top Genre
    const genreCounts: Record<string, number> = {};
    history.forEach(item => {
      const genre = item.stories?.genre;
      if (genre) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    });

    let topGenre = "Explorer";
    let maxCount = 0;
    Object.entries(genreCounts).forEach(([genre, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topGenre = genre;
      }
    });

    setMetrics({ totalTime: timeStr, topGenre });
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-crimson animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson animate-pulse">Syncing Sanctuary Profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">Archives Restricted</h1>
            <p className="text-slate-500 mb-8 font-medium italic">Please sign in to your sanctuary to view your reading legends and personal metrics.</p>
            <LoadingButton href="/signin" className="mx-auto px-8 py-3 bg-crimson text-white rounded-full font-bold shadow-xl shadow-crimson/20">
              Enter Sanctuary
            </LoadingButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col font-sans selection:bg-crimson/20">
      <Header />
      
      <main className="flex-grow pt-32 pb-24 md:pt-40 container mx-auto px-6 max-w-6xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border border-crimson/10 flex items-center justify-center shadow-sm overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-crimson/5 to-transparent"></div>
               <span className="text-4xl md:text-6xl font-serif font-bold text-crimson uppercase z-10">
                 {user.email?.[0] || "U"}
               </span>
            </div>
            <div>
              <p className="text-crimson font-black tracking-[0.3em] uppercase text-[10px] mb-2 px-3 py-1 bg-crimson/5 border border-crimson/10 rounded-full inline-block">Citizen of Red</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2 truncate max-w-[250px] md:max-w-md">
                {user.user_metadata?.username || user.email?.split('@')[0]}
              </h1>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                 <Award size={14} className="text-amber-500" />
                 <span>Status: Elder Reader</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:flex-none px-8 py-5 bg-white border border-crimson/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-crimson transition-colors">
                  <Clock size={12} />
                  <span>Time Logged</span>
                </div>
                <p className="text-2xl font-serif font-bold text-slate-900 italic">{metrics.totalTime}</p>
             </div>
             <div className="flex-1 md:flex-none px-8 py-5 bg-white border border-crimson/10 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-crimson transition-colors">
                  <BookOpen size={12} />
                  <span>Top Haven</span>
                </div>
                <p className="text-2xl font-serif font-bold text-slate-900 italic">{metrics.topGenre}</p>
             </div>
          </div>
        </div>

        {/* Continue Reading Section */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Continue Your Chronicles</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>

          {readingHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {readingHistory.slice(0, 4).map((record) => (
                <ContinueReadingCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-[3rem] py-24 text-center px-6 shadow-sm">
              <div className="w-20 h-20 bg-crimson/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Bookmark size={32} className="text-crimson/20" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Your Archives are silent</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium italic underline decoration-crimson/20 underline-offset-4">Your reading history will be scribed here once you begin your first journey in the library.</p>
              <LoadingButton href="/stories" className="mx-auto px-10 py-4 bg-crimson text-white rounded-full font-bold shadow-2xl shadow-crimson/30 transition-all hover:bg-crimson-light">
                Explore The Library &rarr;
              </LoadingButton>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ContinueReadingCard({ record }: { record: ReadingProgress }) {
  const isFinished = record.progress_percentage >= 95;
  const isSeries = !!record.series_id;
  const story = record.stories;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleSmartNavigation = async () => {
    if (isFinished && isSeries) {
      setLoadingNext(true);
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('slug')
          .eq('series_id', record.series_id)
          .eq('chapter_number', story.chapter_number + 1)
          .eq('is_published', true)
          .single();
        
        if (data) {
          window.location.href = `/stories/${data.slug}`;
          return;
        }
      } catch (err) {
        console.error("End of series or error:", err);
      }
    }
    window.location.href = `/stories/${story.slug}`;
  };

  return (
     <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-crimson/5 transition-all duration-300 group flex gap-6 md:gap-8"
     >
       {/* Image column */}
       <div className="w-28 h-40 md:w-36 md:h-48 rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative shadow-lg">
          {story.cover_image ? (
             <img src={story.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={story.title} />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                <BookOpen size={32} />
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          {isFinished && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-sm z-10">
              Completed
            </div>
          )}
       </div>

       {/* Content column */}
       <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-crimson">
                {isSeries ? "Serialized Hub" : "Standalone Read"}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-crimson transition-colors italic leading-tight mb-2">
              {story.title}
            </h3>
            {isSeries && (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                Part of: {story.series?.title}
              </p>
            )}
          </div>

          <div className="space-y-4">
             <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                  <span className="text-[10px] font-black text-crimson uppercase tracking-widest">{Math.round(record.progress_percentage)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${record.progress_percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-crimson rounded-full"
                  />
                </div>
             </div>

             <button 
               onClick={handleSmartNavigation}
               disabled={loadingNext}
               className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 group/btn hover:bg-crimson hover:shadow-xl hover:shadow-crimson/20 active:scale-[0.98] disabled:opacity-50"
             >
               {loadingNext ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
               ) : (
                 <>
                  <span>{(isFinished && isSeries) ? "Next Chapter" : "Resume Legend"}</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
          </div>
       </div>
     </motion.div>
  );
}
