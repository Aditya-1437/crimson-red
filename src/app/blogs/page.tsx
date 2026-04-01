"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import { useAuth } from "@/context/AuthContext";
import { BlogRowSkeleton } from "@/components/ui/Skeletons";

const MOCK_BLOGS: BlogPost[] = [
  {
    id: "world-building-part-1",
    category: "World Building",
    title: "Designing the Obsidian Crown: The Anatomy of a Fallen Empire",
    excerpt: "The first steps in creating a believable fallen empire. We discuss map drafting, political faction lore, and the magic system behind the throne.",
    author: "Admin",
    date: "Oct 12, 2026",
    readTime: "8 min read",
    imageUrl: "bg-stone-800"
  },
  {
    id: "author-interview",
    category: "Behind the Scenes",
    title: "A Conversation with Sarah Sterling: Murder in 1891",
    excerpt: "Sarah Sterling sits down with us to discuss the research and historical accuracy required to write 'A Study in Crimson'.",
    author: "Admin",
    date: "Sep 28, 2026",
    readTime: "12 min read",
    imageUrl: "bg-red-950"
  },
  {
    id: "announcement-new-feature",
    category: "Announcements",
    title: "Crimson Red V2: The Reading Experience Transformed",
    excerpt: "Today, we roll out our new Reader Sanctuary. A clutter-free, immersive reading mode with typography that practically bleeds ink.",
    author: "Admin",
    date: "Sep 15, 2026",
    readTime: "4 min read"
  },
  {
    id: "world-building-magic",
    category: "World Building",
    title: "Hard vs Soft Magic: Where Does Neon Rain Fall?",
    excerpt: "Memories as currency. How the cyberpunk aesthetic of Neon Rain relies on a strictly defined 'hard' magic system.",
    author: "Admin",
    date: "Aug 30, 2026",
    readTime: "6 min read",
    imageUrl: "bg-indigo-950"
  },
  {
    id: "writing-tips-1",
    category: "Behind the Scenes",
    title: "Pacing Your Serial: How to Keep Readers Hooked",
    excerpt: "Writing episodic fiction is fundamentally different from drafting a monolithic novel. Let's look at the mathematics of suspense.",
    author: "Admin",
    date: "Aug 10, 2026",
    readTime: "7 min read"
  }
];

const CATEGORIES = ["All", "Behind the Scenes", "World Building", "Announcements"];

export default function EditorialBlog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { loading } = useAuth();

  const filteredBlogs = MOCK_BLOGS.filter(blog => {
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-crimson/20">
      <Header />
      
      <main className="flex-grow pt-[80px]">
        {/* Featured Post Hero */}
        <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] flex flex-col justify-between bg-stone-900 overflow-hidden">
          {/* Parallax Image Background (Mocked with CSS gradient for now) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 z-0"></div>
          <div 
            className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay z-0"
            style={{ transform: "translateZ(-1px) scale(1.5)" }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-6 md:p-12 pb-0 opacity-80 h-1/3 flex items-start justify-center">
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center text-white px-6">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-xl text-white">
              The Crimson Journal
            </h1>
            <p className="text-white/70 font-medium tracking-widest text-sm md:text-base uppercase mb-16">
              Dispatches from the inkwell
            </p>
          </div>

          <div className="relative z-10 w-full bg-gradient-to-t from-black to-transparent pt-32 pb-12 px-6 md:px-12 mt-auto">
            <div className="container mx-auto max-w-5xl">
              <span className="text-crimson font-bold tracking-widest uppercase text-xs mb-4 block">Featured Editorial</span>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                    The Art of Slow Burn: Rebuilding the Modern Serial
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl font-light line-clamp-2 leading-relaxed">
                    Why we decided to step away from algorithmic feeds and fast-food fiction, to build a sanctuary for stories that demand your full attention.
                  </p>
                </div>
                <button className="flex-shrink-0 bg-crimson hover:bg-white hover:text-crimson text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(153,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)]">
                  Read Article
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="sticky top-[72px] md:top-[88px] z-30 bg-white/95 backdrop-blur-md border-b border-crimson/10 shadow-sm py-4">
          <div className="container mx-auto px-6 md:px-12 flex items-center justify-between min-h-[48px]">
            {/* Sub-nav */}
            <div className={`flex items-center space-x-1 sm:space-x-4 overflow-x-auto hide-scrollbar transition-all duration-300 ${isSearchOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-full opacity-100'}`}>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors ${
                    activeCategory === category 
                      ? "text-crimson bg-crimson/5" 
                      : "text-crimson/50 hover:text-crimson hover:bg-crimson/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Expanding Search */}
            <div className="flex items-center ml-4">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 250, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border-b-2 border-crimson/20 py-2 px-1 text-crimson placeholder:text-crimson/30 outline-none transition-colors focus:border-crimson text-sm font-medium"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (isSearchOpen) setSearchQuery("");
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full text-crimson hover:bg-crimson/5 transition-colors flex-shrink-0"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
          </div>
        </section>

        {/* The Masonry Feed (CSS Grid approximation) */}
        <section className="container mx-auto px-6 md:px-12 py-16 md:py-24 min-h-[50vh]">
          {loading ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              <BlogRowSkeleton />
              <BlogRowSkeleton />
              <BlogRowSkeleton />
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredBlogs.map((blog, index) => (
                <BlogCard key={blog.id} post={blog} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-crimson/50 text-xl font-serif">No articles found in the archives.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
