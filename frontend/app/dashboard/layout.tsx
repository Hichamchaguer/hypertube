import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0b10]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar authenticated />
        <main className="flex-1 overflow-y-auto px-10 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
