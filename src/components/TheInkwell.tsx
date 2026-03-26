import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Slow Worldbuilding",
    excerpt: "Why taking your time to establish the lore creates a more immersive sanctuary for your readers.",
    author: "Elena Rostova",
    date: "Oct 12, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    className: "md:col-span-2 md:row-span-2",
    titleClass: "text-4xl md:text-5xl",
  },
  {
    id: 2,
    title: "Character Arcs over Plot Twists",
    excerpt: "A deep dive into why emotional resonance always trumps the unexpected shock value in serialized fiction.",
    author: "Marcus Vance",
    date: "Oct 10, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    className: "md:col-span-1 md:row-span-1",
    titleClass: "text-3xl",
  },
  {
    id: 3,
    title: "Bleeding Ink: The Writer's Block",
    excerpt: "Navigating through the paralyzing fear of the blank page when the deadline looms ever closer.",
    author: "Sarah Jenning",
    date: "Oct 08, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1478147427282-58a87a120781",
    className: "md:col-span-1 md:row-span-1",
    titleClass: "text-3xl",
  },
];

export default function TheInkwell({
  title = "Essays on the Craft of Fiction",
  subtitle = "The Inkwell"
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id="blogs" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7 }}
           className="text-center mb-16"
        >
          <span className="text-crimson/80 font-semibold tracking-widest uppercase text-sm mb-4 block">
            {subtitle}
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-crimson max-w-3xl mx-auto">
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 auto-rows-auto">
          {blogPosts.map((post, i) => (
             <motion.article 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: i * 0.15 }}
               key={post.id} 
               className={`group flex flex-col bg-white rounded-[2.5rem] p-6 border border-crimson/10 shadow-[0_8px_30px_rgb(153,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(153,0,0,0.12)] transition-shadow duration-500 ${post.className}`}
             >
               <Link href={`/blogs/${post.id}`}>
                 <div className="relative w-full overflow-hidden rounded-[2rem] mb-8 flex-shrink-0" style={{ paddingBottom: post.className?.includes('row-span-2') ? '56.25%' : '60%' }}>
                   <Image 
                     src={post.image} 
                     alt={post.title} 
                     fill 
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     className="object-cover transition-transform duration-700 group-hover:scale-105" 
                   />
                 </div>
               </Link>
               
               <div className="flex flex-col flex-grow px-2">
                 <div className="flex items-center space-x-4 mb-4 text-xs font-bold tracking-widest text-crimson/60 uppercase">
                    <span>{post.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson/40"></span>
                    <span>{post.readTime}</span>
                 </div>
                 <h3 className={`font-serif font-bold text-crimson mb-6 leading-tight ${post.titleClass}`}>
                   <Link href={`/blogs/${post.id}`} className="hover:text-crimson-light transition-colors">
                     {post.title}
                   </Link>
                 </h3>
                 <p className="text-crimson/80 mb-8 leading-relaxed text-lg flex-grow font-light">
                   {post.excerpt}
                 </p>
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-crimson/10">
                   <span className="font-semibold text-crimson text-sm">By {post.author}</span>
                   <Link href={`/blogs/${post.id}`} className="text-crimson text-sm font-bold uppercase tracking-widest hover:text-crimson-light flex items-center group-hover:translate-x-2 transition-all">
                     Read Essay <span className="ml-2">→</span>
                   </Link>
                 </div>
               </div>
             </motion.article>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link href="/blogs" className="inline-block px-10 py-5 bg-white border-2 border-crimson text-crimson hover:bg-crimson hover:text-white transition-all duration-300 font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl">
            Open the Archives
          </Link>
        </div>
      </div>
    </section>
  );
}
