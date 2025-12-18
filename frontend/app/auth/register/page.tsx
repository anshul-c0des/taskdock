'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerUser, loading } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await registerUser(data);
      if (res) {
        toast.success('Welcome to TaskDock!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] px-4 py-8 font-sans">
      <div>
        <Link href='/'>
      <div className="flex items-center gap-2 mb-6 transition-opacity hover:opacity-80">
        <div className="bg-[#6366F1] p-1.5 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#0F172A]">TaskDock</span>
      </div>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-5 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6 -mt-2">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Start managing projects with your team today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-slate-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  {...register('name')} 
                  id="name"
                  placeholder="John Doe" 
                  className="pl-10 h-11 focus-visible:ring-[#6366F1] border-slate-200"
                />
              </div>
              {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  {...register('email')} 
                  id="email"
                  type="email" 
                  placeholder="name@work.com" 
                  className="pl-10 h-11 focus-visible:ring-[#6366F1] border-slate-200"
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  {...register('password')} 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11 focus-visible:ring-[#6366F1] border-slate-200"
                />
              </div>
              {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-xl transition-all shadow-sm shadow-indigo-100 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2 text-lg">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-5 mb-0 pt-4 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}