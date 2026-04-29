"use client";

import React, { useRef } from "react";
import { 
  Search, 
  Zap, 
  Shield, 
  Tv, 
  Star, 
  Play, 
  ChevronRight, 
  Activity, 
  CheckCircle2,
  Globe,
  Sparkles,
  ZapOff
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#05060a] flex flex-col items-center font-sans relative overflow-hidden selection:bg-primary/30">
      
      {/* Ultra-Premium Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.15)_0%,transparent_50%)]" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-mesh-1" />
          <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-mesh-2" />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full animate-mesh-3" />
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Navbar />

      <main className="w-full max-w-7xl px-8 flex flex-col pt-16 pb-32 relative z-10">
        
        {/* Floating Notification */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
        >
            <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass px-6 py-2 rounded-full flex items-center gap-3 border-white/10 active:scale-95 transition-transform cursor-pointer">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/90">Experience Cinema 4.0 in 8K</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] font-bold text-primary">Join 2.4M Watchers</span>
                </div>
            </div>
        </motion.div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-24 items-center min-h-[70vh]">
          <motion.div 
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
                <div className="inline-block">
                    <span className="text-xs font-black tracking-[0.4em] text-primary uppercase mb-4 block">Streaming Evolution</span>
                    <div className="h-1 w-12 bg-primary rounded-full mb-8" />
                </div>
                <h1 className="text-7xl lg:text-9xl font-black leading-[0.95] tracking-tighter text-white uppercase italic">
                  THE <br />
                  <span className="text-gradient drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">FUTURE</span> <br />
                  OF CINEMA.
                </h1>
                <p className="text-[#94a3b8] text-xl max-w-xl leading-relaxed font-medium">
                  The world's most powerful peer-to-peer streaming engine. 
                  Uncapped bitrates. Zero trackers. Direct 42-node distribution. 
                  <span className="text-white"> Welcome to the new standard.</span>
                </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-10 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/signup">
                    <Button className="h-24 px-16 text-2xl font-black rounded-[2rem] shadow-[0_20px_50px_rgba(239,68,68,0.35)] gap-4 group relative overflow-hidden border-t border-white/20">
                       <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary group-hover:scale-105 transition-transform duration-500" />
                       <Play className="w-7 h-7 fill-current relative z-10" />
                       <span className="relative z-10">JOIN THE VOID</span>
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-4 glass px-6 py-4 rounded-[1.8rem] border-white/5">
                      <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white/10 bg-card overflow-hidden relative">
                                  <Image 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                                    alt="u" 
                                    fill 
                                    unoptimized
                                    className="object-cover" 
                                  />
                              </div>
                          ))}
                      </div>
                      <div className="space-y-0.5">
                          <p className="text-xs font-black text-white">LIVE FEED</p>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Global Watchers</p>
                      </div>
                  </div>
              </div>

              <div className="flex items-center gap-8 justify-center lg:justify-start">
                  {[
                      { icon: Activity, label: "0ms LATENCY" },
                      { icon: Globe, label: "PEER MESH" },
                      { icon: CheckCircle2, label: "8K READY" }
                  ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                          <item.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-black text-muted tracking-widest uppercase">{item.label}</span>
                      </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Ultra-Stunning Image Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center items-center"
          >
              {/* Spinning Ring */}
              <div className="absolute inset-[-10%] border border-white/5 rounded-full animate-spin-slow pointer-events-none" />
              <div className="absolute inset-[-5%] border border-primary/10 rounded-full animate-spin-reverse pointer-events-none" />

              <div className="relative z-20 w-full max-w-[500px]">
                  {/* Floating Top Card */}
                  <motion.div 
                    animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -top-12 -left-12 z-30 glass p-6 rounded-[2rem] border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] space-y-4 max-w-[200px]"
                  >
                      <div className="bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                          <p className="text-xs font-black text-white">MEGA BITRATE</p>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-full bg-primary" 
                              />
                          </div>
                      </div>
                  </motion.div>

                  {/* Main Cinematic Poster */}
                  <div className="relative aspect-[10/14] rounded-[4rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10">
                      <Image 
                        src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop" 
                        alt="The Void" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      
                      <div className="absolute inset-0 p-12 flex flex-col justify-end gap-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                          <Badge className="w-fit bg-white/10 backdrop-blur-3xl border-white/10 text-white font-black italic rounded-full px-6 tracking-widest uppercase text-[10px]">Upcoming Masterpiece</Badge>
                          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">ETHEREAL <br /><span className="text-gradient">DRIFT</span></h2>
                          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                              <Button size="sm" className="rounded-xl px-8 font-black text-xs gap-2">
                                  <Play className="w-3 h-3 fill-current" />
                                  TRAILER
                              </Button>
                          </div>
                      </div>
                  </div>

                  {/* Floating Indicator */}
                  <motion.div 
                    animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute -bottom-8 -right-8 z-30 glass p-5 rounded-[2rem] border-white/10 flex items-center gap-4"
                  >
                      <div className="relative">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0" />
                          <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-white uppercase italic">Active Node</span>
                  </motion.div>
              </div>
          </motion.div>
        </div>

        {/* Brand/Partner Section (Glass Ribbon) */}
        <div className="mt-32 w-full py-10 glass rounded-[3rem] border-white/5 flex flex-wrap justify-center items-center gap-16 px-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {['Paramount', 'Netflix', 'IMAX', 'A24', 'Warner Bros'].map((brand, i) => (
                <span key={i} className="text-xl md:text-2xl font-black text-white italic tracking-tighter opacity-40 hover:opacity-100 transition-opacity cursor-default">{brand}</span>
            ))}
        </div>

        {/* Feature Grid with Ultra Cards */}
        <div className="py-40 space-y-24">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black text-white italic uppercase leading-none tracking-tighter">Pure Tech. <br />No Fluff.</h2>
                    <p className="text-muted text-lg max-w-sm font-medium">We built the engine you deserve. High bandwidth, crystal clear, total safety.</p>
                </div>
                <Link href="/signup" className="group">
                    <div className="flex items-center gap-4 text-white font-black text-sm tracking-widest uppercase italic border-b-2 border-primary pb-2 group-hover:gap-6 transition-all">
                        Unlock Premium Nodes
                        <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                {[
                    { title: "Direct Play", sub: "0.1s Pre-roll", icon: Zap, color: "from-blue-500 to-cyan-500" },
                    { title: "Mesh Net", sub: "P2P Core", icon: Globe, color: "from-primary to-secondary" },
                    { title: "Vault Sync", sub: "Private 1.0", icon: Shield, color: "from-green-500 to-emerald-500" }
                ].map((feat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -15 }}
                        className="group relative h-[450px] rounded-[4rem] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-card/40 border border-white/5 group-hover:border-primary/50 transition-colors" />
                        <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${feat.color} opacity-0 group-hover:opacity-100 transition-all`} />
                        
                        <div className="relative h-full p-12 flex flex-col">
                            <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-2xl`}>
                                <feat.icon className="w-10 h-10 text-white" />
                            </div>
                            <div className="mt-auto space-y-4">
                                <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter">{feat.title}</h4>
                                <p className="text-muted font-bold text-xs tracking-widest uppercase">{feat.sub}</p>
                                <p className="text-[#64748b] leading-relaxed">Engineered using Next-gen dist protocols for the most stable bitstream on the internet today.</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Massive End CTA */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="relative w-full py-40 flex flex-col items-center text-center space-y-12"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[180px] rounded-full pointer-events-none" />
            <h2 className="text-7xl lg:text-[10rem] font-black text-white uppercase italic leading-[0.8] tracking-tighter">
                READY TO <br />
                <span className="text-gradient drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]">ASCEND?</span>
            </h2>
            <Link href="/signup">
                <Button className="h-28 px-24 text-3xl font-black rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(239,68,68,0.4)] hover:shadow-[0_40px_100px_-15px_rgba(239,68,68,0.6)] animate-pulse hover:animate-none transition-all">
                    YES, TAKE ME IN
                </Button>
            </Link>
        </motion.div>

      </main>

      {/* Ultra-Animations */}
      <style jsx global>{`
        @keyframes mesh-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 10%) scale(1.2); }
          66% { transform: translate(-10%, 5%) scale(0.9); }
        }
        @keyframes mesh-2 {
          0%, 100% { transform: translate(0, 0) scale(1.2); }
          33% { transform: translate(-15%, -5%) scale(1); }
          66% { transform: translate(10%, -10%) scale(1.1); }
        }
        @keyframes mesh-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20%, 20%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-mesh-1 { animation: mesh-1 25s infinite ease-in-out; }
        .animate-mesh-2 { animation: mesh-2 30s infinite ease-in-out; }
        .animate-mesh-3 { animation: mesh-3 20s infinite linear; }
        .animate-spin-slow { animation: spin-slow 60s infinite linear; }
        .animate-spin-reverse { animation: spin-reverse 45s infinite linear; }
      `}</style>
    </div>
  );
}
