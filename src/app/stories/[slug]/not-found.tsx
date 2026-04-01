import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function StoryNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-crimson/5 rounded-full">
        <BookOpen size={64} className="text-crimson/20" />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-crimson mb-4 uppercase tracking-tighter">This chapter has yet to be written</h1>
      <p className="text-crimson/60 text-lg max-w-md mx-auto mb-12 italic font-serif">
        The ink has dried on a page that doesn't exist, or perhaps the story has been lost to the shadows of time.
      </p>
      <Link 
        href="/stories" 
        className="flex items-center space-x-2 bg-crimson text-white px-8 py-4 rounded-full font-bold hover:bg-crimson-light transition-all shadow-lg shadow-crimson/20 tracking-widest uppercase text-sm"
      >
        <ArrowLeft size={18} />
        <span>Return to the Library</span>
      </Link>
    </div>
  );
}
