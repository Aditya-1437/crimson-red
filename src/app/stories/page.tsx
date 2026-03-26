"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryCard, { Story } from "@/components/StoryCard";
import GenreFilter from "@/components/GenreFilter";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_STORIES: Story[] = [
  {
    id: "1",
    title: "The Obsidian Crown",
    author: "Elena Vance",
    genre: "Fantasy",
    excerpt: "A kingdom born of ash and shadow faces its first true test of succession. When the heir apparent gets mysteriously poisoned, the exiled sibling forms an unlikely alliance to reclaim the throne.",
    coverColor: "bg-stone-800",
    progress: 45,
    rank: 1,
    wordCount: "120k",
    likes: "14.2k",
    episodes: 42
  },
  {
    id: "2",
    title: "Neon Rain",
    author: "Marcus Thorne",
    genre: "Sci-Fi",
    excerpt: "In a city where memories are traded like currency, a disillusioned detective discovers a memory loop that shouldn't exist.",
    coverColor: "bg-indigo-900",
    progress: 80,
    rank: 2,
    wordCount: "95k",
    likes: "8.9k",
    episodes: 24
  },
  {
    id: "3",
    title: "A Study in Crimson",
    author: "Sarah Sterling",
    genre: "Mystery",
    excerpt: "London, 1891. A string of murders leaves the detectives baffled, until a peculiar consultant steps in.",
    coverColor: "bg-red-900",
    rank: 3,
    wordCount: "82k",
    likes: "12k",
    episodes: 31
  },
  {
    id: "4",
    title: "Whispers of the Deep",
    author: "Jonah Wright",
    genre: "Horror",
    excerpt: "An expedition to the Mariana Trench brings back something that shouldn't be alive.",
    coverColor: "bg-cyan-950",
    wordCount: "64k",
    likes: "5.1k",
    episodes: 18
  },
  {
    id: "5",
    title: "Empire of Dirt",
    author: "Maya Lin",
    genre: "Historical",
    excerpt: "The true story of the rebellion that brought an empire to its knees.",
    coverColor: "bg-amber-900",
    wordCount: "110k",
    likes: "9.3k",
    episodes: 36
  }
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Computed state
  const journeys = MOCK_STORIES.filter(s => s.progress);
  const trending = MOCK_STORIES.filter(s => s.rank).sort((a,b) => (a.rank || 0) - (b.rank || 0));
  const newReleases = MOCK_STORIES;

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
              {journeys.map(story => (
                <StoryCard key={story.id} story={story} variant="journey" />
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-crimson">The Rising Tide</h2>
              <span className="text-sm font-medium text-crimson/60">Updated hourly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trending.map(story => (
                <StoryCard key={story.id} story={story} variant="trending" />
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-crimson">Hall of Fame</h2>
              <button className="text-sm font-bold text-crimson/60 uppercase tracking-widest hover:text-crimson transition-colors">See the Legends</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newReleases.map(story => (
                <StoryCard key={story.id} story={story} variant="grid" />
              ))}
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
