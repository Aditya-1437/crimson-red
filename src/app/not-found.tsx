import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-crimson flex flex-col items-center justify-center text-white selection:bg-white/20 p-8 relative overflow-hidden font-sans">
      <div className="absolute top-8 left-8">
        <Logo className="font-serif text-3xl font-bold text-white tracking-widest" iconSize={24} />
      </div>
      
      <div className="text-center z-10">
        <h1 className="text-[12rem] md:text-[18rem] font-serif font-bold leading-none opacity-20 select-none drop-shadow-2xl">
          404
        </h1>
        <div className="-mt-16 md:-mt-24 mb-10 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 leading-tight italic">
            "This chapter has <br className="hidden md:block" /> yet to be written."
          </h2>
          <p className="text-white/70 font-medium tracking-wide max-w-sm">
            The page you are looking for has been lost in the ink. Let's get you back to the sanctuary.
          </p>
        </div>
        
        <Link 
          href="/stories"
          className="inline-block px-8 py-4 bg-white text-crimson font-bold uppercase tracking-widest text-sm rounded-full hover:bg-slate-100 transition-colors shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-xl"
        >
          Return to Library
        </Link>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/4 right-[-10%] w-96 h-96 border-[2px] border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[40rem] h-[40rem] border-[1px] border-white/5 rounded-full"></div>
    </div>
  );
}
