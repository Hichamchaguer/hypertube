"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import { 
  ArrowLeft,
  Play, 
  Heart, 
  Star, 
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/api/axios";
import { CommentSection } from "@/components/movie/CommentSection";
import { fetchAvailableQualities } from "@/api/services/getData";

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1485090916855-2c262179a76b?q=80&w=1000&auto=format&fit=crop";
const FALLBACK_BACKDROP = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop";

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

interface ApiMovie {
  id: number;
  imdbId?: string | null;
  title?: string;
  year?: string;
  rating?: number;
  genres?: Array<number | string>;
  synopsis?: string;
  poster?: string | null;
  backdrop?: string | null;
}

interface MovieDetails {
  id: string;
  imdbId?: string | null;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  synopsis: string;
  poster: string;
  backdrop: string;
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [movieData, setMovieData] = useState<MovieDetails | null>(null);
  const [posterSrc, setPosterSrc] = useState(FALLBACK_POSTER);
  const [backdropSrc, setBackdropSrc] = useState(FALLBACK_BACKDROP);
  const [isLoading, setIsLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get<ApiMovie>(`/movies/${id}`);
        const movie = response.data;
        const genres = (movie.genres || [])
          .map((genre) => {
            if (typeof genre === "string") {
              return genre;
            }
            return tmdbGenreMap[genre];
          })
          .filter(Boolean) as string[];
        console.log("Fetched movie data:", genres);

        const resolvedMovie: MovieDetails = {
          id: String(movie.id),
          imdbId: movie.imdbId ?? null,
          title: movie.title || "Untitled",
          year: Number(movie.year) || 0,
          rating: typeof movie.rating === "number" ? movie.rating : 0,
          genres,
          synopsis: movie.synopsis || "No synopsis available.",
          poster: movie.poster || FALLBACK_POSTER,
          backdrop: movie.backdrop || movie.poster || FALLBACK_BACKDROP,
        };

        setMovieData(resolvedMovie);
        setPosterSrc(resolvedMovie.poster || FALLBACK_POSTER);
        setBackdropSrc(resolvedMovie.backdrop || FALLBACK_BACKDROP);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
        setMovieData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const response = await api.get("/library");
        const favorites = response.data;
        const exists = favorites.some((fav: any) => 
          fav.movie?.tmdbId === Number(id) || fav.movie?.imdbId === id
        );
        setIsFavorite(exists);
      } catch (error) {
        console.error("Failed to check favorite status", error);
      }
    };

    fetchMovie();
    checkFavoriteStatus();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!movieData || isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      const response = await api.post("/library/toggle", { movieId: id });
      setIsFavorite(response.data.action === "added");
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center text-white">
        <p className="text-sm font-semibold text-white/70">Loading movie...</p>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col font-sans">
      <Navbar authenticated />

      <main className="flex-1 relative">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 h-[600px] w-full overflow-hidden bg-[#0a0b10]">
          <Image 
            src={backdropSrc} 
            alt="Backdrop" 
            fill 
            className="object-cover opacity-20 blur-[2px] scale-105"
            onError={() => setBackdropSrc(FALLBACK_BACKDROP)}
            unoptimized={backdropSrc.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0b10]/60 to-[#0a0b10]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-12 pb-20">
          {/* Back Action */}
          <div className="mb-12">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 hover:bg-black/60 transition-all font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Poster Column */}
            <div className="w-full max-w-[340px] shrink-0">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 bg-[#1a1c26]">
                <Image 
                  src={posterSrc} 
                  alt={movieData.title} 
                  fill 
                  className="object-cover"
                  onError={() => setPosterSrc(FALLBACK_POSTER)}
                  unoptimized={posterSrc.startsWith('http')}
                  priority
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-10 pt-4">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-white tracking-tight leading-none">{movieData.title}</h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white/80 font-medium">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <span className="text-sm">{movieData.year}</span>
                  </div>
                  <Badge variant="rating" className="bg-[#22c55e] text-white border-transparent px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-sm font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {movieData.rating}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {movieData.genres.length > 0 ? (
                    movieData.genres.map((genre) => (
                      <Badge key={genre} className="bg-[#1a1c26] text-white/90 border-white/5 text-xs font-semibold px-4 py-1.5 rounded-full">
                        {genre}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-[#1a1c26] text-white/70 border-white/5 text-xs font-semibold px-4 py-1.5 rounded-full">
                      Unlisted Genre
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-[#ef4444] hover:bg-[#ef4444]/90 text-white font-bold px-10 gap-3 rounded-xl h-14"
                    onClick={async () => {
                      setLaunchError(null);
                      setIsLaunching(true);
                      try {
                        const imdbId = movieData.imdbId || movieData.id;
                        const qualities = await fetchAvailableQualities(imdbId);
                        if (!qualities.length) {
                          throw new Error("No qualities available");
                        }
                        const sorted = [...qualities].sort((a, b) => {
                          const first = parseInt(a.replace("p", ""), 10);
                          const second = parseInt(b.replace("p", ""), 10);
                          return second - first;
                        });
                        const preferred = sorted.find((item) => item === "720p");
                        const quality = preferred || sorted[0];
                        const params = new URLSearchParams({
                          imdbId,
                          quality,
                          title: movieData.title,
                        });
                        router.push(`/player?${params.toString()}`);
                      } catch (error: any) {
                        setLaunchError(error?.message || "Failed to launch player");
                      } finally {
                        setIsLaunching(false);
                      }
                    }}
                    disabled={isLaunching}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    {isLaunching ? "Loading..." : "Watch Now"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className={`bg-[#1a1c26] hover:bg-[#1a1c26]/80 text-white font-bold px-10 gap-3 rounded-xl h-14 border-white/5 transition-all ${isFavorite ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                    {isTogglingFavorite ? "Processing..." : (isFavorite ? "Saved to Library" : "Add to Favorites")}
                  </Button>

                </div>
              </div>

              {launchError && (
                <p className="text-sm text-red-400 font-semibold">{launchError}</p>
              )}

              {/* Synopsis Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Synopsis</h2>
                <p className="text-white/70 leading-relaxed text-base max-w-3xl">
                  {movieData.synopsis}
                </p>
              </div>

              {/* Section Divider */}
              <div className="w-full h-px bg-white/5 my-16" />

              {/* Community Section */}
              <CommentSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
