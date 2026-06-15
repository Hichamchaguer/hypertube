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
import api from "@/api/axios";
import { AxiosError } from "axios";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ 
    firstName: "",
    lastName: "",
    username: "", 
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      router.push("/signin");
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center">
      <React.Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </React.Suspense>

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

          <div className="mb-8">
            <Button variant="google" className="w-full gap-3 py-6 rounded-2xl" type="button">
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-card-border/50" />
            <span className="relative bg-card px-4 text-xs text-muted uppercase tracking-widest leading-none">or</span>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignUp}>
            <div className="flex gap-4">
              <Input 
                label="First Name" 
                placeholder="First name" 
                icon={<User className="w-4 h-4" />}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input 
                label="Last Name" 
                placeholder="Last name" 
                icon={<User className="w-4 h-4" />}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
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
