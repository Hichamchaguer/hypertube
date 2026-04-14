import React from "react";
import { User, Mail, Camera, Save, Shield } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  return (
    <div className="space-y-12 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          My <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-muted/80 font-medium">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Avatar Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="relative group">
            <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-card/50 ring-1 ring-white/10 shadow-2xl">
              <Image 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine" 
                alt="Profile Avatar" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] cursor-pointer">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/20">
                    <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-white">ybel-hac</p>
              <p className="text-sm text-muted">Member since April 2026</p>
            </div>
          </div>
          
          <div className="p-6 bg-card/20 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white font-bold text-sm">
                <Shield className="w-4 h-4 text-primary" />
                Account Security
            </div>
            <p className="text-xs text-muted leading-relaxed">
                Your account is currently secured with a strong password. We recommend updating it every few months.
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-10">
          <div className="space-y-6 bg-[#1a1c26]/40 p-10 rounded-[2.5rem] border border-white/5">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                    label="First Name" 
                    defaultValue="Yassine" 
                    placeholder="Enter your first name"
                />
                <Input 
                    label="Last Name" 
                    defaultValue="Hac" 
                    placeholder="Enter your last name"
                />
            </div>
            
            <Input 
                label="Username" 
                defaultValue="ybel-hac" 
                placeholder="Enter your username"
                icon={<User className="w-4 h-4 text-muted" />}
            />
            
            <Input 
                label="Email Address" 
                defaultValue="yassine@hypertube.com" 
                placeholder="Enter your email"
                icon={<Mail className="w-4 h-4 text-muted" />}
            />

            <div className="pt-4">
                <Button className="w-full sm:w-auto gap-3 h-14 px-10 rounded-2xl">
                    <Save className="w-5 h-5" />
                    Save Changes
                </Button>
            </div>
          </div>

          <div className="space-y-6 bg-[#ef4444]/5 p-10 rounded-[2.5rem] border border-[#ef4444]/10">
            <h3 className="text-xl font-bold text-white">Danger Zone</h3>
            <p className="text-sm text-muted">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="ghost" className="bg-transparent border border-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444] hover:text-white rounded-xl font-bold">
                Delete My Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
