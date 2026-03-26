"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default function Ongoing() {
  const ongoingItems = [
    {
      id: 1,
      title: "The Silent Echo",
      type: "Story",
      progress: 65,
      episode: "Ep 8 / 12",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    },
    {
      id: 2,
      title: "Worldbuilding 101",
      type: "Blog",
      progress: 30,
      episode: "4 min left",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white pt-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="mb-12"
        >
          <span className="text-crimson/80 font-semibold tracking-widest uppercase text-sm mb-2 block">
            Welcome Back
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-crimson">
            Continue Reading
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ongoingItems.map((item, index) => (
             <Link href={`/${item.type.toLowerCase() === 'story' ? 'stories' : 'blogs'}/${item.id}`} key={item.id}>
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="group flex items-center p-4 rounded-3xl border border-crimson/10 bg-white hover:shadow-[0_15px_30px_rgba(153,0,0,0.08)] transition-all duration-300 cursor-pointer h-full"
               >
                 <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-2xl mr-6">
                   <Image src={item.image} alt={item.title} fill sizes="150px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-crimson/10"></div>
                   <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 
                 <div className="flex flex-col flex-grow py-2">
                   <span className="text-xs font-bold uppercase tracking-widest text-crimson/60 mb-2">{item.type}</span>
                   <h3 className="font-serif text-2xl font-bold text-crimson mb-3 group-hover:text-crimson-light transition-colors">{item.title}</h3>
                   
                   <div className="w-full bg-crimson/10 h-1.5 rounded-full overflow-hidden mb-2 mt-auto">
                     <div className="bg-crimson h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                   </div>
                   <div className="flex justify-between items-center text-xs text-crimson/70 font-semibold">
                     <span>{item.progress}%</span>
                     <span>{item.episode}</span>
                   </div>
                 </div>
               </motion.div>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
