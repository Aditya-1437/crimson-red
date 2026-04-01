"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, Filter, LayoutGrid, Layers } from "lucide-react";

export default function LibraryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for search input
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // URL Update helper
  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        updateUrl({ q: searchTerm || null });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, searchParams]);

  // Sync search state with URL (e.g. back button)
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-crimson/10 shadow-sm mb-8 items-center">
      {/* Search Input */}
      <div className="relative flex-grow w-full md:w-auto group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-crimson/40 group-focus-within:text-crimson transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Search titles, genres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-crimson/20 focus:ring-4 focus:ring-crimson/5 transition-all text-sm font-medium text-slate-700"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-crimson/5 rounded-full text-crimson/40 hover:text-crimson transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Status Filter */}
        <div className="relative flex-grow md:flex-grow-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-crimson/40 pointer-events-none">
            <Filter size={14} />
          </div>
          <select 
            value={searchParams.get("status") || "all"}
            onChange={(e) => updateUrl({ status: e.target.value })}
            className="w-full md:w-40 pl-9 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl outline-none hover:bg-slate-100 focus:bg-white focus:border-crimson/20 transition-all text-sm font-bold text-slate-600 cursor-pointer appearance-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative flex-grow md:flex-grow-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-crimson/40 pointer-events-none">
            <LayoutGrid size={14} />
          </div>
          <select 
            value={searchParams.get("type") || "all"}
            onChange={(e) => updateUrl({ type: e.target.value })}
            className="w-full md:w-40 pl-9 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl outline-none hover:bg-slate-100 focus:bg-white focus:border-crimson/20 transition-all text-sm font-bold text-slate-600 cursor-pointer appearance-none"
          >
            <option value="all">All Types</option>
            <option value="standalones">Standalones</option>
            <option value="series">Series</option>
          </select>
        </div>

        {/* Clear All Button */}
        {(searchTerm || searchParams.get("status") || searchParams.get("type")) && (
          <button 
            onClick={() => {
              setSearchTerm("");
              router.push(pathname);
            }}
            className="px-4 py-2.5 text-xs font-black uppercase tracking-widest text-crimson/60 hover:text-crimson transition-colors flex items-center"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
