import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Profile() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-40 px-6 container mx-auto max-w-4xl">
        <h1 className="text-5xl text-crimson font-serif font-bold mb-8">My Dashboard</h1>
        <div className="p-12 border-2 border-crimson/10 rounded-[3rem] text-center">
           <p className="text-crimson/70 font-medium">User settings, reading history, and bookmarks will appear here after backend integration.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
