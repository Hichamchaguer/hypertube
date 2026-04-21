"use client";

import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-white/5", className)} />
  );
};

export const MovieCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);
