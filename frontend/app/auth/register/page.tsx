'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerUser, loading } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const res = await registerUser(data);
    if (res) {
      toast.success('Registered!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input {...register('name')} placeholder="Name" className="w-full p-2 mb-2 border rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <input {...register('email')} placeholder="Email" className="w-full p-2 mb-2 border rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input {...register('password')} placeholder="Password" type="password" className="w-full p-2 mb-2 border rounded" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <button disabled={loading} className="w-full p-2 bg-green-600 text-white rounded mt-2">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
