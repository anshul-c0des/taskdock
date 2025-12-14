'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { registerUser, loginUser, loading } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const res = await loginUser(data);
    if (res) {
      toast.success('Logged In!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input {...register('email')} placeholder="Email" className="w-full p-2 mb-2 border rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input {...register('password')} placeholder="Password" type="password" className="w-full p-2 mb-2 border rounded" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <button disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded mt-2">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
