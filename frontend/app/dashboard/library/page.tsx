import React from "react";
import { Library } from "lucide-react";
import { MovieCard } from "@/components/ui/MovieCard";

import { movies } from "@/lib/movies";

const libraryMovies = movies.filter(m => m.watched);

export default function LibraryPage() {
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

        {libraryMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {libraryMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                image={movie.poster}
                genres={movie.genres}
                poster={movie.poster}
                backdrop={movie.backdrop}
                synopsis={movie.synopsis}
                watched={movie.watched}
              />
            ))}
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
