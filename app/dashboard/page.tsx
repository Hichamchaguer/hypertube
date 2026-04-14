import React from "react";
import { ChevronDown } from "lucide-react";
import { MovieCard } from "@/components/ui/MovieCard";

const popularMovies = [
  { id: "shawshank-redemption", title: "The Shawshank Redemption", year: 1994, rating: 9.3, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", watched: true },
  { id: "dark-knight", title: "The Dark Knight", year: 2008, rating: 9.1, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop" },
  { id: "inception", title: "Inception", year: 2010, rating: 8.8, image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000&auto=format&fit=crop" },
  { id: "interstellar", title: "Interstellar", year: 2014, rating: 8.7, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop" },
  { id: "avengers-endgame", title: "Avengers: Endgame", year: 2019, rating: 8.4, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop" },
  { id: "spider-man-across-the-spider-verse", title: "Spider-Man: Across the Spider-Verse", year: 2023, rating: 8.4, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop" },
  { id: "the-batman", title: "The Batman", year: 2022, rating: 8.3, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop" },
  { id: "joker", title: "Joker", year: 2019, rating: 8.3, image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=1000&auto=format&fit=crop", watched: true },
  { id: "dune", title: "Dune", year: 2021, rating: 8.1, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop" },
  { id: "the-flash", title: "The Flash", year: 2023, rating: 8.0, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome back, <span className="text-gradient">Yassine</span>
        </h1>
        <p className="text-muted/80 font-medium">Ready to continue your movie journey?</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">Popular Movies</h2>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-card-border/50 text-sm font-medium text-white hover:bg-card-border/50 transition-colors">
            Most Popular
            <ChevronDown className="w-4 h-4 text-muted" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {popularMovies.map((movie, idx) => (
            <MovieCard 
              key={idx}
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              image={movie.image}
              watched={movie.watched}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
