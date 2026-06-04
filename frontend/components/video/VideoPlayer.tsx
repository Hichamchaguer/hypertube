"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import api from "@/api/axios";
import { startTorrentStream } from "@/api/services/getData";

interface VideoPlayerProps {
  imdbId: string;
  quality: string;
  movieTitle?: string;
  runtime?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

const formatTimestamp = (seconds?: number) => {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const total = Math.floor(seconds);

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ imdbId, quality, movieTitle, runtime }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "error" | "retrying">("idle");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(() => runtime ? runtime * 60 : 0);
  
  const totalDurationSeconds = runtime ? runtime * 60 : 0;

  useEffect(() => {
    let cancelled = false;
    let seekAttempts = 0;

    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      setCurrentTime(videoRef.current.currentTime || 0);
      
      // Check if we're near the end of what the video thinks is the duration
      const videoDur = videoRef.current.duration;
      const currentTime_ = videoRef.current.currentTime;
      
      if (videoDur > 0 && currentTime_ >= videoDur - 0.5 && videoDur < totalDurationSeconds) {
        // We've reached the end of a short segment, try to seek forward to load more
        console.log("Reached end of current segment, attempting to seek forward...");
        const nextSeekPoint = Math.min(videoDur + 10, totalDurationSeconds - 10);
        if (nextSeekPoint < totalDurationSeconds) {
          videoRef.current.currentTime = nextSeekPoint;
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (!videoRef.current) return;
      
      const actualVideoDuration = videoRef.current.duration;
      console.log("Video loaded metadata - reported duration:", actualVideoDuration);
      
      // If the video reports a short duration but we know it should be longer, override it
      if (actualVideoDuration < totalDurationSeconds && totalDurationSeconds > 0) {
        console.log("Overriding video duration from", actualVideoDuration, "to", totalDurationSeconds);
        setVideoDuration(totalDurationSeconds);
        
        // Try to seek to force loading more content
        setTimeout(() => {
          if (videoRef.current && actualVideoDuration < totalDurationSeconds) {
            // Seek to 1 second to trigger loading of the rest of the stream
            videoRef.current.currentTime = 1;
          }
        }, 1000);
      } else {
        setVideoDuration(actualVideoDuration);
      }
      
      setIsLoading(false);
    };

    const handleDurationChange = () => {
      if (!videoRef.current) return;
      const newDuration = videoRef.current.duration;
      console.log("Duration changed to:", newDuration);
      
      // Update our duration if the video reports a longer one
      if (newDuration > videoDuration && newDuration > 0) {
        setVideoDuration(newDuration);
      }
    };

    const handleProgress = () => {
      // Check if more of the video has been buffered
      if (!videoRef.current) return;
      
      const buffered = videoRef.current.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        console.log("Buffered up to:", bufferedEnd, "seconds");
        
        // If we've buffered beyond the current perceived duration, update it
        if (bufferedEnd > videoDuration && totalDurationSeconds > videoDuration) {
          setVideoDuration(Math.min(bufferedEnd + 10, totalDurationSeconds));
        }
      }
    };

    const loadPlaylist = async () => {
      const playlistUrl = `${API_BASE}/torrent/getStreamPlaylist/${imdbId}/${quality}`;
      const maxAttempts = 10;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        if (cancelled) return;
        try {
          await api.get(`/torrent/getStreamPlaylist/${imdbId}/${quality}`, {
            responseType: "text",
          });

          if (!videoRef.current) return;

          // Add event listeners
          videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
          videoRef.current.addEventListener("durationchange", handleDurationChange);
          videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
          videoRef.current.addEventListener("progress", handleProgress);

          if (Hls.isSupported()) {
            if (hlsRef.current) {
              hlsRef.current.destroy();
            }
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              maxBufferLength: 60, // Increase buffer to load more content
              maxMaxBufferLength: 120,
            });
            hlsRef.current = hls;
            hls.loadSource(playlistUrl);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch((err) => {
                console.log("Autoplay prevented:", err);
                setIsPlaying(false);
              });
            });
            
            // Listen for level updates to get better duration info
            hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
              if (data?.details?.totalduration && data.details.totalduration > videoDuration) {
                console.log("HLS level loaded with duration:", data.details.totalduration);
                setVideoDuration(Math.max(videoDuration, data.details.totalduration));
              }
            });
          } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = playlistUrl;
          } else {
            throw new Error("HLS is not supported in this browser.");
          }

          setStatus("ready");
          return;
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      throw new Error("Playlist not ready yet. Please try again.");
    };

    const startStream = async () => {
      const maxRetries = 5;
      let attempt = 0;

      setStatus("starting");
      setError(null);
      setRetryCount(0);
      setIsLoading(true);

      while (attempt <= maxRetries) {
        try {
          await startTorrentStream(imdbId, quality);
          await loadPlaylist();
          return;
        } catch (err: any) {
          if (cancelled) return;
          const isNetworkError = !err?.response || err?.message?.includes("Network Error");
          if (!isNetworkError || attempt === maxRetries) {
            setStatus("error");
            setError(err?.message || "Failed to start stream");
            return;
          }

          attempt += 1;
          setRetryCount(attempt);
          setStatus("retrying");
          await new Promise((resolve) => setTimeout(resolve, 1200 + attempt * 800));
        }
      }
    };

    startStream();

    return () => {
      cancelled = true;
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoRef.current.removeEventListener("durationchange", handleDurationChange);
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current.removeEventListener("progress", handleProgress);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [imdbId, quality, totalDurationSeconds]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.log("Play failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentTimeFormatted = formatTimestamp(currentTime);
  const totalDurationFormatted = formatTimestamp(videoDuration);

  return (
    <div className="w-full max-w-6xl">
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlayPause}
          crossOrigin="anonymous"
          preload="metadata"
          className="w-full h-full object-contain"
        />

        {isLoading && status !== "ready" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-white/80">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold tracking-widest uppercase">
                {status === "starting"
                  ? "Preparing stream..."
                  : status === "retrying"
                    ? `Reconnecting... (try ${retryCount}/5)`
                    : "Loading player"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 text-white/70">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{movieTitle || "Now Playing"}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest">{quality}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs bg-black/30 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{currentTimeFormatted}</span>
            <span className="text-white/40">/</span>
            <span>{totalDurationFormatted}</span>
          </div>
          {runtime && (
            <span className="text-white/40 text-xs">
              {runtime >= 60 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : `${runtime}m`}
            </span>
          )}
        </div>
        
        {error && <p className="text-sm text-red-400 font-semibold">{error}</p>}
      </div>
    </div>
  );
};