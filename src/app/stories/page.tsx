"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SlidersHorizontal, Inbox } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCard, { Story } from "@/components/StoryCard";
import GenreFilter from "@/components/GenreFilter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { StoryCardSkeleton } from "@/components/ui/Skeletons";
import SearchBar from "@/components/ui/SearchBar";
import AuthGateModal from "@/components/ui/AuthGateModal";

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [showFilters, setShowFilters] = useState(false);
  const [standalones, setStandalones] = useState<Story[]>([]);
  const [series, setSeries] = useState<Story[]>([]);
  const [isFetchingStories, setIsFetchingStories] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchStories() {
      try {
        setIsFetchingStories(true);
        
        let stQuery = supabase
          .from('stories')
          .select('*')
          .is('series_id', null)
          .eq('is_published', true);
          
        let srQuery = supabase
          .from('series')
          .select('*');

        if (query) {
          const filter = `title.ilike.%${query}%,genre.ilike.%${query}%`;
          stQuery = stQuery.or(filter);
          srQuery = srQuery.or(filter);
        }

        const [stResult, srResult] = await Promise.all([
          stQuery.order('created_at', { ascending: false }),
          srQuery.order('created_at', { ascending: false })
        ]);

        if (stResult.error) throw stResult.error;
        if (srResult.error) throw srResult.error;

        if (stResult.data) {
          const formattedStories = stResult.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            author: item.author_name || "Author",
            genre: item.genre || "Fiction",
            slug: item.slug,
            excerpt: item.content?.substring ? item.content.substring(0, 160) + "..." : "A new story awaits...",
            coverColor: "bg-stone-900",
            coverImage: item.cover_image,
            type: "story"
          }));
          setStandalones(formattedStories as Story[]);
        }

        if (srResult.data) {
          const formattedSeries = srResult.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            author: item.author_name || "Author",
            genre: item.genre || "Collection",
            slug: item.slug,
            excerpt: item.synopsis?.substring ? item.synopsis.substring(0, 160) + "..." : "Begin an epic journey...",
            coverColor: "bg-slate-900",
            coverImage: item.cover_image,
            type: "series"
          }));
          setSeries(formattedSeries as Story[]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setIsFetchingStories(false);
      }
    }
    fetchStories();
  }, [query]);

  const loading = authLoading || isFetchingStories;

  return (
    <div className="bg-white min-h-screen flex flex-col pt-32">
      <Header />
      
      <main className="container mx-auto px-6 md:px-12 space-y-16 flex-grow pb-16">
        {/* Header and Search */}
        <section className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-crimson">The Library</h1>
          <p className="text-crimson/80 text-lg font-light">
            Thousands of stories wait to be discovered. What will you read next?
          </p>
          
          <div className="relative flex items-center w-full mt-8">
            <SearchBar className="flex-grow" />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-4 p-4 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                showFilters 
                  ? "bg-crimson border-crimson text-white shadow-[0_4px_15px_rgba(153,0,0,0.3)]" 
                  : "bg-white border-crimson/20 text-crimson/70 hover:border-crimson hover:text-crimson"
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="bg-white border border-crimson/10 rounded-3xl p-6 shadow-sm overflow-hidden text-left"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-crimson uppercase tracking-widest mb-4">Rating</h4>
                    <div className="space-y-2">
                       {["All", "Mature (18+)", "Teen (13+)", "Everyone"].map(rating => (
                         <label key={rating} className="flex items-center space-x-3 text-sm text-crimson/70 cursor-pointer hover:text-crimson transition-colors">
                           <input type="radio" name="rating" className="accent-crimson w-4 h-4 cursor-pointer" defaultChecked={rating === "All"} />
                           <span>{rating}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-crimson uppercase tracking-widest mb-4">Length</h4>
                    <div className="space-y-2">
                       {["Any length", "Short Story (<10k)", "Novelette (10k-17k)", "Novella (17k-40k)", "Novel (40k+)"].map(len => (
                         <label key={len} className="flex items-center space-x-3 text-sm text-crimson/70 cursor-pointer hover:text-crimson transition-colors">
                           <input type="radio" name="length" className="accent-crimson w-4 h-4 cursor-pointer" defaultChecked={len === "Any length"} />
                           <span>{len}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-crimson uppercase tracking-widest mb-4">Status</h4>
                    <div className="space-y-2">
                       {["Any status", "Ongoing", "Completed", "Hiatus"].map(status => (
                         <label key={status} className="flex items-center space-x-3 text-sm text-crimson/70 cursor-pointer hover:text-crimson transition-colors">
                           <input type="radio" name="status" className="accent-crimson w-4 h-4 cursor-pointer" defaultChecked={status === "Any status"} />
                           <span>{status}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="space-y-20">
          {!query && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-crimson">Explore Genres</h2>
              </div>
              <GenreFilter />
            </section>
          )}

          {/* Search results or sections */}
          <div className="space-y-16">
            {(loading || series.length > 0) && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold text-crimson">The Epics <span className="text-xl font-medium text-crimson/60 ml-2 font-sans tracking-wide">(Series)</span></h2>
                  {!query && <button className="text-sm font-bold text-crimson/60 uppercase tracking-widest hover:text-crimson transition-colors">View All Epics</button>}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {loading ? (
                    <>
                      <StoryCardSkeleton />
                      <StoryCardSkeleton />
                    </>
                  ) : (
                    series.map(epic => (
                      <StoryCard 
                        key={epic.id} 
                        story={epic} 
                        variant="journey" 
                        onRequireAuth={() => setShowAuthGate(true)} 
                      />
                    ))
                  )}
                </div>
              </section>
            )}

            {(loading || standalones.length > 0) && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-bold text-crimson">Short Reads <span className="text-xl font-medium text-crimson/60 ml-2 font-sans tracking-wide">(Standalones)</span></h2>
                  {!query && <button className="text-sm font-bold text-crimson/60 uppercase tracking-widest hover:text-crimson transition-colors">See Latest</button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loading ? (
                    <>
                      <StoryCardSkeleton />
                      <StoryCardSkeleton />
                      <StoryCardSkeleton />
                      <StoryCardSkeleton />
                    </>
                  ) : (
                    standalones.map(story => (
                      <StoryCard 
                        key={story.id} 
                        story={story} 
                        variant="grid" 
                        onRequireAuth={() => setShowAuthGate(true)} 
                      />
                    ))
                  )}
                </div>
              </section>
            )}

            {!loading && query && series.length === 0 && standalones.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-6 bg-crimson/5 rounded-[3rem] border-2 border-dashed border-crimson/10 max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Inbox className="text-crimson/40" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-crimson mb-2">The archives remain silent</h2>
                <p className="text-crimson/60 font-medium">
                  No chronicles found matching "<span className="text-crimson">{query}</span>". 
                </p>
                <button 
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete("q");
                    window.history.pushState({}, '', `${window.location.pathname}`);
                    window.location.reload(); // Hard reload to clear query
                  }}
                  className="mt-8 text-sm font-bold uppercase tracking-widest text-crimson hover:underline"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <div className="mt-auto">
        <Footer />
      </div>

      <AuthGateModal isOpen={showAuthGate} onClose={() => setShowAuthGate(false)} />
    </div>
  );
}
