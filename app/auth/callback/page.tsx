'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorDesc = hashParams.get('error_description');
      if (errorDesc) {
        return errorDesc.replace(/\+/g, ' ');
      }
    }
    return null;
  });

  useEffect(() => {
    if (errorMsg) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });
    
    // Fallback if already signed in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [errorMsg, router]);

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg-light p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-text-dark mb-2">Authentication Error</h1>
        <p className="text-gray-500 mb-6">{errorMsg}</p>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          If you used an email link, it may have expired. Please try signing in again.
          Make sure the Site URL in Supabase is set to your actual app URL!
        </p>
        <Link 
          href="/auth"
          className="bg-primary text-white font-bold text-lg px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(210,96,31,0.4)]"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full bg-bg-light">
      <span className="text-gray-500 font-medium">Authenticating...</span>
    </div>
  );
}
