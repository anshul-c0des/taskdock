"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Users2,
  Zap,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto w-full max-w-7xl backdrop-blur-md transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            TaskDock
          </span>
        </div>
        <div className="hidden sm:flex gap-4">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="hover:text-primary cursor-pointer"
              size="sm"
            >
              Log in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 cursor-pointer"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main section */}
      <section className="relative flex flex-col items-center text-center px-6 pt-26 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/10 opacity-60 blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Live Sync Active
          </div>

          {/*Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-8 leading-[1.05]">
            Work flows faster <br />
            with{" "}
            <span className="text-primary decoration-primary/30 underline underline-offset-8">
              TaskDock
            </span>
          </h1>

          <p className="text-md md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The central nervous system for high-performing teams.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all cursor-pointer"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full bg-primary/5 hover:shadow-md shadow-primary/20 sm:w-auto h-14 px-10 text-lg font-semibold rounded-2xl  hover:bg-primary/10 hover:text-primary  cursor-pointer transition-all"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-15 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Built for modern collaboration
            </h2>
            <p className="text-muted-foreground text-sm md:text-md">
              Everything you need to ship projects faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Organization</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Streamline your workflow with intuitive task management.
                Categorize, prioritize, and conquer.
              </p>
            </div>

            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Sync</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Assign roles and tasks instantly. See live updates as your team
                moves the needle forward.
              </p>
            </div>

            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Speed</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Powered by WebSockets for instant notifications. No more
                refresh-hunting for updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 text-center border-t border-border bg-background">
        <div className="flex items-center justify-center gap-2 mb-2">
          <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">TaskDock</span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TaskDock. Designed for efficiency.
        </p>
      </footer>
    </main>
  );
}
