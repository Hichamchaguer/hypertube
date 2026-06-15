"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { fetchUser } from "@/api/services/getData";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart3, 
  History, 
  Library, 
  User, 
  LogOut,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";


const navItems = [
  { label: "Popular Movies", icon: Flame, href: "/dashboard" },
  { label: "Watch History", icon: History, href: "/dashboard/history" },
  { label: "My Library", icon: Library, href: "/dashboard/library" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = React.useState({
    username: "",
    profilePicture: ''
  });

  React.useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser();
        setUserName(userData);
        if (!userData) {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/signin");
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <aside className="w-64 h-screen border-r border-card-border/50 bg-[#0a0b10] flex flex-col pt-8 pb-6 sticky top-0">
      <div className="px-6 mb-10">
        <div className="bg-card/50 rounded-2xl p-3 border border-card-border/50 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
            <Image
              src={userName.profilePicture || "/default-avatar.png"}
              alt="Avatar"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{userName.username}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard/popular");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted hover:text-white hover:bg-card/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isActive && "group-hover:text-primary")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 hover:text-red-500 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};
