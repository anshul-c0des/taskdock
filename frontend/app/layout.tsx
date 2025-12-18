import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TaskDock | Collaborative Task Management",
  description: "The modern workspace for high-performing teams to manage tasks and sync in real-time.",
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.variable} font-sans antialiased bg-[#F9FAFB] text-[#0F172A]`}
      >
        <Providers>
          {children}
          <Toaster 
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      border: '1px solid #E2E8F0',
      padding: '12px 16px',
      color: '#0F172A',
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    success: {
      iconTheme: {
        primary: '#6366F1',
        secondary: '#FFFFFF',
      },
    },
    error: {
      iconTheme: {
        primary: '#EF4444',
        secondary: '#FFFFFF',
      },
      style: {
        border: '1px solid #FEE2E2',
      },
    },
  }} 
/>
        </Providers>
      </body>
    </html>
  );
}