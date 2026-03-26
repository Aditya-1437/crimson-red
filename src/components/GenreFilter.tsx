"use client";

import { useState } from "react";

const GENRES = ["All", "Action", "Romance", "Noir", "Fantasy", "Sci-Fi", "Mystery", "Historical"];

export default function GenreFilter() {
  const [active, setActive] = useState("All");

  return (
    <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-3">
      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => setActive(genre)}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
            active === genre
              ? "bg-crimson text-white shadow-[0_4px_15px_rgba(153,0,0,0.3)] border border-crimson"
              : "bg-white text-crimson/70 hover:bg-crimson/5 border border-crimson/20"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
