"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
  id: string;
  title: string;
  year: number;
  rating: number;
  image: string;
  duration: string;
  description: string;
  className?: string;
}

const FALLBACK_IMAGE = "https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCei707Xez7VpE.jpg";

export const HistoryCard = ({ 
  id,
  title, 
  year, 
  rating, 
  image, 
  duration, 
  description, 
  className 
}: HistoryCardProps) => {
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMAGE);

  React.useEffect(() => {
    setImgSrc(image && image !== "" ? image : FALLBACK_IMAGE);
  }, [image]);


  return (
    <Link 
      href={`/movie/${id}`}
      className={cn(
        "group flex gap-5 bg-[#1a1c26]/60 hover:bg-[#1a1c26]/90 rounded-2xl p-4 border border-white/5 shadow-xl transition-all duration-300 block",
        className
      )}
    >
      {/* Poster */}
      <div 
        className="relative w-[130px] shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#1a1c26] transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${FALLBACK_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Image
          src={imgSrc}
          alt="" 
          fill
          className="object-cover transition-opacity duration-500"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          unoptimized={imgSrc.startsWith('http')}
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            {title}
          </h3>
          <span className="text-xs font-semibold text-muted/80">{duration}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-[#facc15]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-bold">{rating}/10</span>
          </div>
          <span className="text-sm text-muted">({year})</span>
        </div>
        
        <p className="text-sm text-muted/70 mt-4 line-clamp-2 leading-relaxed max-w-[85%]">
          {description}
        </p>
      </div>

      {/* Play Button Action */}
      <div className="flex items-center px-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ef4444] to-[#a855f7] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 active:scale-95 transition-all duration-300">
          <Play className="w-6 h-6 fill-white text-white ml-1" />
        </div>
      </div>
    </Link>
  );
};
