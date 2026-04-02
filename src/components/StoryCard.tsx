"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Heart, Clock } from "lucide-react";

export interface Story {
  id: string;
  title: string;
  author: string;
  genre: string;
  excerpt: string;
  coverColor: string;
  coverImage?: string;
  slug: string;
  progress?: number;
  rank?: number;
  wordCount?: string;
  likes?: string;
  episodes?: number;
  type?: "story" | "series";
}

interface StoryCardProps {
  story: Story;
  variant?: "journey" | "trending" | "grid";
  onRequireAuth?: () => void;
}

export default function StoryCard({ story, variant = "grid", onRequireAuth }: StoryCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const destination = story.type === "series" ? `/series/${story.slug}` : `/stories/${story.slug}`;

  const handleReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push(destination);
    } else {
      if (onRequireAuth) onRequireAuth();
    }
  };

  if (variant === "journey") {
    return (
      <motion.div
        layoutId={`story-card-${story.id}`}
        className="w-full bg-white border border-crimson/10 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 hover:shadow-[0_10px_30px_rgba(153,0,0,0.08)] transition-shadow duration-300"
      >
        <div 
          className={`w-full md:w-32 h-40 rounded-xl flex-shrink-0 ${story.coverColor} shadow-inner bg-cover bg-center`}
          style={story.coverImage ? { backgroundImage: `url('${story.coverImage}')` } : undefined}
        ></div>
        <div className="flex-1 w-full space-y-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-crimson">{story.title}</h3>
            <p className="text-sm text-crimson/60 uppercase tracking-wider mt-1">{story.author}</p>
          </div>
          <p className="text-crimson/80 text-sm line-clamp-2">{story.excerpt}</p>
          <div className="w-full">
            <div className="flex justify-between text-xs text-crimson/60 mb-2 font-medium">
              <span>Continue Reading</span>
              <span>{story.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-crimson/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-crimson transition-all duration-500 ease-out"
                style={{ width: `${story.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleReadClick}
          className="mt-4 md:mt-0 w-full md:w-auto px-6 py-2 bg-crimson text-white rounded-full text-sm font-semibold tracking-wider hover:bg-crimson/90 transition-colors text-center whitespace-nowrap"
        >
          {story.type === "series" ? "Start Series" : "Continue"}
        </button>
      </motion.div>
    );
  }

  if (variant === "trending") {
    return (
      <motion.div
        layoutId={`story-card-${story.id}`}
        className="relative group bg-white border border-crimson/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(153,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1"
      >
        <div 
          className={`h-48 w-full ${story.coverColor} bg-cover bg-center`}
          style={story.coverImage ? { backgroundImage: `url('${story.coverImage}')` } : undefined}
        ></div>
        <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-crimson/10">
          <span className="font-serif font-bold text-crimson text-lg">{story.rank}</span>
        </div>
        <div className="p-6">
          <span className="text-xs font-bold text-crimson/50 uppercase tracking-widest">{story.genre}</span>
          <h3 className="text-xl font-serif font-semibold text-crimson mt-2 mb-1">{story.title}</h3>
          <p className="text-sm text-crimson/60">{story.author}</p>
          <p className="text-crimson/80 text-sm line-clamp-2 mt-4">{story.excerpt}</p>
          <button 
            onClick={handleReadClick}
            className="inline-block mt-6 text-sm font-bold text-crimson tracking-wider uppercase hover:text-crimson-light transition-colors text-left"
          >
            {story.type === "series" ? "View Epic \u2192" : "Read Now \u2192"}
          </button>
        </div>
      </motion.div>
    );
  }

  // default grid variant (Hall of Fame)
  return (
    <motion.div
      layoutId={`story-card-${story.id}`}
      className="relative group bg-white rounded-xl border border-crimson/10 overflow-hidden hover:shadow-[0_10px_30px_rgba(153,0,0,0.08)] transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      <div 
        className={`h-32 w-full ${story.coverColor} bg-cover bg-center`}
        style={story.coverImage ? { backgroundImage: `url('${story.coverImage}')` } : undefined}
      ></div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-serif font-semibold text-crimson line-clamp-1">{story.title}</h3>
        <p className="text-xs text-crimson/60 uppercase tracking-wider mt-1 mb-3">{story.author}</p>
        <p className="text-crimson/80 text-sm line-clamp-3 mb-4 flex-1">{story.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs text-crimson/60 pt-4 border-t border-crimson/5 mt-auto">
          <div className="flex items-center space-x-1">
            <BookOpen size={14} />
            <span>{story.wordCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart size={14} />
            <span>{story.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{story.episodes} Ep</span>
          </div>
        </div>
      </div>
      <button onClick={handleReadClick} className="absolute inset-0 z-10">
        <span className="sr-only">View {story.title}</span>
      </button>
    </motion.div>
  );
}
