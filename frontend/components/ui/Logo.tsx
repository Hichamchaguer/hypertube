import React from "react";
import { Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2 group", className)}>
      <div className="bg-primary p-1.5 rounded-lg rotate-0 group-hover:rotate-12 transition-transform duration-300">
        <Play className="w-5 h-5 fill-white text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-white">Hyper</span>
        <span className="text-secondary">tube</span>
      </span>
    </Link>
  );
};
