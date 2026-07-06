'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-bg-light relative">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-text-dark" strokeWidth={2.5} />
        </button>
        <h1 className="text-[22px] font-bold text-text-dark tracking-wide">Checkout</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 px-6 pt-8 text-center flex flex-col items-center justify-center pb-20">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text-dark mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-xs">
          Your payment gateway logic would go here. For now, your order has been successfully placed.
        </p>
        
        <button 
          onClick={() => router.push('/')}
          className="bg-primary text-white font-bold text-lg px-10 py-3.5 rounded-full shadow-[0_8px_16px_rgba(210,96,31,0.4)]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
