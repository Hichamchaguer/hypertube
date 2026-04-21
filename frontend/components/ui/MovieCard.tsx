"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, CheckCircle2 } from "lucide-react";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: string;
  title: string;
  year: number;
  rating: number;
  image: string;
  watched?: boolean;
  className?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=1000&auto=format&fit=crop";

export const MovieCard = ({ id, title, year, rating, image, watched, className }: MovieCardProps) => {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  return (
    <Link href={`/movie/${id}`} className={cn("group cursor-pointer block", className)}>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-card-border/50 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 bg-[#1a1c26]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          unoptimized={imgSrc.startsWith('http')}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-white text-white ml-1" />
          </div>
        </div>
        
        {watched && (
          <div className="absolute top-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-background shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge variant="rating" className="bg-black/60 backdrop-blur-md">
            {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <div className="px-1">
        <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted mt-1">{year}</p>
      </div>
    </Link>
  );
};
