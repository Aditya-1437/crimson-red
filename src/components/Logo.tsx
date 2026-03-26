"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  href?: string;
}

export function Logo({ 
  className = "font-serif text-3xl font-semibold text-crimson tracking-wide", 
  iconSize = 24, 
  href = "/" 
}: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center group ${className}`}>
      <span>Crimson Red</span>
      <motion.svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2 animate-pulse group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M12 12C12 12 8 4 4 8C2 10 4 14 8 12C10 11 12 12 12 12ZM12 12C12 12 16 4 20 8C22 10 20 14 16 12C14 11 12 12 12 12Z" />
        <path d="M12 12C12 12 9 20 5 18C3 17 5 14 8 14C10 14 12 12 12 12ZM12 12C12 12 15 20 19 18C21 17 19 14 16 14C14 14 12 12 12 12Z" opacity="0.8" />
      </motion.svg>
    </Link>
  );
}
