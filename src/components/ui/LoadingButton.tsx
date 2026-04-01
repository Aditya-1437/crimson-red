"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export default function LoadingButton({ 
  href, 
  children, 
  className, 
  loadingText = "Transporting...",
  variant = "primary"
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // If it's a middle click or ctrl+click, let the browser handle it (new tab)
    if (e.button === 1 || e.ctrlKey || e.metaKey) return;
    
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} relative flex items-center justify-center gap-2 transition-all disabled:opacity-80 disabled:cursor-wait`}
    >
      <div className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText && <span className="text-xs font-bold uppercase tracking-widest">{loadingText}</span>}
        </div>
      )}
    </button>
  );
}
