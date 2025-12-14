import { ReactNode } from "react";
import MobileNav from "@/components/layout/MobileNav";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 pb-20 max-w-5xl mx-auto">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
