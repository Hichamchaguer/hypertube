import React from "react";
import { Library } from "lucide-react";
import { MovieCard } from "@/components/ui/MovieCard";

const libraryMovies = [
  { id: "inception", title: "Inception", year: 2010, rating: 8.8, image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop" },
  { id: "interstellar", title: "Interstellar", year: 2014, rating: 8.7, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop" },
  { id: "dark-knight", title: "The Dark Knight", year: 2008, rating: 9.1, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop" },
];

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
                image={movie.image}
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
