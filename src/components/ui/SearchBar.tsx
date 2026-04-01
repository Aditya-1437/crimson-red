"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Search by title or genre...", 
  className = "" 
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (inputValue) {
        params.set("q", inputValue);
      } else {
        params.delete("q");
      }
      
      // Update the URL without refreshing the page
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, pathname, router, searchParams]);

  // Sync state if URL changes externally (e.g. back button)
  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="relative flex-grow group">
        <Search 
          className="absolute left-6 top-1/2 -translate-y-1/2 text-crimson/40 transition-colors group-focus-within:text-crimson" 
          size={20} 
        />
        <input 
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-white border-2 border-crimson/10 rounded-full py-4 pl-14 pr-14 text-crimson placeholder:text-crimson/30 outline-none transition-all duration-300 focus:border-crimson focus:ring-4 focus:ring-crimson/10 focus:shadow-[0_0_20px_rgba(153,0,0,0.1)] font-medium"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-crimson/5 text-crimson/40 hover:text-crimson transition-all"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
