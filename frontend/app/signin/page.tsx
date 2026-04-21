"use client";

import React, { useState } from "react";
import { 
  Mail, 
  User, 
  Lock, 
  Eye, 
  ChevronLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/layout/Navbar";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Save simulated session
      localStorage.setItem("user", JSON.stringify({ name: "Yassine", username: formData.username || "yassine_hy" }));
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12">
        <div className="w-full max-w-md bg-card border border-card-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full" />

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-muted text-sm">Sign in to your Hypertube account</p>
          </div>

          <div className="space-y-3 mb-8">
            <Button onClick={handleSignIn} variant="github" className="w-full gap-3 py-6 rounded-2xl">
              <GithubIcon className="w-5 h-5" />
              Continue with GitHub
            </Button>
            <Button onClick={handleSignIn} variant="google" className="w-full gap-3 py-6 rounded-2xl">
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-card-border/50" />
            <span className="relative bg-card px-4 text-xs text-muted uppercase tracking-widest leading-none">or</span>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <Input 
              label="Username" 
              placeholder="Enter your username" 
              icon={<User className="w-4 h-4" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <div className="space-y-1">
              <Input 
                label="Password" 
                type="password"
                placeholder="Enter your password" 
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-7 text-lg uppercase tracking-wider font-bold gap-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <div className="text-center">
              <Link href="/signin" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
