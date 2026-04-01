"use client";

import { useReadingTracker } from "@/hooks/useReadingTracker";

interface ReaderHeartbeatProps {
  storyId: string;
  seriesId?: string | null;
}

/**
 * A headless component that activates the Reading Heartbeat tracker.
 * This is placed inside the server-side ReaderSanctuary page to enable
 * client-side progressive synchronization.
 */
export default function ReaderHeartbeat({ storyId, seriesId }: ReaderHeartbeatProps) {
  // Activate the tracker hook
  useReadingTracker(storyId, seriesId);

  // This component doesn't render any UI; it's purely for the side effect.
  return null;
}
