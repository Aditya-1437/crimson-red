import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featuredStories = [
  {
    id: 1,
    title: "The Silent Echo",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    genre: "Mystery",
    rating: 4.8,
    episodes: 12,
    badge: "Trending",
  },
  {
    id: 2,
    title: "Whispers of the Void",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    genre: "Sci-Fi",
    rating: 4.5,
    episodes: 8,
    badge: "New",
  },
  {
    id: 3,
    title: "Crimson Tides",
    image: "https://images.unsplash.com/photo-1478147427282-58a87a120781",
    genre: "Fantasy",
    rating: 4.9,
    episodes: 24,
    badge: "Trending",
  },
  {
    id: 4,
    title: "Midnight Sonatas",
    image: "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474",
    genre: "Romance",
    rating: 4.2,
    episodes: 5,
    badge: "New",
  },
];

export default function FeaturedChronicles({
  title = "Featured Chronicles",
  subtitle = "Discover",
  onRequireAuth
}: {
  title?: string;
  subtitle?: string;
  onRequireAuth?: () => void;
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleReadClick = (id: string | number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push(`/stories/${id}`);
    } else {
      if (onRequireAuth) onRequireAuth();
    }
  };

  return (
    <section id="stories" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
        >
          <div>
            <span className="text-crimson/80 font-semibold tracking-widest uppercase text-sm mb-4 block">
              {subtitle}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-crimson">
              {title}
            </h2>
          </div>
          <Link href="/stories" className="hidden md:flex items-center text-crimson font-bold uppercase tracking-widest text-sm hover:text-crimson-light transition-colors group">
            View All
            <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </motion.div>

        <div className="flex overflow-x-auto pb-12 -mx-6 px-6 md:mx-0 md:px-0 gap-8 hide-scrollbar snap-x">
          {featuredStories.map((story, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={story.id}
              className="relative min-w-[320px] md:min-w-[400px] w-full snap-start group cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div onClick={handleReadClick(story.id)} className="w-full text-left cursor-pointer">
                <div className="relative h-[480px] w-full overflow-hidden rounded-[2.5rem] mb-8 border border-crimson/10 shadow-[0_10px_30px_rgb(153,0,0,0.05)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgb(153,0,0,0.15)] group-hover:-translate-y-2">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badge (Solid White with Crimson Text) */}
                <div className="absolute top-6 left-6 bg-white text-crimson text-xs font-bold uppercase tracking-widest py-2 px-6 rounded-full shadow-md">
                  {story.badge}
                </div>

                {/* Heart Action */}
                <button 
                  onClick={(e) => e.stopPropagation()} 
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full text-crimson hover:bg-crimson hover:text-white shadow-md transition-colors focus:outline-none z-20"
                >
                  <Heart size={22} className="transition-transform active:scale-90" />
                </button>
                </div>
              </div>

              {/* Content Below Image */}
              <div className="flex flex-col px-2">
                <div className="flex items-center space-x-3 mb-4 text-crimson/70 text-sm font-semibold tracking-wide uppercase">
                  <span>{story.genre}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson/40"></span>
                  <span>{story.episodes} Episodes</span>
                </div>
                
                <h3 className="font-serif text-3xl text-crimson font-bold leading-tight mb-4 group-hover:text-crimson-light transition-colors">
                  {story.title}
                </h3>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-1.5 text-crimson">
                    <Star size={18} fill="currentColor" />
                    <span className="text-crimson font-bold">{story.rating}</span>
                  </div>
                  <button 
                    onClick={handleReadClick(story.id)}
                    className="text-crimson font-bold uppercase tracking-widest text-sm hover:text-crimson-light flex items-center"
                  >
                    Read Now <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
