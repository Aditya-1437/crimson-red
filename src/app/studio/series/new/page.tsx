"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Layers } from "lucide-react";
import ImageUpload from "@/components/studio/ImageUpload";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Playfair_Display, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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

export default function NewSeriesPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);

  const handleCreateSeries = async () => {
    if (!title || !genre) {
      toast.error("Please provide at least a title and a genre for your series.");
      return;
    }

    setIsPublishing(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("You must be logged in to create a series.");
        setIsPublishing(false);
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { data, error } = await supabase.from('series').insert({
        title,
        slug,
        synopsis,
        genre,
        author_id: user.id,
        cover_image: coverImage || null,
      }).select().single();

      if (error) {
        if (error.code === '23505') {
          throw new Error("A series with this title/slug already exists.");
        }
        throw error;
      }

      toast.success("Series created successfully!", {
        className: "bg-crimson text-white border-none",
      });
      if (data && data.id) {
        router.push(`/studio/series/${data.id}`);
      } else {
        router.push("/studio");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while creating the series.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20 bg-[#F9F9F9]`}>
      {/* Top Utility Bar */}
      <header className="h-16 bg-white border-b border-crimson/10 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative w-full">
        <div className="flex items-center space-x-4">
          <Link href="/studio" className="flex items-center text-slate-500 hover:text-crimson transition-colors text-sm font-bold tracking-wide group shrink-0">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Studio
          </Link>
          <div className="h-4 w-px bg-slate-200 shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-crimson/50 hidden md:block shrink-0 flex items-center gap-2">
            <Layers size={14} /> New Series Engine
          </span>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg overflow-hidden whitespace-nowrap text-ellipsis self-center">
          <span className="font-serif font-bold text-slate-800 text-sm truncate">
            {title || "Untitled Series"}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={handleCreateSeries}
            disabled={isPublishing}
            className="px-6 py-2 bg-crimson text-white text-sm font-bold rounded-full hover:bg-crimson-light transition-all flex items-center shadow-md shadow-crimson/20 hover:shadow-lg hover:shadow-crimson/30 whitespace-nowrap shrink-0 disabled:opacity-75 disabled:cursor-not-allowed">
            <Send size={16} className="mr-2 md:mr-2 shrink-0" />
            <span className="hidden md:block">{isPublishing ? "Publishing..." : "Create Series"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto relative overflow-x-hidden">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-12 space-y-8"
            >
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Establish a Series</h1>
                <p className="text-slate-500 mt-2 font-medium">Define the core identity of your new saga. You can add chapters to it later.</p>
              </div>

              {/* Title Input */}
              <input 
                type="text" 
                placeholder="The Series Title..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 bg-transparent border-none placeholder-slate-300 focus:ring-0 focus:outline-none"
              />

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Genre Classification</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="" disabled>Select a genre...</option>
                    <option value="action">Action & Adventure</option>
                    <option value="noir">Noir Mystery</option>
                    <option value="romance">Dark Romance</option>
                    <option value="fantasy">High Fantasy</option>
                    <option value="thriller">Psychological Thriller</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Series Synopsis</label>
                  <textarea 
                    rows={6}
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Briefly describe what this entire series is about. This will be shown on the series landing page." 
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all resize-none shadow-sm"
                  />
                </div>
              </div>

              {/* Cover Image Upload Dropzone */}
              <div className="space-y-2 pt-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Series Cover Art (16:9)</label>
                <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
                  <ImageUpload 
                    currentImage={coverImage}
                    onUpload={setCoverImage}
                    onRemove={() => setCoverImage("")}
                  />
                </div>
              </div>
              
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
