"use client";

import { motion } from "framer-motion";
import { Share2, Link as LinkIcon, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function FloatingSocialBar() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="hidden lg:flex flex-col items-center space-y-6 sticky top-32 w-12"
    >
      <div className="w-px h-12 bg-crimson/20"></div>
      
      <button 
        aria-label="Share to Twitter"
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-crimson/50 hover:text-crimson hover:bg-crimson/5 border border-transparent hover:border-crimson/10 transition-all shadow-sm hover:shadow-[0_4px_15px_rgba(153,0,0,0.1)] group"
      >
        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      <button 
        onClick={handleCopyLink}
        aria-label="Copy Link"
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-crimson/50 hover:text-crimson hover:bg-crimson/5 border border-transparent hover:border-crimson/10 transition-all shadow-sm hover:shadow-[0_4px_15px_rgba(153,0,0,0.1)] group"
      >
        <LinkIcon size={18} className="group-hover:scale-110 transition-transform" />
      </button>

      <button 
        aria-label="Save for Later"
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-crimson/50 hover:text-crimson hover:bg-crimson/5 border border-transparent hover:border-crimson/10 transition-all shadow-sm hover:shadow-[0_4px_15px_rgba(153,0,0,0.1)] group"
      >
        <Bookmark size={18} className="group-hover:scale-110 transition-transform" />
      </button>
      
      <div className="w-px h-12 bg-crimson/20"></div>
    </motion.div>
  );
}
