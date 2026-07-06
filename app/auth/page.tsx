'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Coffee, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.636 10.223c-.046-2.732 2.228-4.062 2.333-4.126-1.265-1.85-3.23-2.102-3.931-2.133-1.674-.17-3.266.985-4.116.985-.851 0-2.164-1.002-3.551-.974-1.802.028-3.468.995-4.398 2.617-1.884 3.269-.481 8.113 1.353 10.767.896 1.3 1.956 2.75 3.351 2.698 1.341-.055 1.849-.868 3.414-.868 1.565 0 2.02.868 3.44.84 1.45-.028 2.378-1.328 3.266-2.627 1.03-1.5 1.455-2.955 1.477-3.033-.031-.013-2.585-.992-2.638-4.146zm-2.316-6.195c.74-.897 1.238-2.146 1.102-3.393-1.074.043-2.365.715-3.12 1.613-.675.795-1.272 2.062-1.11 3.295 1.196.092 2.387-.618 3.128-1.515z" fill="#000000"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

export default function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div className="flex flex-col h-full bg-[#FFF5EE] justify-center items-center">
        <Coffee className="w-10 h-10 text-primary animate-pulse mb-4" />
        <span className="text-gray-500 font-medium">Loading...</span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // User will be redirected by useEffect
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        // Optional: show a message to check email, or if auto-confirm is on, it will log them in.
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'OAuth login failed');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF5EE] overflow-y-auto hide-scrollbar relative">
      {/* Top Image & Arch */}
      <div className="relative h-[260px] shrink-0">
        <Image 
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1200&h=800" 
          alt="Coffee Background"
          fill
          className="object-cover"
          priority
        />
        {/* Arch Overlay */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 375 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
            <path d="M0 100V40C0 40 90 0 187.5 0C285 0 375 40 375 40V100H0Z" fill="#FFF5EE" />
          </svg>
        </div>
        
        {/* Logo Circle */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-24 h-24 bg-[#FFE8D6] rounded-full flex items-center justify-center shadow-sm border-4 border-[#FFF5EE]">
          <div className="w-14 h-14 relative text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <path d="M8 12c.5-1 1.5-1 2-1s1.5.5 2 1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-12 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-extrabold text-[#2C1810] tracking-tight">Kechdak</h1>
          <p className="text-[#5C4D46] text-sm mt-1">Good Coffee, Great Day</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2C1810]">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-[#5C4D46] text-sm mt-1">
            {isLogin ? 'Login to continue' : 'Sign up to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#D2601F]" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#D2601F]/20 text-[#2C1810] placeholder-[#A0938C] font-medium shadow-sm outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#D2601F]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#D2601F]/20 text-[#2C1810] placeholder-[#A0938C] font-medium shadow-sm outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#D2601F]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-[#D2601F]/20 text-[#2C1810] placeholder-[#A0938C] font-medium shadow-sm outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A0938C] hover:text-[#2C1810] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {isLogin && (
            <div className="flex justify-end pt-1">
              <button type="button" className="text-[#D2601F] text-sm font-medium hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e85d04] hover:bg-[#d05303] text-white font-bold py-4 rounded-2xl shadow-[0_8px_24px_rgba(232,93,4,0.3)] transition-all active:scale-[0.98] mt-6 flex justify-center items-center"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-full border-t border-[#E8DCC] border-opacity-50"></div>
            <span className="bg-[#FFF5EE] px-4 text-[#A0938C] text-sm font-medium relative">or continue with</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => handleOAuthLogin('google')}
              className="bg-white py-3 rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
            >
              <GoogleIcon />
            </button>
            <button 
              onClick={() => handleOAuthLogin('apple')}
              className="bg-white py-3 rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
            >
              <AppleIcon />
            </button>
            <button 
              onClick={() => handleOAuthLogin('facebook')}
              className="bg-white py-3 rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
            >
              <FacebookIcon />
            </button>
          </div>

          <p className="text-center text-[#5C4D46] text-sm mt-8 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#e85d04] font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
