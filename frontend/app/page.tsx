'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Users2, 
  Zap, 
  ArrowRight, 
  LayoutDashboard 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">TaskDock</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className='hover:text-primary cursor-pointer' size="sm">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-primary hover:bg-primary/90 cursor-pointer">Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="relative flex flex-col items-center text-center px-6 pt-10 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-white">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/5 opacity-50 blur-[80px]"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Real-time collaboration is here
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6">
            Work flows faster with <span className="text-primary">TaskDock</span>
          </h1>
          
          <p className="text-xs md:text-xl text-muted-foreground mb-10 px-2 mx-auto leading-relaxed">
            The modern workspace for high-performing teams. Manage tasks, 
            sync in real-time, and hit your milestones without the friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-md border-2 shadow-lg shadow-primary/20  border-primary  bg-white/50 backdrop-blur-sm cursor-pointer text-primary hover:bg-primary hover:text-white">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-md gap-2 shadow-lg shadow-primary/20 cursor-pointer hover:bg-white hover:text-primary">
                Start for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-15 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Built for modern collaboration</h2>
            <p className="text-muted-foreground text-sm md:text-md">Everything you need to ship projects faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Organization</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Streamline your workflow with intuitive task management. Categorize, prioritize, and conquer.
              </p>
            </div>

            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Sync</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Assign roles and tasks instantly. See live updates as your team moves the needle forward.
              </p>
            </div>

            <div className="group p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Speed</h3>
              <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                Powered by WebSockets for instant notifications. No more refresh-hunting for updates.
              </p>
            </div>
          </div>
        </div>
      </section>

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