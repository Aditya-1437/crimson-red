import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingButton from "@/components/ui/LoadingButton";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-inter" });

export default async function SeriesHub({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch Series
  const { data: series, error: seriesError } = await supabase
    .from('series')
    .select('*')
    .eq('slug', slug)
    .single();

  if (seriesError || !series) {
    notFound();
  }

  // Fetch Chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('stories')
    .select('id, title, slug, chapter_number, created_at, is_published')
    .eq('series_id', series.id)
    .eq('is_published', true)
    .order('chapter_number', { ascending: true });

  return (
    <div className={`bg-[#F9F9F9] min-h-screen flex flex-col pt-32 ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20`}>
      <Header />
      
      <main className="container mx-auto px-6 md:px-12 flex-grow pb-32 max-w-5xl">
        
        {/* Cover Art and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto mb-24 items-center">
          {/* Left Column: Cover */}
          <div className="order-2 md:order-1">
            {series.cover_image ? (
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:ml-0 rounded-[2.5rem] shadow-2xl shadow-crimson/10 overflow-hidden border border-crimson/10 group">
                <img 
                  src={series.cover_image} 
                  alt={series.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/5"></div>
              </div>
            ) : (
              <div className="aspect-[3/4] w-full max-w-md mx-auto md:ml-0 rounded-[2.5rem] bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-slate-400 font-serif italic">No Cover Available</span>
              </div>
            )}
          </div>

          {/* Right Column: Metadata */}
          <div className="order-1 md:order-2 text-center md:text-left space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-crimson/5 border border-crimson/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson">{series.genre || "Series"}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-[1.1] italic">
              {series.title}
            </h1>
            
            {series.synopsis && (
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                {series.synopsis}
              </p>
            )}
          </div>
        </div>

        {/* Chapters */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 italic">Table of Contents</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
            <span className="text-xs font-sans font-bold text-crimson bg-crimson/5 border border-crimson/10 px-4 py-2 rounded-full uppercase tracking-widest">
              {chapters?.length || 0} Published
            </span>
          </div>

          <div className="space-y-4">
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter) => (
                <LoadingButton 
                  href={`/stories/${chapter.slug}`} 
                  key={chapter.id} 
                  loadingText="Opening Chapter..."
                  className="block w-full text-left group transition-all"
                >
                  <div className="w-full p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-crimson/5 hover:border-crimson/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-crimson/60 group-hover:text-crimson transition-colors">
                        Chapter {chapter.chapter_number}
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-slate-800 group-hover:text-black transition-colors">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 group-hover:bg-crimson group-hover:text-white text-slate-400 transition-colors shrink-0">
                      <span className="text-xl leading-none">&rarr;</span>
                    </div>
                  </div>
                </LoadingButton>
              ))
            ) : (
              <div className="p-12 bg-white rounded-[2.5rem] border border-slate-100 text-center">
                <p className="text-slate-500 italic font-medium text-lg">
                  The first chapter hasn't been inscribed yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
