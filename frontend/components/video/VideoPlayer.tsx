"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import api from "@/api/axios";
import { startTorrentStream } from "@/api/services/getData";

interface VideoPlayerProps {
  imdbId: string;
  quality: string;
  movieTitle?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ imdbId, quality, movieTitle }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "error" | "retrying">("idle");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

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

          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
            });
            hlsRef.current = hls;
            hls.loadSource(playlistUrl);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch(() => undefined);
            });
          } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = playlistUrl;
            videoRef.current.addEventListener("loadedmetadata", () => {
              videoRef.current?.play().catch(() => undefined);
            });
          } else {
            throw new Error("HLS is not supported in this browser.");
          }

          setStatus("ready");
          return;
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [imdbId, quality]);

  return (
    <div className="w-full max-w-6xl">
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <video
          ref={videoRef}
          controls
          playsInline
          className="w-full h-full object-contain"
        />

        {status !== "ready" && (
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
          <span className="text-xs font-bold uppercase tracking-widest">{quality}</span>
        </div>
        {error && <p className="text-sm text-red-400 font-semibold">{error}</p>}
      </div>
    </div>
  );
};
