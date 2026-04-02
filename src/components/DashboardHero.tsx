"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import ContinueReadingCard from "./ContinueReadingCard";
import { ReadingProgress } from "@/types/reading";
import { StoryCardSkeleton } from "./ui/Skeletons";
import StoryCard, { Story } from "./StoryCard";

interface DashboardHeroProps {
  onRequireAuth: () => void;
}

export default function DashboardHero({ onRequireAuth }: DashboardHeroProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadingProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Fetch reading progress
        const { data: rawHistory, error: historyError } = await supabase
          .from("reading_progress")
          .select(`
            *,
            stories!inner (
              *,
              series:series_id (*)
            )
          `)
          .eq("user_id", user.id)
          .order("last_read_at", { ascending: false });

        if (historyError) throw historyError;

        // 2. Deduplicate by series
        const uniqueReads: ReadingProgress[] = [];
        const seenSeriesIds = new Set<string>();

        if (rawHistory && rawHistory.length > 0) {
          for (const record of rawHistory) {
            const series_id = (record as any).series_id;
            if (!series_id) {
              uniqueReads.push(record as any);
              continue;
            }
            if (!seenSeriesIds.has(series_id)) {
              seenSeriesIds.add(series_id);
              uniqueReads.push(record as any);
            }
          }
        }

        if (uniqueReads.length > 0) {
          setHistory(uniqueReads.slice(0, 3)); // Show top 3 unique reads
        } else {
          // 3. Fetch recommendations if history is empty
          const { data: recs, error: recsError } = await supabase
            .from("stories")
            .select("*")
            .eq("is_published", true)
            .is("series_id", null) // Only standalones for recommendations
            .order("created_at", { ascending: false })
            .limit(4);

          if (recsError) throw recsError;
          
          if (recs) {
            setRecommendations(recs.map(r => ({
              id: r.id,
              title: r.title,
              author: r.author_name || "Author",
              genre: r.genre || "Fiction",
              slug: r.slug,
              excerpt: r.content?.substring(0, 120) + "...",
              coverColor: "bg-stone-900",
              coverImage: r.cover_image,
              type: "story"
            } as any)));
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-white pt-32">
        <div className="container mx-auto px-6 md:px-12">
            <div className="h-10 w-64 bg-slate-100 rounded-full animate-pulse mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <StoryCardSkeleton />
              <StoryCardSkeleton />
              <StoryCardSkeleton />
            </div>
        </div>
      </section>
    );
  }

  const isVeteran = history.length > 0;

  return (
    <section className="py-20 md:py-28 bg-white pt-32 selection:bg-crimson/10">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-16"
        >
          <span className="text-crimson font-black tracking-[0.4em] uppercase text-[10px] mb-4 block px-4 py-2 bg-crimson/5 border border-crimson/10 rounded-full w-fit">
            {isVeteran ? "Welcome back, Reader" : "Your Journey Begins"}
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-slate-900 leading-tight italic">
            {isVeteran ? "Continue your journey..." : "Welcome to the Archives."}
          </h2>
          {!isVeteran && (
            <p className="mt-4 text-slate-500 font-medium italic">
              New to the sanctuary? Start with these hand-picked legends.
            </p>
          )}
        </motion.div>

        {isVeteran ? (
          <div className="space-y-12">
            {history.map((record) => (
              <ContinueReadingCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StoryCard story={story} onRequireAuth={onRequireAuth} variant="grid" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
