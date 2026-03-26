import { Merriweather } from "next/font/google";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import CommentSection from "@/components/CommentSection";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export default function ReaderSanctuary({ params }: { params: { id: string } }) {
  // In a real app we'd fetch story data using params.id
  const story = {
    title: "The Obsidian Crown",
    chapterTitle: "Chapter 4: Shadows Rise",
    chapterNum: 4,
    totalChapters: 42,
  };

  return (
    <div className={`bg-white min-h-screen flex flex-col ${merriweather.variable} selection:bg-crimson/20`}>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-crimson/10 py-3 md:py-0 md:h-[72px]">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <Breadcrumbs 
            items={[
              { label: "Library", href: "/stories" },
              { label: story.title }
            ]} 
          />
          
          <div className="hidden md:flex flex-col items-center">
            <h1 className="font-serif font-bold text-crimson text-lg">{story.title}</h1>
            <span className="text-xs text-crimson/60 uppercase tracking-widest mt-0.5">{story.chapterTitle}</span>
          </div>
          
          <div className="text-sm font-semibold text-crimson/80 tracking-widest uppercase">
            {story.chapterNum} <span className="text-crimson/40">/</span> {story.totalChapters}
          </div>
        </div>
      </header>

      {/* Progress Bar just beneath the header */}
      <div className="pt-2 md:pt-0">
        <ProgressBar />
      </div>

      {/* The Reading Canvas */}
      <main className="flex-grow pt-40 md:pt-32 px-6">
        <article className="max-w-2xl mx-auto">
          <div className="mb-16 text-center md:hidden">
            <h1 className="font-serif font-bold text-crimson text-3xl mb-2">{story.title}</h1>
            <span className="text-sm text-crimson/60 uppercase tracking-widest">{story.chapterTitle}</span>
          </div>

          <div className="font-sans text-crimson/90 text-lg leading-[1.8] space-y-8 tracking-wide pt-4" style={{ fontFamily: "var(--font-merriweather), serif" }}>
            <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-crimson first-letter:float-left first-letter:mr-4 first-letter:mt-2">
              The heavy oak doors of the council chamber thudded shut, sealing them inside with the scent of old parchment and brewing treason. Elara stood at the head of the long obsidian table, her fingers tracing the intricate runes carved into its surface.
            </p>
            <p>
              "They will not accept a child ruler," Lord Vance sneered, his gaze flicking to the empty throne at her back. "The kingdom needs a firm hand. The Borderlands are already fracturing."
            </p>
            <p>
              "The kingdom needs its rightful sovereign," she replied evenly, never raising her voice. In the game of power, the one who shouted first had already lost.
            </p>
            <p>
              She walked slowly down the length of the room, the crimson hem of her gown sweeping silently across the polished stone.
            </p>
            <p>
              "My brother’s blood still stains the courtyard steps," she continued, stopping just behind Vance's chair. "Do not speak to me of what this kingdom needs while the ashes of its protector are still warm."
            </p>
            <p>
              The silence that followed was suffocating. Outside, the bells of the High Temple began to toll—a mournful, hollow sound that echoed through the citadel. The mourning period was officially over. Now, the real war would begin.
            </p>
            <p>
               Every lord in the room shifted uncomfortably. They had expected grief and weakness. Instead, they found cold iron. Elara moved back to the head of the table. 
            </p>
            <p>
               "We march at dawn," she declared, her voice slicing through the thick air like a blade. "Send word to the eastern garrisons. Any man who questions the line of succession will answer to me."
            </p>
            <p>
               For hours, the council debated, threatened, and bargained. They tried to wear her down with logistics and whispered fears of the encroaching northern shadows. But Elara remained an immovable anchor in the storm of their ambition.
            </p>
            <p>
               When the doors finally opened again, the lords filed out with pale faces and rigid postures. They had entered expecting to fracture a kingdom and share the spoils. They left bound to a new queen tighter than any chain.
            </p>
            <p>
               Only when the chamber was empty did Elara allow herself to exhale. She slumped into the obsidian throne, the cold stone biting through the silk of her dress. The crown was heavy, heavier than she ever imagined when she used to wear it in play as a child.
            </p>
             <p>
               "You played them perfectly," a voice whispered from the alcove shadows. A figure detached from the darkness, eyes gleaming like polished onyx.
            </p>
             <p>
               "I played a dangerous hand," she corrected, not turning to look at him. "The easy part is commanding their fear. The hard part will be keeping it."
            </p>
            <p>
               The shadow stepped forward, placing a reassuring hand on her shoulder. "Then we make sure the shadows standing behind you are more terrifying than the ones gathering in the north."
            </p>
          </div>

          <div className="mt-20 flex justify-between items-center border-t border-crimson/10 pt-10">
            <button className="flex items-center space-x-2 text-crimson/60 hover:text-crimson font-semibold tracking-widest uppercase text-sm transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Previous Chapter</span>
            </button>
            <button className="flex items-center space-x-2 bg-crimson text-white px-6 py-3 rounded-full hover:bg-crimson/90 font-semibold tracking-widest uppercase text-sm transition-all focus:ring-4 focus:ring-crimson/20 shadow-[0_4px_15px_rgba(153,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(153,0,0,0.3)] group">
              <span>Next Chapter</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </article>
      </main>

      <div className="bg-white">
        <CommentSection />
        <Footer />
      </div>
    </div>
  );
}
