"use client";

import React from 'react';

interface StoryRendererProps {
  content: string;
}

/**
 * StoryRenderer handles displaying rich text content from TipTap.
 * It ensures proper typography and styling for the storytelling experience.
 */
export default function StoryRenderer({ content }: StoryRendererProps) {
  if (!content) return null;

  return (
    <div 
      className="prose prose-lg md:prose-xl max-w-none 
                 prose-p:leading-relaxed prose-p:mb-8 
                 prose-headings:font-serif prose-headings:text-crimson prose-headings:mb-6
                 prose-a:text-crimson prose-a:underline hover:prose-a:text-crimson-light
                 prose-blockquote:border-l-4 prose-blockquote:border-crimson 
                 prose-blockquote:bg-crimson/5 prose-blockquote:py-6 prose-blockquote:px-8 
                 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-crimson/80
                 prose-strong:text-slate-900 prose-strong:font-bold
                 selection:bg-crimson/10 font-serif text-slate-900" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
