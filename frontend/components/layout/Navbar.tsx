"use client";

import React from "react";
import { Search, LogOut } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import api from "@/api/axios";

interface NavbarProps {
  authenticated?: boolean;
}

export const Navbar = ({ authenticated = false }: NavbarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(searchParams?.get("search") || "");
  const [isAuth, setIsAuth] = React.useState(authenticated);
  const [isLoading, setIsLoading] = React.useState(!authenticated);

  React.useEffect(() => {
    // If not explicitly authenticated via prop, try to fetch user session
    if (!authenticated) {
      if (localStorage.getItem("user")) {
         setIsAuth(true);
         setIsLoading(false);
      } else {
         api.get("/user")
           .then(() => {
             setIsAuth(true);
             setIsLoading(false);
           })
           .catch(() => {
             setIsAuth(false);
             setIsLoading(false);
           });
      }
    } else {
      setIsAuth(true);
      setIsLoading(false);
    }
  }, [authenticated]);

  React.useEffect(() => {
    const q = searchParams?.get("search") || "";
    if (q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    try {
      await api.post("/logout");
    } catch(err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    setIsAuth(false);
    router.push("/signin");
  };

  React.useEffect(() => {
    if (!isAuth) return;

    // Only auto-search if on dashboard or if there's a search occurring
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
      } else if (searchQuery === "" && window.location.search.includes("search=")) {
        // If cleared and was searching, go back to dashboard
        router.push('/dashboard');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isAuth, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <nav className="w-full flex items-center justify-between py-6 px-8 transition-all duration-300 max-w-7xl mx-auto">
        <Logo />
        <div className="w-20" /> {/* Placeholder */}
      </nav>
    );
  }

  return (
    <nav className={cn(
      "w-full flex items-center justify-between py-6 px-8 relative transition-all duration-300",
      isAuth ? "bg-transparent" : "max-w-7xl mx-auto"
    )}>
      <Logo />

      {!isAuth ? (
        <>
          {/* <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/history" className="text-sm font-medium text-muted hover:text-white transition-colors">History</Link>
            <Link href="/dashboard/library" className="text-sm font-medium text-muted hover:text-white transition-colors">Library</Link>
            <Link href="/dashboard/profile" className="text-sm font-medium text-muted hover:text-white transition-colors">Profile</Link>
          </div> */}
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-medium text-muted hover:text-white transition-colors px-4">Sign In</Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" className="px-6 rounded-lg font-bold">Sign Up</Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-6 flex-1 max-w-xl mx-12">
          <form className="relative w-full" onSubmit={handleSearch}>
            <Input 
              placeholder="Search movies, TV shows..." 
              icon={<Search className="w-4 h-4" />}
              className="h-10 bg-card/30 border-card-border/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button 
            variant="primary" 
            size="sm" 
            className="bg-red-600/90 hover:bg-red-600 shadow-red-600/20 gap-2 shrink-0 border-none"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  );
};
