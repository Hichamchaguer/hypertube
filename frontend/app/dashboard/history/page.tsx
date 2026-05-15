import React from "react";
import { History } from "lucide-react";
import { HistoryCard } from "@/components/ui/HistoryCard";

import { movies } from "@/lib/movies";

const watchHistory = movies.filter(m => m.watched);

export default function HistoryPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome back, <span className="text-gradient">Hicham</span>
        </h1>
        <p className="text-muted/80 font-medium">Ready to continue your movie journey?</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
             <History className="w-6 h-6 text-[#ef4444]" />
             <h2 className="text-xl font-bold text-white tracking-wide">
               Your Watch History
            </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {watchHistory.map((movie, idx) => (
            <HistoryCard 
              key={idx}
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              image={movie.poster}
              duration={movie.duration}
              description={movie.synopsis}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
