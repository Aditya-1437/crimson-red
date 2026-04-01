"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2, Save, Send, BookOpen, Layers, Loader2 } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";
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

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [storyType, setStoryType] = useState<"single" | "series" | "">("single");
  
  // Form State
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  // Loading States
  const [fetching, setFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title || "");
        setGenre(data.genre || "");
        setContent(data.content || "");
        setCoverImage(data.cover_image || "");
        setIsPublished(data.is_published || false);
        // Tags are not currently in the physical schema based on NewStoryPage logic
        // setTags(data.tags || ""); 
        
        // Simple heuristic for story type if not explicitly stored
        // In a real app, 'story_type' would be a column
        if (data.chapter_number) {
          setStoryType("series");
        }
      }
    } catch (error: any) {
      console.error("Error fetching story:", error.message);
      toast.error("Failed to retrieve the chronicle");
      router.push("/studio/library");
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (shouldPublish: boolean = false) => {
    if (!title || !genre || !content) {
      toast.error("The chronicle requires a title, genre, and substance.");
      return;
    }

    setIsUpdating(true);
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { error } = await supabase
        .from('stories')
        .update({
          title,
          slug,
          genre,
          content,
          cover_image: coverImage || null,
          is_published: shouldPublish || isPublished,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(shouldPublish ? "Chronicle published to the world!" : "Chronicle updated in the archives", {
        className: "bg-crimson text-white border-none",
      });
      
      router.push("/studio/library");
    } catch (err: any) {
      toast.error(err.message || "The ink has failed to dry. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title || !genre) {
        toast.error("Please provide a title and genre.");
        return;
      }
      setStep(3); // Skipping specific chapter step for now as requested CRUD is basic
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(1);
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9F9]">
        <Loader2 className="w-12 h-12 text-crimson animate-spin mb-4" />
        <p className="text-slate-500 font-serif italic text-lg">Retrieving your manuscript...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20`}>
      {/* Top Utility Bar */}
      <header className="h-20 bg-white border-b border-crimson/10 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm relative w-full">
        <div className="flex items-center space-x-6">
          <Link href="/studio/library" className="flex items-center text-slate-500 hover:text-crimson transition-all text-sm font-bold tracking-widest group shrink-0 uppercase">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Library
          </Link>
          <div className="h-6 w-px bg-slate-200 shrink-0"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson/40 hidden md:block shrink-0">
            Editing Manuscript
          </span>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8 max-w-2xl overflow-hidden whitespace-nowrap text-ellipsis self-center">
          <span className="font-serif font-bold text-slate-900 text-lg truncate italic">
            {title || "Untitled Story"}
          </span>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <button 
            onClick={() => handleUpdate(false)}
            disabled={isUpdating}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-crimson bg-slate-50 hover:bg-crimson/5 rounded-full transition-all hidden md:flex items-center whitespace-nowrap border border-transparent hover:border-crimson/10"
          >
            {isUpdating ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
            Save Changes
          </button>

          <button 
            onClick={() => handleUpdate(true)}
            disabled={isUpdating}
            className="px-8 py-2.5 bg-crimson text-white text-sm font-bold rounded-full hover:bg-crimson-light transition-all flex items-center shadow-lg shadow-crimson/20 hover:shadow-crimson/30 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Send size={16} className="mr-2" />
            {isPublished ? "Update Live Version" : "Publish Story"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto bg-[#F9F9F9] relative overflow-x-hidden">
        <div className="max-w-5xl mx-auto py-16 px-8">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-12"
              >
                {/* Title Input */}
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="The Masterpiece Title..." 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 bg-transparent border-none placeholder-slate-200 focus:ring-0 focus:outline-none transition-all leading-tight"
                  />
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-crimson transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Genre Classification</label>
                        <select 
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-crimson/5 focus:border-crimson/20 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="" disabled>Select a genre...</option>
                          <option value="action">Action & Adventure</option>
                          <option value="noir">Noir Mystery</option>
                          <option value="romance">Dark Romance</option>
                          <option value="fantasy">High Fantasy</option>
                          <option value="thriller">Psychological Thriller</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Keywords</label>
                        <input 
                          type="text" 
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="worldbuilding, magic..." 
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-crimson/5 focus:border-crimson/20 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Story Type (Read Only for now) */}
                     <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-4">Manuscript Format</h3>
                        <div className="flex items-center gap-4 text-slate-500 italic">
                          {storyType === "series" ? <Layers size={20} className="text-crimson" /> : <BookOpen size={20} className="text-crimson" />}
                          <span className="font-medium">{storyType === "series" ? "This is part of a serialized collection." : "This is a standalone chronicle."}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Cover Art</label>
                    <ImageUpload 
                      currentImage={coverImage}
                      onUpload={setCoverImage}
                      onRemove={() => setCoverImage("")}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isPublished ? 'bg-green-500' : 'bg-amber-500 animation-pulse'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Status: {isPublished ? "Published" : "Scribbled Draft"}
                    </span>
                  </div>
                  <button 
                    onClick={handleNext} 
                    className="px-10 py-5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all flex items-center shadow-2xl group"
                  >
                    Open Story Canvas <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button onClick={handleBack} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-crimson flex items-center transition-all group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Metadata
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson">The Canvas</span>
                    <div className="w-12 h-0.5 bg-crimson/10"></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <TipTapEditor content={content} onChange={setContent} />
                </div>

                <div className="flex justify-center pt-8">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    Auto-save active in the archives
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
