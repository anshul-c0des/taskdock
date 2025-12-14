'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-20 sm:py-32 bg-gradient-to-b from-indigo-600 to-indigo-400 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">TaskDock</h1>
        <p className="text-lg sm:text-xl mb-8 max-w-xl">
          Set tasks, collaborate in real-time, and keep your team on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/login">
            <Button variant="default" size="lg">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="secondary" size="lg">Sign Up</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 sm:py-24 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Organize Tasks</h3>
          <p>Create, assign, and manage tasks easily for your team.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
          <p>Work together with your team and track updates instantly.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Stay Productive</h3>
          <p>Prioritize tasks, set deadlines, and hit your goals faster.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} TaskDock. All rights reserved.
      </footer>
    </main>
  );
}
