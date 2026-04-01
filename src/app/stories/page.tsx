"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCard, { Story } from "@/components/StoryCard";
import GenreFilter from "@/components/GenreFilter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { StoryCardSkeleton } from "@/components/ui/Skeletons";



export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [isFetchingStories, setIsFetchingStories] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            author: item.author_name || "Author",
            genre: item.genre || "Fiction",
            slug: item.slug,
            excerpt: item.content?.substring ? item.content.substring(0, 160) + "..." : "A new story awaits...",
            coverColor: "bg-stone-900"
          }));
          setStories(formatted as Story[]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setIsFetchingStories(false);
      }
    }
    fetchStories();
  }, []);

  const loading = authLoading || isFetchingStories;

  // Computed state
  const journeys = stories;
  const trending = stories;
  const newReleases = stories;

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
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson/40" size={20} />
              <input 
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-crimson/20 rounded-full py-4 pl-14 pr-6 text-crimson placeholder:text-crimson/30 outline-none transition-all duration-300 focus:border-crimson focus:ring-4 focus:ring-crimson/10 focus:shadow-[0_0_20px_rgba(153,0,0,0.15)]"
              />
            </div>
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
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-crimson">Explore Genres</h2>
            </div>
            <GenreFilter />
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-crimson">Your Journey</h2>
              <button className="text-sm font-bold text-crimson/60 uppercase tracking-widest hover:text-crimson transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <StoryCardSkeleton />
                  <StoryCardSkeleton />
                </>
              ) : (
                journeys.map(story => (
                  <StoryCard key={story.id} story={story} variant="journey" />
                ))
              )}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-crimson">The Rising Tide</h2>
              <span className="text-sm font-medium text-crimson/60">Updated hourly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <>
                  <StoryCardSkeleton />
                  <StoryCardSkeleton />
                  <StoryCardSkeleton />
                </>
              ) : (
                trending.map(story => (
                  <StoryCard key={story.id} story={story} variant="trending" />
                ))
              )}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-crimson">Hall of Fame</h2>
              <button className="text-sm font-bold text-crimson/60 uppercase tracking-widest hover:text-crimson transition-colors">See the Legends</button>
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
                newReleases.map(story => (
                  <StoryCard key={story.id} story={story} variant="grid" />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
