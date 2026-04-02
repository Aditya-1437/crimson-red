"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to track reading progress and time spent on a specific story.
 * Syncs data with Supabase every 30 seconds and on component unmount.
 */
export function useReadingTracker(storyId: string, seriesId?: string | null) {
  const { user } = useAuth();
  const [timeSpent, setTimeSpent] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs to store current values for background sync (avoiding stale closures in setInterval)
  const timeSpentRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const lastSyncedTimeRef = useRef(0);

  // Sync helper function
  const syncProgress = async (finalData?: { time: number, scroll: number }) => {
    if (!user || !storyId) return;

    const t = finalData ? finalData.time : timeSpentRef.current;
    const s = finalData ? finalData.scroll : scrollProgressRef.current;

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const secondsSinceLastSync = t - lastSyncedTimeRef.current;

      // Parallel sync: 1. Main reading progress, 2. Daily aggregate log
      await Promise.all([
        supabase.from('reading_progress').upsert({
          user_id: user.id,
          story_id: storyId,
          series_id: seriesId || null,
          progress_percentage: Math.round(s),
          time_spent_seconds: t,
          last_read_at: new Date().toISOString()
        }, { onConflict: 'user_id, story_id' }),
        
        // Only increment if there's actual new time logged
        ...(secondsSinceLastSync > 0 ? [
          supabase.rpc('increment_daily_reading_time', {
            p_user_id: user.id,
            p_read_date: today,
            p_seconds_to_add: secondsSinceLastSync
          })
        ] : [])
      ]);

      lastSyncedTimeRef.current = t;
    } catch (err) {
      console.error("Heartbeat: Progress synchronization failed", err);
    }
  };

  // 1. Scroll Reading Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const storyElement = document.querySelector('article');
      if (!storyElement) return;

      const rect = storyElement.getBoundingClientRect();
      const elementHeight = rect.height;
      const elementTop = rect.top;
      
      // Calculate how much of the article has passed the bottom of the viewport
      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = elementHeight - window.innerHeight;
      
      if (totalScrollable <= 0) {
        setScrollProgress(100);
        scrollProgressRef.current = 100;
        return;
      }

      const progress = (scrolled / totalScrollable) * 100;
      const cappedProgress = Math.min(100, Math.max(0, progress));
      
      setScrollProgress(cappedProgress);
      scrollProgressRef.current = cappedProgress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Active Session Timer (Heartbeat)
  useEffect(() => {
    const timer = setInterval(() => {
      // We only increment if the tab is visible to prevent inflating metrics
      if (document.visibilityState === "visible") {
        setTimeSpent(prev => {
          const next = prev + 1;
          timeSpentRef.current = next;
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 3. Periodic Database Synchronization
  useEffect(() => {
    if (!user) return;

    // Set up 30-second persistence interval
    const syncInterval = setInterval(() => {
      syncProgress();
    }, 30000);

    // Final persistent sync on unmount
    return () => {
      clearInterval(syncInterval);
      syncProgress({ time: timeSpentRef.current, scroll: scrollProgressRef.current });
    };
  }, [user, storyId]);

  return { timeSpent, scrollProgress };
}
