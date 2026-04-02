"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import LoadingButton from "@/components/ui/LoadingButton";
import { Loader2, Clock, BookOpen, Bookmark, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const UserAnalytics = dynamic(() => import("@/components/profile/UserAnalytics"), { 
  ssr: false,
  loading: () => <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 animate-pulse">
    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white border border-slate-100 rounded-[2.5rem]" />)}
  </div>
});

interface ReadingProgress {
  id: string;
  progress_percentage: number;
  time_spent_seconds: number;
  last_read_at: string;
  story_id: string;
  series_id: string | null;
  stories: {
    id: string;
    title: string;
    slug: string;
    genre: string;
    cover_image: string | null;
    chapter_number: number;
    content: string;
    series: {
      title: string;
      slug: string;
    } | null;
  };
  // Expanded fields for UI
  series_stats?: {
    total_chapters: number;
    completed_chapters: number;
    total_estimated_minutes: number;
    remaining_minutes: number;
  };
  estimated_minutes?: number;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalTime: "0h 0m", topGenre: "Explorer" });

  // Search and Filter States
  const [ongoingSearch, setOngoingSearch] = useState("");
  const [ongoingGenre, setOngoingGenre] = useState("All Genres");
  const [ongoingType, setOngoingType] = useState("All Reads");

  const [completedSearch, setCompletedSearch] = useState("");
  const [completedGenre, setCompletedGenre] = useState("All Genres");
  const [completedType, setCompletedType] = useState("All Reads");

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
            id,
            title, 
            slug, 
            genre, 
            cover_image, 
            chapter_number,
            content,
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
        // Handle Supabase join sometimes returning arrays for single relations in TS
        const rawHistory = data as any[];
        
        const enhancedHistory = await Promise.all(rawHistory.map(async (record) => {
          const storyData = Array.isArray(record.stories) ? record.stories[0] : record.stories;
          if (!storyData) return record;

          // Calculate estimated minutes for current story
          const wordCount = storyData.content?.split(/\s+/).length || 0;
          const storyEstMinutes = Math.ceil(wordCount / 200);
          
          let seriesStats;
          if (record.series_id) {
            // Fetch all chapters in the series to calculate total progress
            const { data: seriesChapters } = await supabase
              .from('stories')
              .select('id, content')
              .eq('series_id', record.series_id);
            
            if (seriesChapters) {
              const chapterIds = seriesChapters.map(c => c.id);
              
              // Fetch user's progress for all chapters in this series
              const { data: chapterProgress } = await supabase
                .from('reading_progress')
                .select('story_id, progress_percentage')
                .eq('user_id', user!.id)
                .in('story_id', chapterIds);
              
              const completed_chapters = chapterProgress?.filter(p => p.progress_percentage >= 90).length || 0;
              const total_chapters = seriesChapters.length;
              
              // Calculate total series estimated time
              let total_est_mins = 0;
              seriesChapters.forEach(c => {
                const words = c.content?.split(/\s+/).length || 0;
                total_est_mins += Math.ceil(words / 200);
              });

              // Calculate remaining time
              // Subtract time already spent or estimated time of completed chapters?
              // Let's do: total_est_mins - (sum of est_mins of completed chapters)
              // For simplicity: total_est_mins * (1 - completion_ratio)
              const remaining_minutes = Math.max(0, Math.ceil(total_est_mins * (1 - (completed_chapters / total_chapters))));

              seriesStats = {
                total_chapters,
                completed_chapters,
                total_estimated_minutes: total_est_mins,
                remaining_minutes
              };
            }
          }

          return {
            ...record,
            stories: storyData, // Ensure stories is a single object
            estimated_minutes: storyEstMinutes,
            series_stats: seriesStats
          };
        }));

        setReadingHistory(enhancedHistory as ReadingProgress[]);
        calculateMetrics(enhancedHistory as ReadingProgress[]);
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

  const filterRecords = (records: ReadingProgress[], search: string, genre: string, type: string) => {
    return records.filter(record => {
      const searchLower = search.toLowerCase();
      const matchesTitle = record.stories.title.toLowerCase().includes(searchLower);
      const matchesSeries = record.stories.series?.title?.toLowerCase().includes(searchLower) ?? false;
      const matchesSearch = matchesTitle || matchesSeries;
      
      const matchesGenre = genre === "All Genres" || record.stories.genre === genre;
      const isSeries = !!record.series_id;
      const matchesType = type === "All Reads" || 
        (type === "Series" && isSeries) || 
        (type === "Standalone" && !isSeries);
      
      return matchesSearch && matchesGenre && matchesType;
    });
  };

  const ongoingHistory = readingHistory.filter(r => {
    const isSeries = !!r.series_id;
    if (isSeries && r.series_stats) {
      return r.series_stats.completed_chapters < r.series_stats.total_chapters;
    }
    return r.progress_percentage < 95;
  });

  const completedHistory = readingHistory.filter(r => {
    const isSeries = !!r.series_id;
    if (isSeries && r.series_stats) {
      return r.series_stats.completed_chapters === r.series_stats.total_chapters;
    }
    return r.progress_percentage >= 95;
  });

  const filteredOngoing = filterRecords(ongoingHistory, ongoingSearch, ongoingGenre, ongoingType);
  const filteredCompleted = filterRecords(completedHistory, completedSearch, completedGenre, completedType);

  const allGenres = Array.from(new Set(readingHistory.map(r => r.stories.genre))).sort();

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

        {/* Ongoing Chronicles Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="text-2xl font-serif font-bold text-slate-900 italic whitespace-nowrap">Ongoing Chronicles</h2>
              <div className="h-px bg-slate-200 flex-grow hidden md:block"></div>
            </div>
            
            <FilterBar 
              search={ongoingSearch}
              setSearch={setOngoingSearch}
              genre={ongoingGenre}
              setGenre={setOngoingGenre}
              type={ongoingType}
              setType={setOngoingType}
              genres={allGenres}
              placeholder="Search ongoing..."
            />
          </div>

          {filteredOngoing.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {filteredOngoing.map((record) => (
                <ContinueReadingCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={ongoingSearch || ongoingGenre !== "All Genres" || ongoingType !== "All Reads" ? "No matches found" : "Your path is clear"}
              message="No ongoing journeys match your current search or filters."
              showButton={!ongoingSearch && ongoingGenre === "All Genres" && ongoingType === "All Reads"}
            />
          )}
        </section>

        {/* Completed Legends Section */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="text-2xl font-serif font-bold text-slate-900 italic whitespace-nowrap">Completed Legends</h2>
              <div className="h-px bg-slate-200 flex-grow hidden md:block"></div>
            </div>
            
            <FilterBar 
              search={completedSearch}
              setSearch={setCompletedSearch}
              genre={completedGenre}
              setGenre={setCompletedGenre}
              type={completedType}
              setType={setCompletedType}
              genres={allGenres}
              placeholder="Search completed..."
            />
          </div>

          {filteredCompleted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {filteredCompleted.map((record) => (
                <ContinueReadingCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title={completedSearch || completedGenre !== "All Genres" || completedType !== "All Reads" ? "No matches found" : "The archives are open"}
              message="No completed legends match your current search or filters."
              showButton={false}
            />
          )}
        </section>

        {/* Reader Analytics Section */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900 italic">Reader Analytics</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>
          <UserAnalytics userId={user.id} />
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

  const estMinutes = record.series_id 
    ? record.series_stats?.remaining_minutes 
    : Math.max(1, Math.ceil((record.estimated_minutes || 0) * (1 - record.progress_percentage / 100)));

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
          
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
            <div className="bg-white/90 backdrop-blur-sm text-crimson text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-sm">
              {story.genre}
            </div>
          </div>
       </div>

       {/* Content column */}
       <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-crimson">
                {isSeries ? "Serialized Hub" : "Standalone Read"}
              </span>
              <span className="text-[9px] font-bold text-slate-400 italic">
                {new Date(record.last_read_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-crimson transition-colors italic leading-tight mb-2">
              {story.title}
            </h3>
            {isSeries && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  Part of: {story.series?.title}
                </p>
                <p className="text-[9px] font-bold text-crimson uppercase tracking-widest">
                  {record.series_stats?.completed_chapters} of {record.series_stats?.total_chapters} Chapters Scribed
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
             <div className="space-y-3">
                {/* Chapter Progress - Only for Standalone Stories */}
                {!isSeries && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Story Progress</span>
                      <span className="text-[9px] font-black text-crimson uppercase tracking-widest">{Math.round(record.progress_percentage)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${record.progress_percentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-crimson/40 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Series Progress Bar (Only for series) */}
                {isSeries && record.series_stats && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Odyssey</span>
                      <span className="text-[9px] font-black text-crimson uppercase tracking-widest">
                        {Math.round((record.series_stats.completed_chapters / record.series_stats.total_chapters) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(record.series_stats.completed_chapters / record.series_stats.total_chapters) * 100}%` }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                        className="h-full bg-crimson rounded-full shadow-[0_0_8px_rgba(153,0,0,0.3)]"
                      />
                    </div>
                  </div>
                )}

                {/* Estimated Time */}
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  <Clock size={10} className="text-crimson/40" />
                  <span>Est. {estMinutes}m to {isSeries ? "complete series" : "finish read"}</span>
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

function FilterBar({ search, setSearch, genre, setGenre, type, setType, genres, placeholder }: any) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative group min-w-[200px]">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-crimson/30 focus:ring-4 focus:ring-crimson/5 transition-all outline-none"
        />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-crimson transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="relative group">
        <select 
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-crimson/30 transition-all cursor-pointer appearance-none hover:bg-slate-50 min-w-[140px]"
        >
          <option>All Genres</option>
          {genres.map((g: string) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
      </div>

      <div className="relative group">
        <select 
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-crimson/30 transition-all cursor-pointer appearance-none hover:bg-slate-50 min-w-[140px]"
        >
          <option>All Reads</option>
          <option>Series</option>
          <option>Standalone</option>
        </select>
        <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
      </div>
    </div>
  );
}

function EmptyState({ title, message, showButton }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] py-20 text-center px-6 shadow-sm">
      <div className="w-16 h-16 bg-crimson/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bookmark size={24} className="text-crimson/20" />
      </div>
      <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm font-medium italic">{message}</p>
      {showButton && (
        <LoadingButton href="/stories" className="mx-auto px-8 py-3 bg-crimson text-white rounded-full font-bold shadow-xl shadow-crimson/20 transition-all hover:bg-crimson-light text-xs uppercase tracking-widest">
          Explore The Library &rarr;
        </LoadingButton>
      )}
    </div>
  );
}
