import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import dynamic from "next/dynamic";

const Features = dynamic(() => import("@/components/landing/Features"), {
  loading: () => <div className="h-[400px] w-full animate-pulse bg-white/5 rounded-[2.5rem]" />,
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center font-sans">
      <React.Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </React.Suspense>

      <main className="w-full max-w-7xl px-8 flex flex-col pt-16 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-20 py-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Stream <span className="text-gradient">Thousands</span> <br />
              of Movies Instantly
            </h1>
            <p className="text-[#94a3b8] text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Hypertube brings the power of BitTorrent streaming to your browser. 
              Watch your favorite movies in HD with no ads, no subscriptions, and no waiting.
            </p>

            <div className="flex flex-col gap-6 pt-4 max-w-md mx-auto lg:mx-0">
              <Link href="/signin">
                <Button className="h-16 px-10 text-lg font-bold rounded-2xl w-fit mx-auto lg:mx-0 shadow-2xl shadow-primary/20">
                  Start Watching Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Card */}
          <div className="flex-1 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] bg-[#1a1c26] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl group overflow-hidden">
                <div className="relative aspect-[1.4/1] rounded-[1.8rem] overflow-hidden mb-6">
                    <Image 
                        src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop" 
                        alt="The Shawshank Redemption" 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 440px"
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
                
                <div className="space-y-4 px-2">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">The Shawshank Redemption</h3>
                        <p className="text-xl font-bold text-white tracking-tight text-center lg:text-left">(1994)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="hd" className="bg-[#ef4444] text-white border-transparent px-3 py-1 rounded">HD</Badge>
                        <Badge variant="genre" className="bg-[#1a1c26] border border-white/10 text-white/70 px-4 py-1 rounded">Action</Badge>
                        <Badge variant="rating" className="bg-[#eab308] text-black border-transparent px-3 py-1 rounded flex items-center gap-1.5 font-bold">
                            <Star className="w-4 h-4 fill-current" />
                            9.3
                        </Badge>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-24" />

        {/* Features Section */}
        <Features />
      </main>
    </div>
  );
}
