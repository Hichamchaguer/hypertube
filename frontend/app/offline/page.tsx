"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 70%) pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white">
            NO <span className="text-red-500">SIGNAL</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            It looks like you've lost your connection. Check your network settings and try again.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Button 
            onClick={() => window.location.reload()}
            className="h-14 px-10 text-lg font-bold rounded-2xl bg-red-600 hover:bg-red-500 shadow-xl shadow-red-600/20 w-fit"
          >
            Try Again
          </Button>
          
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-white"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 justify-center pt-8">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Connection Lost
          </span>
        </div>
      </div>
    </div>
  );
}