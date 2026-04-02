export interface ReadingProgress {
  id: string;
  progress_percentage: number;
  time_spent_seconds: number;
  last_read_at: string;
  story_id: string;
  series_id: string | null;
  stories: {
    id: string;
    title: string;
    slug: string;
    genre: string;
    cover_image: string | null;
    chapter_number: number;
    series?: {
      title: string;
      slug: string;
    } | null;
  };
  series_stats?: {
    completed_chapters: number;
    total_chapters: number;
    remaining_minutes: number;
  };
  estimated_minutes?: number;
}
