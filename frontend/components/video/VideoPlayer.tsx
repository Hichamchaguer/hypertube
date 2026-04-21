"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  RotateCcw,
  FastForward,
  SkipBack,
  SkipForward
} from "lucide-react";

interface VideoPlayerProps {
  movieTitle: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [buffering, setBuffering] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setBuffering(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate progress
  useEffect(() => {
    if (isPlaying && !buffering) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, buffering]);

  return (
    <div className="w-full max-w-5xl aspect-video bg-[#1a1c26] rounded-3xl overflow-hidden shadow-2xl relative group ring-1 ring-white/10">
      {/* Video Content Placeholder */}
      <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
         {/* Simple Visual for Video */}
         <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent animate-pulse" />
         
         {buffering && (
            <div className="flex flex-col items-center gap-4 z-10">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-white/50 text-xs font-bold tracking-widest uppercase">Buffering...</p>
            </div>
         )}

         {!buffering && !isPlaying && (
            <button 
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center hover:scale-110 transition-transform group/play"
            >
              <Play className="w-8 h-8 text-white fill-current group-hover/play:scale-110 transition-transform" />
            </button>
         )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1">Now Playing</span>
            <h3 className="text-lg font-bold text-white tracking-tight">{movieTitle}</h3>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <Settings className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="relative group/progress h-6 flex items-center cursor-pointer">
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden transition-all group-hover/progress:h-2">
                <div 
                  className="h-full bg-primary rounded-full relative" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-current" />
                )}
              </button>
              <div className="flex items-center gap-4">
                <SkipBack className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
                <SkipForward className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-5 h-5 text-white/70" /> : <Volume2 className="w-5 h-5 text-white/70" />}
                 </button>
                 <div className="w-20 h-1 bg-white/20 rounded-full">
                    <div className="w-[70%] h-full bg-white/60 rounded-full" />
                 </div>
              </div>
              <span className="text-xs font-bold text-white/50 tracking-widest uppercase">
                {Math.floor(progress * 1.5)}:{(progress % 10).toFixed(0).padStart(2, '0')} / 124:00
              </span>
            </div>

            <div className="flex items-center gap-4">
               <Badge className="bg-white/5 border-white/10 text-[10px] px-2 py-0.5 font-bold tracking-tighter">1080P</Badge>
               <Maximize className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);
