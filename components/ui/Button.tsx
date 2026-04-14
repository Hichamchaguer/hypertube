import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "github" | "google" | "fortytwo" | "gitlab" | "discord";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5",
      secondary: "bg-card text-white hover:bg-card-border",
      outline: "border border-card-border bg-transparent text-white hover:bg-card-border",
      ghost: "hover:bg-card-border text-muted hover:text-white",
      github: "bg-github text-white hover:opacity-90",
      google: "bg-google text-[#444] hover:bg-gray-100",
      fortytwo: "bg-fortytwo text-white hover:opacity-90 border border-white/20",
      gitlab: "bg-gitlab text-white hover:opacity-90",
      discord: "bg-discord text-white hover:opacity-90",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
