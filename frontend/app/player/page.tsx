"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { VideoPlayer } from "@/components/video/VideoPlayer";

const PlayerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imdbId = searchParams.get("imdbId")?.trim() || "";
  const quality = searchParams.get("quality")?.trim() || "";
  const title = searchParams.get("title")?.trim() || "";
  const runtimeParam = searchParams.get("runtime")?.trim() || "";
  const runtime = Number(runtimeParam) || 0;

  if (!imdbId || !quality) {
    return (
      <div className="min-h-screen bg-[#0a0b10] text-white flex flex-col">
        <Navbar authenticated />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <h1 className="text-2xl font-bold">Missing player parameters</h1>
          <p className="text-white/60">We need a movie id and quality to start streaming.</p>
          <button
            onClick={() => router.back()}
            className="text-sm font-bold text-primary hover:underline"
          >
            Go back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white flex flex-col">
      <Navbar authenticated />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl flex flex-col gap-6">
          <button
            onClick={() => router.back()}
            className="text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            ← Back to details
          </button>
          <VideoPlayer imdbId={imdbId} quality={quality} movieTitle={title} runtime={runtime} />
        </div>
      </main>
    </div>
  );
};

export default function PlayerPage() {
  return (
    <Suspense
      fallback={<div className="text-white/60 text-sm">Loading player...</div>}
    >
      <PlayerContent />
    </Suspense>
  );
}
