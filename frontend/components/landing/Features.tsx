import React from "react";
import { Zap, Shield, Tv } from "lucide-react";

export const Features = () => {
  return (
    <section id="features" className="text-center space-y-16">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold text-white tracking-tight">Powerful Features</h2>
        <p className="text-[#94a3b8] max-w-2xl mx-auto text-lg font-medium">
          Hypertube combines the best of torrent technology with modern streaming for an unparalleled experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        {[
          { icon: Zap, title: "Instant Streaming", desc: "Start watching as soon as the download begins. No wait, just pure entertainment." },
          { icon: Shield, title: "Secure & Private", desc: "No personal data required. Watch your favorite movies with total anonymity and peace of mind." },
          { icon: Tv, title: "HD Quality", desc: "Enjoy movies in crystal clear high definition quality. Supporting up to 4K resolution." }
        ].map((f, i) => (
          <div key={i} className="bg-[#1a1c26]/40 border border-white/5 p-12 rounded-[2.5rem] hover:bg-[#1a1c26]/60 transition-all duration-300 group text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <f.icon className="w-10 h-10 text-primary" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">{f.title}</h4>
            <p className="text-[#94a3b8] leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
