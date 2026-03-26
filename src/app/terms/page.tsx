import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export default function TermsPage() {
  return (
    <div className={`bg-[#F9F9F9] min-h-screen flex flex-col ${playfair.variable} ${inter.variable} selection:bg-crimson/20`}>
      <Header />
      
      <main className="flex-grow pt-32 pb-24 px-6 relative">
        <article className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5">
          <div className="mb-12 border-b border-crimson/10 pb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-crimson mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Terms of Service
            </h1>
            <p className="text-sm italic text-slate-500" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Last Updated: March 25, 2026
            </p>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-crimson prose-p:text-[#1A1A1A] prose-li:text-[#1A1A1A] prose-a:text-crimson prose-strong:text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>1. Acceptance of Terms</h2>
            <p>
              Welcome to Crimson Red. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Crimson Red is a sanctuary for long-form fiction, and we expect all users to respect the platform and each other.
            </p>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>2. Intellectual Property</h2>
            <p>
              All stories, articles, and content published on Crimson Red, unless otherwise stated, belong to the Admin and original affiliated authors. You may not reproduce, distribute, or create derivative works from the content on this platform without explicit written permission.
            </p>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>3. User Accounts</h2>
            <p>
              To access certain features, such as the Reader Sanctuary and commenting, you must register for an account. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. 
            </p>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>4. Prohibited Conduct</h2>
            <p>
              To maintain the integrity of our sanctuary, the following behaviors are strictly prohibited:
            </p>
            <ul>
              <li><strong>Content Scraping:</strong> Automated extraction of text or data from our platform is strictly forbidden.</li>
              <li><strong>Harassment:</strong> Any form of abuse, hate speech, or harassment in the comment sections or community hubs will result in an immediate ban.</li>
              <li><strong>Spam:</strong> Posting unauthorized commercial communications or repetitive disruptive content.</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>5. Termination of Access</h2>
            <p>
              We reserve the right to suspend or terminate your access to Crimson Red at any time, for any reason, including without limitation, a breach of these Terms of Service. Upon termination, your right to use the platform will immediately cease.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
