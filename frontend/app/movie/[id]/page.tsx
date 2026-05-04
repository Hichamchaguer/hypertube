"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { 
  ArrowLeft,
  Play, 
  Heart, 
  Star, 
  Clock, 
  Calendar,
  X
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { getMovieById } from "@/lib/movies";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { CommentSection } from "@/components/movie/CommentSection";

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1485090916855-2c262179a76b?q=80&w=1000&auto=format&fit=crop";
const FALLBACK_BACKDROP = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop";

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movieData = getMovieById(id);
  
  const [posterSrc, setPosterSrc] = useState(movieData?.poster || FALLBACK_POSTER);
  const [backdropSrc, setBackdropSrc] = useState(movieData?.backdrop || FALLBACK_BACKDROP);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!movieData) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-8">
           <Star className="w-10 h-10 text-rose-500 opacity-20" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Movie Not Found</h1>
        <p className="text-white/60 max-w-md mb-10 leading-relaxed font-medium">
          The movie you are looking for doesn&apos;t exist or has been removed from our library.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-bold border-none">
            Return to Dashboard
          </Button>
        </Link>
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
                  <div className="flex items-center gap-2 text-white/80 font-medium">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-sm">{movieData.duration}</span>
                  </div>
                  <Badge variant="rating" className="bg-[#22c55e] text-white border-transparent px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-sm font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {movieData.rating}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {movieData.genres.map((genre) => (
                    <Badge key={genre} className="bg-[#1a1c26] text-white/90 border-white/5 text-xs font-semibold px-4 py-1.5 rounded-full">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-[#ef4444] hover:bg-[#ef4444]/90 text-white font-bold px-10 gap-3 rounded-xl h-14"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Button>
                  <Button variant="outline" size="lg" className="bg-[#1a1c26] hover:bg-[#1a1c26]/80 text-white font-bold px-10 gap-3 rounded-xl h-14 border-white/5">
                    <Heart className="w-5 h-5" />
                    Add to Favorites
                  </Button>
                </div>
              </div>

              {/* Synopsis Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Synopsis</h2>
                <p className="text-white/70 leading-relaxed text-base max-w-3xl">
                  {movieData.synopsis}
                </p>
              </div>

              {/* Cast & Crew Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Cast & Crew</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">Directors</h3>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {movieData.directors.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">Actors</h3>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {movieData.actors.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Divider */}
              <div className="w-full h-px bg-white/5 my-16" />

              {/* Community Section */}
              <CommentSection />
            </div>
          </div>
        </div>
      </main>

      {/* Video Player Modal/Overlay */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-6 left-10 z-[60]">
            <button 
              onClick={() => setIsPlaying(false)}
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                <X className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase">Close Player</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <VideoPlayer movieTitle={movieData.title} />
          </div>
        </div>
      )}
    </div>
  );
}
