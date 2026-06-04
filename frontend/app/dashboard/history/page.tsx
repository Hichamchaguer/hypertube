"use client";

import React, { useEffect, useState } from "react";
import { History, Film } from "lucide-react";
import { HistoryCard } from "@/components/ui/HistoryCard";
import { fetchWatchHistory } from "@/api/services/getData";
import { MovieCardSkeleton } from "@/components/ui/Skeleton";

interface HistoryItem {
  historyId: string;
  watchAt: string;
  movie: {
    tmdbId: number;
    title: string;
    year: string;
    rating: number;
    poster: string;
    synopsis: string;
    duration?: number;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const data = await fetchWatchHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    getHistory();
  }, []);

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes === 0) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

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

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-48 bg-card animate-pulse rounded-2xl border border-card-border/50" />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            {history.map((item) => {
              const posterPath = item.movie.poster;
              const imageUrl = (posterPath && !posterPath.startsWith('http')) 
                ? `https://image.tmdb.org/t/p/w500${posterPath}` 
                : posterPath || "";
                
              return (
                <HistoryCard 
                  key={item.historyId}
                  id={String(item.movie.tmdbId)}
                  title={item.movie.title}
                  year={Number(item.movie.year)}
                  rating={item.movie.rating}
                  image={imageUrl}
                  duration={formatDuration(item.movie.duration)}
                  description={item.movie.synopsis}
                />
              );
            })}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#1a1c26]/40 rounded-[2.5rem] border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
              <Film className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No watch history yet</h3>
            <p className="text-white/40 max-w-xs mx-auto">
              You haven't watched any movies yet. Start exploring and your history will appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
