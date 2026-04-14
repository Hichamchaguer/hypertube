import React from "react";
import { History } from "lucide-react";
import { HistoryCard } from "@/components/ui/HistoryCard";

const watchHistory = [
  { 
    id: "deadpool",
    title: "Deadpool", 
    year: 2016, 
    rating: 8.0, 
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop", 
    duration: "1h 48m",
    description: "This is the origin story of former Special Forces operative turned mercenary Wade Wilson, who after being subjected to a rogue experiment that leaves him with accelerated healing powers, adopts the alter ego Deadpool."
  },
  { 
    id: "shawshank-redemption",
    title: "The Shawshank Redemption", 
    year: 1994, 
    rating: 9.3, 
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", 
    duration: "2h 22m",
    description: "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit."
  },
  { 
    id: "f1",
    title: "F1", 
    year: 2025, 
    rating: 7.8, 
    image: "https://images.unsplash.com/photo-1541139414902-140306ea4651?q=80&w=1000&auto=format&fit=crop", 
    duration: "2h 36m",
    description: "Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 team—and mentor a young hotshot driver—while chasing one more chance at glory."
  },
  { 
    id: "joker",
    title: "Joker", 
    year: 2019, 
    rating: 8.3, 
    image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?q=80&w=1000&auto=format&fit=crop", 
    duration: "2h 2m",
    description: "A socially inept clown for hire - Arthur Fleck aspires to be a stand up comedian among his small job working dressed as a clown holding a sign for advertising. He has a condition where he laughs uncontrollably..."
  },
  { 
    id: "interstellar",
    title: "Interstellar", 
    year: 2014, 
    rating: 8.7, 
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop", 
    duration: "2h 49m",
    description: "Earth's future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system..."
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Welcome back, <span className="text-gradient">Yassine</span>
        </h1>
        <p className="text-muted/80 font-medium">Ready to continue your movie journey?</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
             <History className="w-6 h-6 text-[#ef4444]" />
             <h2 className="text-xl font-bold text-white tracking-wide">
               Your Watch History
            </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {watchHistory.map((movie, idx) => (
            <HistoryCard 
              key={idx}
              id={movie.id}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              image={movie.image}
              duration={movie.duration}
              description={movie.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
