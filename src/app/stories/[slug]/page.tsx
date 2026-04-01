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
    .select('*')
    .eq('slug', slug)
    .single();

  console.log("Supabase result — story:", story?.title ?? null, "error:", error?.message ?? null);

  // If not found or error, show the themed 404 page
  if (error || !story) {
    notFound();
  }

  return (
    <div className={`bg-white min-h-screen flex flex-col ${merriweather.variable} selection:bg-crimson/20`}>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-crimson/10 py-3 md:py-0 md:h-[72px]">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <Breadcrumbs 
            items={[
              { label: "Library", href: "/stories" },
              { label: story.title as string }
            ]} 
          />
          
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
            <Link href="/stories" className="flex items-center space-x-3 text-crimson/60 hover:text-crimson font-black tracking-[0.2em] uppercase text-[10px] transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Return to Library</span>
            </Link>
            
            <div className="flex items-center space-x-4">
               {/* Future pagination or sharing buttons */}
            </div>
          </div>
        </article>
      </main>

      {/* Discussion & Footer */}
      <div className="bg-white">
        <CommentSection />
        <Footer />
      </div>
    </div>
  );
}
