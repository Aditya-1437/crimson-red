"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  theme?: "light" | "dark";
}

export default function Breadcrumbs({ items, theme = "light" }: BreadcrumbsProps) {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-black/30 backdrop-blur-md border-white/10" : "bg-white/80 backdrop-blur-md border-crimson/10 shadow-[0_4px_20px_rgba(153,0,0,0.05)]";
  const textClass = isDark ? "text-white/70" : "text-crimson/70";
  const hoverClass = isDark ? "hover:text-white" : "hover:text-crimson";
  const activeClass = isDark ? "text-white font-semibold" : "text-crimson font-semibold";

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`inline-flex items-center space-x-1 md:space-x-3 px-4 md:px-6 py-2.5 rounded-full border ${bgClass}`}
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className={`inline-flex items-center text-xs md:text-sm font-medium transition-colors duration-300 ${textClass} ${hoverClass} group`}
            aria-label="Home"
          >
            <Home size={14} className="group-hover:scale-110 transition-transform" />
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.label} className="inline-flex items-center">
              <ChevronRight size={14} className={`mx-1 md:mx-2 ${textClass} opacity-50`} />
              {isLast || !item.href ? (
                <span className={`inline-flex items-center text-xs md:text-sm tracking-wide ${activeClass}`}>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  <span className="truncate max-w-[120px] md:max-w-[200px]">{item.label}</span>
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className={`inline-flex items-center text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 ${textClass} ${hoverClass} group`}
                >
                  {item.icon && <span className="mr-2 group-hover:scale-110 transition-transform">{item.icon}</span>}
                  <span className="truncate max-w-[120px] md:max-w-[150px]">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
