'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Home as HomeIcon, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmed({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full bg-bg-light p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col items-center pt-10">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(34,197,94,0.3)]">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          {/* Decorative sparks */}
          <div className="absolute top-0 right-0 w-3 h-3 border-2 border-primary rotate-45" />
          <div className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-primary" />
          <div className="absolute top-8 -left-4 w-2 h-2 border border-primary rotate-45" />
        </div>

        <h1 className="text-2xl font-bold text-text-dark tracking-tight mb-8">Order Confirmed!</h1>

        <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center w-full max-w-[280px]">
          <div className="bg-white p-2 mb-6">
            <QRCodeSVG 
              value={id} 
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="h-px bg-gray-200 flex-1" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="font-bold text-lg leading-none pt-1 text-primary">K</span>
            </div>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <p className="text-gray-400 text-xs text-center mt-4">Show this code to the barista</p>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <Link 
          href="/"
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full flex justify-center shadow-[0_8px_24px_rgba(210,96,31,0.3)] mb-4 hover:opacity-90 transition-opacity"
        >
          Back Home
        </Link>
      </div>

      {/* Decorative Bottom Arch */}
      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-surface-dark rounded-t-[100px] -z-10 translate-y-10"></div>
      <Link href="/" className="fixed bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-50 hover:opacity-90 transition-opacity">
        <HomeIcon className="w-8 h-8 text-primary" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
