"use client";

import { useState, useEffect } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowUp } from "lucide-react";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function PrivacyPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`bg-[#F9F9F9] min-h-screen flex flex-col ${playfair.variable} ${inter.variable} selection:bg-crimson/20 relative`}>
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-6 relative">
        <article className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5">
          <div className="mb-12 border-b border-crimson/10 pb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-crimson mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Privacy Policy
            </h1>
            <p className="text-sm italic text-slate-500" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Effective Date: March 25, 2026
            </p>
          </div>

          <div 
            className="prose prose-lg md:prose-xl max-w-none prose-headings:text-crimson prose-p:text-[#1A1A1A] prose-li:text-[#1A1A1A] prose-a:text-crimson prose-strong:text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>01. Introduction</h2>
            <p>
              Crimson Red values your privacy, anonymity, and data security above all else. As a sanctuary for long-form fiction, our primary objective is to immerse you in storytelling—not to build advertising profiles around your reading habits. This Privacy Policy outlines what information we collect, how it gets used, and your rights regarding that data.
            </p>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>02. Information We Collect</h2>
            <p>
              To provide you with a seamless reading experience, we collect the following minimal data points:
            </p>
            <ul>
              <li><strong>Account Information:</strong> Your email address and username used during registration.</li>
              <li><strong>Reading Telemetry:</strong> Anonymized markers of your reading progress (so we can provide the 'Continue Reading' bookmarking feature).</li>
              <li><strong>Interaction Data:</strong> Likes, comments, and saves you explicitly make within the platform.</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>03. How We Use Data</h2>
            <p>
              We believe data should only be used to serve the reader. Your information is strictly utilized to:
            </p>
            <ul>
              <li>Personalize your library experience and track your reading journeys.</li>
              <li>Secure your account and authenticate your logins.</li>
              <li>Send you our sporadic newsletter updates (only if you have opted in).</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>04. Third-Party Services</h2>
            <p>
              We do not sell your data. We share necessary operational data only with trusted infrastructure partners to keep the lights on:
            </p>
            <ul>
              <li><strong>Authentication:</strong> We use encrypted third-party services (such as Supabase/Firebase) to securely manage your login credentials.</li>
              <li><strong>Analytics:</strong> Broad, aggregated traffic data may be collected via minimalist analytics tools (like Plausible or Google Analytics) to help us understand server loads and popular genres.</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>05. User Rights</h2>
            <p>
              It's your data. You maintain the right to:
            </p>
            <ul>
              <li>Request a full export of your reading history and comment data.</li>
              <li>Request total deletion of your account and all associated data.</li>
              <li>Opt-out of any non-essential communication or platform telemetry.</li>
            </ul>
            <p>
              To exercise these rights, simply contact us via the Support page or securely through your Account Settings.
            </p>
          </div>
        </article>
      </main>

      {/* Sticky Back-to-Top Button */}
      <div 
        className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-in-out ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="w-12 h-12 bg-crimson text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(153,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(153,0,0,0.6)] hover:bg-white hover:text-crimson transition-all duration-300 group ring-2 ring-transparent hover:ring-crimson"
        >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
