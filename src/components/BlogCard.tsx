"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";

export interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group bg-white flex flex-col h-full rounded-2xl border border-transparent hover:border-crimson/10 hover:shadow-[0_15px_40px_rgba(153,0,0,0.06)] transition-all duration-300 transform hover:-translate-y-2 p-5"
    >
      {post.imageUrl && (
        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
          <div className={`absolute inset-0 ${post.imageUrl} group-hover:scale-105 transition-transform duration-700 ease-out`}></div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] sm:text-xs font-bold text-crimson uppercase tracking-widest mb-3">{post.category}</span>
        <h3 className="text-2xl font-serif font-bold text-black group-hover:text-crimson transition-colors duration-300 leading-tight mb-4">
          {post.title}
        </h3>
        <p className="text-crimson/70 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-crimson/50 font-medium pt-4 border-t border-crimson/5 mt-auto">
          <span>{post.date}</span>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
      
      <Link href={`/blogs/${post.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title}</span>
      </Link>
    </motion.div>
  );
}
