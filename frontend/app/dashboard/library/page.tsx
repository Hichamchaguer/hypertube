"use client";

import React, { useEffect, useState } from "react";
import { Library } from "lucide-react";
import { MovieCard } from "@/components/ui/MovieCard";
import api from "@/api/axios";

export default function LibraryPage() {
  const [libraryMovies, setLibraryMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await api.get("/library");
        // The backend returns an array of { libraryId, addedAt, movie }
        setLibraryMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch library movies", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          My <span className="text-gradient">Library</span>
        </h1>
        <p className="text-muted/80 font-medium">Your personal collection of saved movies.</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
             <Library className="w-6 h-6 text-primary" />
             <h2 className="text-xl font-bold text-white tracking-wide">
               Saved Movies
            </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-white/60 animate-pulse">Loading your library...</p>
          </div>
        ) : libraryMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {libraryMovies.map((item) => {
              const movie = item.movie;
              const id = movie.tmdbId || movie.imdbId;
              
              // Ensure image URL is handled correctly
              let imageUrl = movie.poster || movie.backdrop;
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https://image.tmdb.org/t/p/w500${imageUrl}`;
              }

              return (
                <MovieCard 
                  key={item.libraryId}
                  id={String(id)}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={imageUrl}
                  genres={movie.genres}
                  poster={imageUrl}
                  backdrop={movie.backdrop}
                  synopsis={movie.synopsis}
                  watched={movie.watched}
                />
              );
            })}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-card/20 rounded-3xl border border-white/5">
            <Library className="w-16 h-16 text-white/10" />
            <div className="space-y-1">
                <p className="text-xl font-bold text-white">Your library is empty</p>
                <p className="text-muted max-w-xs">Start adding movies to your library to keep track of what you want to watch.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

