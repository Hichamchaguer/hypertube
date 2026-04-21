import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "hd" | "rating" | "genre";
  className?: string;
}

export const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase";
  
  const variants = {
    default: "bg-card-border text-white",
    hd: "bg-red-500 text-white",
    rating: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    genre: "bg-primary/10 text-primary border border-primary/20",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  );
};
