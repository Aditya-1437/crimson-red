import { Merriweather } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocialBar from "@/components/FloatingSocialBar";
import CommentSection from "@/components/CommentSection";
import ProgressBar from "@/components/ProgressBar";
import Breadcrumbs from "@/components/Breadcrumbs";

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export default function ArticleView() {
  return (
    <div className={`bg-white min-h-screen flex flex-col font-sans selection:bg-crimson/20 ${merriweather.variable}`}>
      <Header />
      <ProgressBar />

      <main className="flex-grow pt-[88px] relative">
        {/* Article Header Image & Meta */}
        <section className="container mx-auto px-6 md:px-12 mt-4 md:mt-8 mb-16 max-w-5xl">
          <div className="mb-8 flex justify-center">
            <Breadcrumbs 
              items={[
                { label: "The Journal", href: "/blogs" },
                { label: "World Building" },
                { label: "Designing the Obsidian Crown" }
              ]} 
            />
          </div>
          <div className="w-full h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden relative mb-12 shadow-sm border border-crimson/10">
            <div className="absolute inset-0 bg-stone-900"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
          </div>
          
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 text-crimson font-bold uppercase tracking-widest text-xs md:text-sm mb-6">
              <span>World Building</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-black mb-8 leading-tight">
              Designing the Obsidian Crown: The Anatomy of a Fallen Empire
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-crimson/10 border border-crimson/20 flex items-center justify-center text-crimson font-serif font-bold text-lg">
                AD
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-black uppercase tracking-widest">Admin</p>
                <p className="text-xs text-crimson/60 font-medium">October 12, 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content Layout */}
        <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-start justify-center relative">
          
          {/* Left Social Bar */}
          <div className="hidden lg:block w-32 flex-shrink-0">
            <FloatingSocialBar />
          </div>

          {/* Prose Content */}
          <article className="w-full max-w-3xl prose prose-lg md:prose-xl prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-black prose-a:text-crimson prose-a:font-semibold prose-blockquote:border-crimson prose-blockquote:bg-crimson/5 prose-blockquote:text-crimson/90 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-serif mx-auto lg:mx-0">
            
            <p className="first-letter:text-8xl md:first-letter:text-9xl first-letter:font-serif first-letter:font-bold first-letter:text-crimson first-letter:float-left first-letter:mr-6 first-letter:mt-2 first-letter:leading-[0.8] drop-cap">
              The hardest part of building a world that feels lived-in isn’t drawing the maps or charting the noble houses—it’s breaking them. A pristine empire is boring. An empire that is barely holding itself together, bleeding out from a thousand invisible cuts, is a breeding ground for tension.
            </p>

            <p>
              When we set out to design the world of <em>The Obsidian Crown</em>, we didn’t start with the capital city layout or the magical artifacts. We started with the question: <strong>What broke this world, and who is trying to tape it back together?</strong>
            </p>

            <h2>The Architecture of Decay</h2>
            <p>
              World-building in serial fiction requires a steady drip of lore. If you dump a Wikipedia article in chapter one, your readers will drown. If you hold back too much, they’ll feel unanchored.
            </p>

            <blockquote>
              "Lore is like salt. A pinch elevates the entire dish. A handful ruins it." — Admin
            </blockquote>

            <p>
              To balance this, we mapped out the "Architecture of Decay." We created three fundamental pillars that used to hold the empire together, and then we systematically decided how each one was failing.
            </p>
            
            <ol>
              <li><strong>The Economic Pillar:</strong> The silver mines of the north ran dry ten years ago. Now, the currency is being debased.</li>
              <li><strong>The Magical Pillar:</strong> The ley lines are shifting, making teleportation erratic and highly dangerous.</li>
              <li><strong>The Political Pillar:</strong> The king is suffering from a mysterious ailment that the court physicians are desperately trying to hide.</li>
            </ol>

            <p>
              By establishing these points of friction, the story writes itself. When our exiled heir, Elara, tries to rally the northern lords, they don't refuse her out of generic "villainy"—they refuse her because their coffers are empty from the silver crash, and they literally cannot afford a war.
            </p>

            <h2>Visualizing the Magic System</h2>
            <p>
              We opted for a <em>Hard Magic</em> system for this setting. Magic isn't a miraculous cheat code; it’s an esoteric science that demands a brutal toll. 
            </p>

            <p>
              In our next development diary, we’ll dive deeper into how the shifting ley lines are directly tied to the political instability of the Borderlands. Until then, keep reading, and keep questioning the shadows.
            </p>
          </article>
          
          {/* Right Gutter (for centering balance) */}
          <div className="hidden lg:block w-32 flex-shrink-0"></div>
        </div>
      </main>

      <div className="bg-white border-t border-crimson/10 mt-24">
        <div className="container mx-auto">
          <CommentSection hasTopComment={true} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
