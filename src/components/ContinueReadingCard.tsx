"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ReadingProgress } from "@/types/reading";
import { useRouter } from "next/navigation";

interface ContinueReadingCardProps {
  record: ReadingProgress;
}

export default function ContinueReadingCard({ record }: ContinueReadingCardProps) {
  const router = useRouter();
  const isFinished = record.progress_percentage >= 95;
  const isSeries = !!record.series_id;
  const story = record.stories;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleResumeClick = async () => {
    if (isFinished && isSeries) {
      setLoadingNext(true);
      try {
        const { data, error } = await supabase
          .from("stories")
          .select("slug")
          .eq("series_id", record.series_id)
          .eq("chapter_number", (story.chapter_number || 0) + 1)
          .eq("is_published", true)
          .single();

        if (data) {
          router.push(`/stories/${data.slug}`);
          return;
        }
      } catch (err) {
        console.error("End of series or error:", err);
      } finally {
        setLoadingNext(false);
      }
    }
    router.push(`/stories/${story.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-crimson/5 shadow-[0_10px_40px_rgba(153,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(153,0,0,0.08)] transition-all duration-500 group flex flex-col md:flex-row gap-8 items-center md:items-stretch"
    >
      {/* Cover Image Container */}
      <div className="w-40 h-56 md:w-48 md:h-64 rounded-3xl overflow-hidden relative shadow-2xl flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500">
        {story.cover_image ? (
          <img
            src={story.cover_image}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-stone-900 flex items-center justify-center text-crimson/20">
            <BookOpen size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
        
        {/* Genre Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-crimson text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
            {story.genre}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between py-2 text-center md:text-left w-full">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-crimson font-black uppercase tracking-[0.3em] text-[10px]">
              {isSeries ? "Current Odyssey" : "Standalone Journey"}
            </p>
            {isSeries && story.series?.title ? (
              <div className="space-y-1">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight italic">
                  {story.series.title}
                </h2>
                <h3 className="text-lg md:text-xl font-serif font-medium text-crimson/60 italic">
                  Chapter {story.chapter_number}: {story.title}
                </h3>
              </div>
            ) : (
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight italic">
                {story.title}
              </h2>
            )}
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto md:mx-0">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Progress
              </span>
              <span className="text-[10px] font-black text-crimson uppercase tracking-widest">
                {Math.round(record.progress_percentage)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px] shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${record.progress_percentage}%` }}
                transition={{ duration: 2, ease: "circOut" }}
                className="h-full bg-crimson rounded-full shadow-[0_0_10px_rgba(153,0,0,0.3)]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 md:mt-0">
          <button
            onClick={handleResumeClick}
            disabled={loadingNext}
            className="w-full md:w-fit px-10 py-4 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-crimson hover:shadow-[0_15px_40px_rgba(153,0,0,0.2)] transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            {loadingNext ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{isFinished && isSeries ? "Read Next Chapter" : "Resume Reading"}</span>
                <ChevronRight size={18} className="translate-y-[1px]" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
