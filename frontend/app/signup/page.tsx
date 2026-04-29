"use client";

import React, { useState } from "react";
import { 
  Mail, 
  User, 
  Lock, 
  Loader2,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/layout/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: "",
    username: "", 
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      // Save simulated session
      localStorage.setItem("user", JSON.stringify({ 
        name: formData.fullName || "New User", 
        username: formData.username || "new_user" 
      }));
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12">
        <div className="w-full max-w-md bg-card border border-card-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />

          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors mb-6 group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to home
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-muted text-sm">Join Hypertube and start streaming</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignUp}>
            <Input 
              label="Full Name" 
              placeholder="Enter your full name" 
              icon={<User className="w-4 h-4" />}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input 
              label="Username" 
              placeholder="Choose a username" 
              icon={<User className="w-4 h-4" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <Input 
              label="Email Address" 
              type="email"
              placeholder="Enter your email" 
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input 
              label="Password" 
              type="password"
              placeholder="Create a password" 
              icon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Input 
              label="Confirm Password" 
              type="password"
              placeholder="Confirm your password" 
              icon={<Lock className="w-4 h-4" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button 
              type="submit" 
              className="w-full py-7 text-lg uppercase tracking-wider font-bold gap-3 mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-sm text-muted">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:text-primary/80 transition-colors font-bold ml-1">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
