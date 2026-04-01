import { Merriweather } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import CommentSection from "@/components/CommentSection";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import StoryRenderer from "@/components/StoryRenderer";
import { notFound } from "next/navigation";
import LoadingButton from "@/components/ui/LoadingButton";
import ReaderHeartbeat from "@/components/ReaderHeartbeat";

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

interface ReaderSanctuaryProps {
  params: Promise<{ slug: string }>;
}

export default async function ReaderSanctuary({ params }: ReaderSanctuaryProps) {
  const { slug } = await params;
  console.log("Fetching from DB for slug:", slug);

  // Use a server-side client to correctly honour RLS policies
  const supabase = await createSupabaseServerClient();

  const { data: story, error } = await supabase
    .from('stories')
    .select('*, series:series_id(title, slug)')
    .eq('slug', slug)
    .single();

  console.log("Supabase result — story:", story?.title ?? null, "error:", error?.message ?? null);

  // If not found or error, show the themed 404 page
  if (error || !story) {
    notFound();
  }

  // Fetch adjacent chapters if it's part of a series
  let prevChapter = null;
  let nextChapter = null;

  if (story.series_id && story.chapter_number) {
    const { data: prevData } = await supabase
      .from('stories')
      .select('slug, title')
      .eq('series_id', story.series_id)
      .eq('chapter_number', story.chapter_number - 1)
      .single();
    prevChapter = prevData;

    const { data: nextData } = await supabase
      .from('stories')
      .select('slug, title')
      .eq('series_id', story.series_id)
      .eq('chapter_number', story.chapter_number + 1)
      .single();
    nextChapter = nextData;
  }

  return (
    <div className={`bg-white min-h-screen flex flex-col ${merriweather.variable} selection:bg-crimson/20`}>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-crimson/10 py-3 md:py-0 md:h-[72px]">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center">
            {story.series ? (
              <Link href={`/series/${story.series.slug}`} className="flex items-center space-x-2 text-crimson/60 hover:text-crimson font-black tracking-[0.1em] uppercase text-xs transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to {story.series.title}</span>
              </Link>
            ) : (
              <Breadcrumbs 
                items={[
                  { label: "Library", href: "/stories" },
                  { label: story.title as string }
                ]} 
              />
            )}
          </div>
          
          <div className="hidden md:flex flex-col items-center">
            <h1 className="font-serif font-bold text-crimson text-lg">{story.title}</h1>
            <span className="text-xs text-crimson/60 uppercase tracking-widest mt-0.5">{story.genre}</span>
          </div>
          
          <div className="text-sm font-semibold text-crimson/80 tracking-widest uppercase">
            READING <span className="text-crimson/40">MODE</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="pt-2 md:pt-0">
        <ProgressBar />
      </div>

      {/* The Reading Canvas */}
      <main className="flex-grow pt-40 md:pt-32 px-6">
        <article className="max-w-3xl mx-auto pb-24">
          {/* Metadata & Cover */}
          <div className="mb-20 text-center">
            {story.cover_image && (
              <div className="relative mb-12 group">
                <img 
                  src={story.cover_image} 
                  alt={story.title} 
                  className="w-full h-64 md:h-[450px] object-cover rounded-[2.5rem] shadow-2xl shadow-crimson/10 transition-transform duration-700 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-crimson/10"></div>
              </div>
            )}
            
            <div className="inline-block px-4 py-1.5 rounded-full bg-crimson/5 border border-crimson/10 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson">{story.genre}</span>
            </div>
            
            <h1 className="font-serif font-bold text-crimson text-4xl md:text-7xl mb-6 leading-[1.1] tracking-tight italic">
              {story.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-crimson/40 mb-12">
              <div className="w-12 h-px bg-current"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] italic">A Crimson Chronicle</span>
              <div className="w-12 h-px bg-current"></div>
            </div>
          </div>

          {/* Story Content */}
          <div className="bg-white">
            <StoryRenderer content={story.content} />
          </div>

          {/* Post-Reading Actions */}
          <div className="mt-32 flex flex-col md:flex-row justify-between items-center border-t border-crimson/10 pt-16 gap-8">
            <LoadingButton 
              href="/stories" 
              loadingText="Returning..."
              className="flex items-center space-x-3 text-crimson/60 hover:text-crimson font-black tracking-[0.2em] uppercase text-[10px] transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Return to Library</span>
            </LoadingButton>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto items-center space-y-4 md:space-y-0 md:space-x-4">
               {prevChapter && (
                 <LoadingButton 
                   href={`/stories/${prevChapter.slug}`} 
                   loadingText="Flipping Back..."
                   className="w-full md:w-40 px-8 py-3 border-2 border-crimson/20 text-crimson text-xs uppercase tracking-[0.2em] font-black rounded-full hover:border-crimson hover:bg-crimson/5 transition-all text-center"
                 >
                   &larr; Prev
                 </LoadingButton>
               )}
               {nextChapter && (
                 <LoadingButton 
                   href={`/stories/${nextChapter.slug}`} 
                   loadingText="Next Page..."
                   className="w-full md:w-40 px-8 py-3 bg-crimson text-white text-xs uppercase tracking-[0.2em] font-black rounded-full hover:bg-crimson-light transition-all shadow-xl shadow-crimson/20 hover:shadow-crimson/30 hover:scale-[1.02] active:scale-[0.98] text-center"
                 >
                   Next &rarr;
                 </LoadingButton>
               )}
            </div>
          </div>
        </article>
      </main>

      {/* Discussion & Footer */}
      <div className="bg-white">
        <CommentSection />
        <Footer />
      </div>

      {/* Persistence Heartbeat */}
      <ReaderHeartbeat storyId={story.id} seriesId={story.series_id} />
    </div>
  );
}
