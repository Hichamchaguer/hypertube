"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Filter, Star, Play, Info } from "lucide-react";
import { MovieCard } from "@/components/ui/MovieCard";
import { Button } from "@/components/ui/Button";
import { MovieCardSkeleton } from "@/components/ui/Skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchUser, fetchMovies } from "@/api/services/getData";

const genres = ["All", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Sci-Fi"];

const FALLBACK_HERO_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop";

const tmdbGenreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  10765: "Sci-Fi",
  878: "Sci-Fi",
};

interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
  watched?: boolean;
}

interface ApiMovie {
  id: number;
  title?: string;
  year?: string;
  rating?: number;
  genres?: number[];
  synopsis?: string;
  poster?: string | null;
  backdrop?: string | null;
}

const DashboardContent = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [userName, setUserName] = React.useState("");
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const [selectedGenre, setSelectedGenre] = useState("All");

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetchUser();
        if (response.firstName || response.username) {
          setUserName(response.firstName || response.username);
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
        router.push("/signin");
      }
    };

    const getMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMovies(searchQuery);
        const mappedMovies: Movie[] = response.map((movie: ApiMovie) => {
          const genres = (movie.genres || [])
            .map((genre) => {
              if (typeof genre === "string") {
                return genre;
              }
              return tmdbGenreMap[genre];
            })
            .filter(Boolean) as string[];

          return {
            id: String(movie.id),
            title: movie.title || "Untitled",
            year: Number(movie.year) || 0,
            rating: typeof movie.rating === "number" ? movie.rating : 0,
            genres,
            synopsis: movie.synopsis || "No synopsis available.",
            poster: movie.poster || "",
            backdrop: movie.backdrop || "",
          };
        });

        setMovies(mappedMovies);
        setIsLoading(false);
    } catch (error) {
        console.error("Failed to fetch movies", error);
        setIsLoading(false);
      }
    };

    getUser();
    getMovies();
  }, [router, searchQuery]);

  const featuredMovie = movies[0];
  const featuredBackdrop = featuredMovie?.poster || FALLBACK_HERO_IMAGE;

  return (
    <div className="space-y-12 pb-12">
      {/* Cinematic Hero Section */}
      {!searchQuery && selectedGenre === "All" && featuredMovie && (
        <section className="relative h-[60vh] min-h-[450px] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
          <Image
            src={featuredBackdrop} 
            alt="Hero Background" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20 max-w-3xl space-y-6">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-md text-white">Featured Movie</span>
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {featuredMovie.rating} Rating
                  </div>
               </div>
               <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                 {featuredMovie.title}
               </h1>
            </div>
            
            <p className="text-white/70 text-lg font-medium leading-relaxed max-w-xl line-clamp-3">
              {featuredMovie.synopsis}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link href={`/movie/${featuredMovie.id}`}>
                <Button size="lg" className="h-14 px-10 gap-3 rounded-2xl bg-white text-black hover:bg-white/90 font-bold border-none shadow-xl shadow-white/5">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 gap-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold border-white/10 backdrop-blur-md">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome back, <span className="text-gradient">{userName}</span>
        </h1>
        <p className="text-muted/80 font-medium">Ready to continue your movie journey?</p>
      </div>

      <div className="space-y-8">
        {/* ... (Rest of the filtering and grid) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              {searchQuery ? `Results for "${searchQuery}"` : "Popular Movies"}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedGenre === genre 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-card border border-card-border/50 text-muted hover:text-white hover:border-white/10"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, idx) => (
               <MovieCardSkeleton key={idx} />
            ))
          ) : (
            (() => {
              const filteredMovies = movies.filter(movie => 
                selectedGenre === "All" || movie.genres.includes(selectedGenre)
              );

              if (filteredMovies.length === 0) {
                return (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-white/40 text-lg font-medium">
                      {searchQuery 
                        ? `No results found for "${searchQuery}"${selectedGenre !== "All" ? ` in ${selectedGenre}` : ""}`
                        : "No movies found in this category."}
                    </p>
                  </div>
                );
              }

              return filteredMovies.map((movie, idx) => (
                <MovieCard 
                  key={idx}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.poster}
                  genres={movie.genres}
                  backdrop={movie.backdrop}
                  synopsis={movie.synopsis}
                />
              ));
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div className="text-white/60 text-sm">Loading dashboard...</div>}
    >
      <DashboardContent />
    </Suspense>
  );
}
