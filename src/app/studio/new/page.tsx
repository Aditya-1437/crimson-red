"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2, Save, Send, BookOpen, Layers } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";
import ImageUpload from "@/components/studio/ImageUpload";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Playfair_Display, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

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


export default function NewStoryPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [storyType, setStoryType] = useState<"single" | "series" | "">("");
  
  // Step 1
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  
  // Step 2
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [seriesSynopsis, setSeriesSynopsis] = useState("");
  
  // Editor
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!title || !genre || !content) {
      toast.error("Please fill in all required fields (title, genre, and content).");
      return;
    }

    setIsPublishing(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error("You must be logged in to publish a story.");
        setIsPublishing(false);
        return;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { error } = await supabase.from('stories').insert({
        title,
        slug,
        genre,
        content: content, 
        author_id: user.id,
        is_published: true,
        cover_image: coverImage || null,
      });

      if (error) {
        if (error.code === '23505') {
          throw new Error("A story with this title/slug already exists.");
        }
        throw error;
      }

      toast.success("Story published successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title || !storyType || !genre) {
        alert("Please fill in the title, genre, and select a story type.");
        return;
      }
      if (storyType === "series") {
        setStep(2);
      } else {
        setStep(3); // Skip chapter logic and go straight to editor
      }
    } else if (step === 2) {
      if (!chapterNumber || !chapterTitle) {
        alert("Please provide the chapter number and title.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(storyType === "series" ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20`}>
      {/* Top Utility Bar */}
      <header className="h-16 bg-white border-b border-crimson/10 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm relative w-full">
        <div className="flex items-center space-x-4">
          <Link href="/studio" className="flex items-center text-slate-500 hover:text-crimson transition-colors text-sm font-bold tracking-wide group shrink-0">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Exit
          </Link>
          <div className="h-4 w-px bg-slate-200 shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-crimson/50 hidden md:block shrink-0">
            {step === 1 ? "Step 1: Story Details" : step === 2 ? "Step 2: Chapter Details" : "Step 3: Writing"}
          </span>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg overflow-hidden whitespace-nowrap text-ellipsis self-center">
          <span className="font-serif font-bold text-slate-800 text-sm truncate">
            {title || "Untitled Story"}
            {step === 3 && storyType === "series" ? ` - Ch ${chapterNumber}: ${chapterTitle}` : ""}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {step === 3 && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-crimson bg-slate-50 hover:bg-crimson/5 rounded-full transition-colors hidden md:flex items-center whitespace-nowrap"
            >
              {isSaving ? <CheckCircle2 size={16} className="mr-2 text-green-500 shrink-0" /> : <Save size={16} className="mr-2 shrink-0" />}
              {isSaving ? "Saved" : "Save Draft"}
            </button>
          )}

          {step < 3 ? (
            <button onClick={handleNext} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all flex items-center shadow-md whitespace-nowrap shrink-0">
              Next Step <ArrowRight size={16} className="ml-2 shrink-0" />
            </button>
          ) : (
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2 bg-crimson text-white text-sm font-bold rounded-full hover:bg-crimson-light transition-all flex items-center shadow-md shadow-crimson/20 hover:shadow-lg hover:shadow-crimson/30 whitespace-nowrap shrink-0 disabled:opacity-75 disabled:cursor-not-allowed">
              <Send size={16} className="mr-2 md:mr-2 shrink-0" />
              <span className="hidden md:block">{isPublishing ? "Publishing..." : "Publish"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto bg-[#F9F9F9] relative overflow-x-hidden">
        <div className="max-w-4xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-12 space-y-8"
              >
                {/* Title Input */}
                <input 
                  type="text" 
                  placeholder="The Masterpiece Title..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 bg-transparent border-none placeholder-slate-300 focus:ring-0 focus:outline-none"
                />

                {/* Story Type Toggle */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Story Format</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setStoryType("single")}
                      className={`flex items-start p-6 rounded-2xl border-2 text-left transition-all ${storyType === "single" ? "border-crimson bg-crimson/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                    >
                      <div className={`p-3 rounded-full mr-4 ${storyType === "single" ? "bg-crimson text-white shadow-md shadow-crimson/20" : "bg-slate-100 text-slate-500"}`}>
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${storyType === "single" ? "text-crimson" : "text-slate-700"}`}>Single Read</h3>
                        <p className="text-sm text-slate-500 mt-1 font-medium">A standalone story, short story, or novella complete in one part.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setStoryType("series")}
                      className={`flex items-start p-6 rounded-2xl border-2 text-left transition-all ${storyType === "series" ? "border-crimson bg-crimson/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                    >
                      <div className={`p-3 rounded-full mr-4 ${storyType === "series" ? "bg-crimson text-white shadow-md shadow-crimson/20" : "bg-slate-100 text-slate-500"}`}>
                        <Layers size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${storyType === "series" ? "text-crimson" : "text-slate-700"}`}>Series</h3>
                        <p className="text-sm text-slate-500 mt-1 font-medium">An ongoing book or serial with multiple chapters or volumes.</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Genre Classification</label>
                    <select 
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a genre...</option>
                      <option value="action">Action & Adventure</option>
                      <option value="noir">Noir Mystery</option>
                      <option value="romance">Dark Romance</option>
                      <option value="fantasy">High Fantasy</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Tags / Keywords</label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. worldbuilding, magic, thriller" 
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                    />
                  </div>
                </div>

                {/* Cover Image Upload Dropzone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Cover Art (16:9)</label>
                  <ImageUpload 
                    currentImage={coverImage}
                    onUpload={setCoverImage}
                    onRemove={() => setCoverImage("")}
                  />
                </div>
                
              </motion.div>
            )}

            {step === 2 && storyType === "series" && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-12 space-y-8"
              >
                <div className="mb-8">
                  <button onClick={handleBack} className="text-sm font-bold text-slate-500 hover:text-crimson flex items-center transition-colors mb-4 group w-max">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Story Details
                  </button>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Chapter Details</h1>
                  <p className="text-slate-500 mt-2 font-medium">Let's set up the specifics for this new chapter in your series.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Ch. Number</label>
                    <input 
                      type="number"
                      min="1"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      placeholder="e.g. 1" 
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                    />
                  </div>

                  <div className="space-y-2 col-span-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Chapter Title</label>
                    <input 
                      type="text" 
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      placeholder="e.g. The Boy Who Lived" 
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Series Synopsis (Optional)</label>
                  <textarea 
                    rows={4}
                    value={seriesSynopsis}
                    onChange={(e) => setSeriesSynopsis(e.target.value)}
                    placeholder="Briefly describe what this entire series is about. You can change this later." 
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="text-sm font-bold text-slate-500 hover:text-crimson flex items-center transition-colors group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Story Canvas</label>
                </div>
                <TipTapEditor content={content} onChange={setContent} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
