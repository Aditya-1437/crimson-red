"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FeaturedChronicles from "@/components/FeaturedChronicles";
import TheInkwell from "@/components/TheInkwell";
import About from "@/components/About";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Ongoing from "@/components/Ongoing";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem("isAuth") === "true");
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-crimson border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Header />
      
      {isLoggedIn ? (
        // --- LOGGED IN DASHBOARD VIEW ---
        <main className="space-y-6 pb-12 px-4 md:px-8 min-h-screen">
          <Ongoing />
          <FeaturedChronicles 
            title="Most Popular Stories" 
            subtitle="Trending Worldwide" 
          />
          <TheInkwell 
            title="Popular Blogs" 
            subtitle="Community Favorites" 
          />
        </main>
      ) : (
        // --- LOGGED OUT LANDING VIEW ---
        <>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center bg-white pt-32 pb-16 px-4 md:px-8">
            <div className="container relative z-10 mx-auto text-center text-crimson max-w-5xl bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_20px_60px_-15px_rgba(153,0,0,0.1)] border border-crimson/5">
              <span className="text-crimson font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-8 block animate-fade-in-up">
                Volume I • Issue 12
              </span>
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-semibold mb-8 leading-tight tracking-tight text-crimson">
                Where Words <br /><span className="italic font-light">Bleed</span>
              </h1>
              <p className="text-xl md:text-2xl text-crimson/80 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
                Immerse yourself in serial fiction that dares to take its time. No algorithms, no micro-content. Just pure beautiful storytelling.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/stories" className="px-10 py-5 bg-crimson text-white font-semibold tracking-widest uppercase hover:bg-white hover:text-crimson border-2 border-crimson rounded-full transition-all duration-300 w-full sm:w-auto shadow-[0_8px_30px_rgb(153,0,0,0.2)] hover:shadow-[0_12px_40px_rgb(153,0,0,0.3)] block">
                  Start Reading
                </Link>
                <Link href="/stories" className="px-10 py-5 bg-white text-crimson font-semibold tracking-widest uppercase border-2 border-crimson/20 hover:border-crimson rounded-full transition-all duration-300 w-full sm:w-auto hover:bg-crimson/5 block">
                  Browse Genres
                </Link>
              </div>
            </div>
          </section>

          <main className="space-y-6 pb-12 px-4 md:px-8">
            <FeaturedChronicles />
            <About />
            <TheInkwell />
            <Newsletter />
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}
