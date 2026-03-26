"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2, Save, Send, TextQuote } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";
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


export default function NewBlogPage() {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1: Metadata
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  
  // Editor
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title || !category) {
        alert("Please provide at least a title and category to proceed.");
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
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
            {step === 1 ? "Step 1: Blog Metadata" : "Step 2: Editorial Canvas"}
          </span>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg overflow-hidden whitespace-nowrap text-ellipsis self-center">
          <span className="font-serif font-bold text-slate-800 text-sm truncate">
            {title || "Untitled Editorial"}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {step === 2 && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-crimson bg-slate-50 hover:bg-crimson/5 rounded-full transition-colors hidden md:flex items-center whitespace-nowrap"
            >
              {isSaving ? <CheckCircle2 size={16} className="mr-2 text-green-500 shrink-0" /> : <Save size={16} className="mr-2 shrink-0" />}
              {isSaving ? "Saved" : "Save Draft"}
            </button>
          )}

          {step === 1 ? (
            <button onClick={handleNext} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all flex items-center shadow-md whitespace-nowrap shrink-0">
              Go to Canvas <ArrowRight size={16} className="ml-2 shrink-0" />
            </button>
          ) : (
            <button className="px-6 py-2 bg-crimson text-white text-sm font-bold rounded-full hover:bg-crimson-light transition-all flex items-center shadow-md shadow-crimson/20 hover:shadow-lg hover:shadow-crimson/30 whitespace-nowrap shrink-0">
              <Send size={16} className="mr-2 md:mr-2 shrink-0" />
              <span className="hidden md:block">Publish Blog</span>
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
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">Editorial Pulse</h1>
                  <p className="text-slate-500 font-medium">Prepare your latest blog or editorial piece for the Crimson Red audience.</p>
                </div>

                {/* Title Input */}
                <input 
                  type="text" 
                  placeholder="The captivating headline..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-4xl md:text-5xl font-serif font-bold text-slate-900 bg-transparent border-none placeholder-slate-300 focus:ring-0 focus:outline-none py-2"
                />

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2 flex items-center">
                    <TextQuote size={14} className="mr-1 text-crimson" /> Short Excerpt / Hook
                  </label>
                  <textarea 
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A two-sentence hook that captures the reader's attention on the blog listing page..." 
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select category...</option>
                      <option value="author-updates">Author Updates</option>
                      <option value="writing-advice">Writing Advice</option>
                      <option value="analysis">Literary Analysis</option>
                      <option value="announcements">Announcements</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Tags</label>
                    <input 
                      type="text" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. update, draft, tips" 
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all"
                    />
                  </div>
                </div>

                {/* Cover Image Upload Dropzone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Hero Image (16:9)</label>
                  <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-3xl bg-white hover:bg-slate-50 hover:border-crimson/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mb-3 group-hover:bg-crimson/10 group-hover:text-crimson group-hover:scale-110 transition-all">
                      <ImageIcon size={24} />
                    </div>
                    <p className="font-bold text-slate-700 text-sm">Click to upload blog header image</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Recommended size: 1920x1080 (Max 5MB)</p>
                  </div>
                </div>
                
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleBack} className="text-sm font-bold text-slate-500 hover:text-crimson flex items-center transition-colors group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Metadata
                  </button>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Editorial Canvas</label>
                </div>
                <TipTapEditor />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
