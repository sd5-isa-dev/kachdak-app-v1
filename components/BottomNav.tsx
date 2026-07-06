"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, User, ShoppingBag } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.includes('/product/') || pathname.includes('/cart')) return null;

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-[#3A1C20] text-[#FFF0E6] rounded-t-[2.5rem] shadow-lg z-50 h-20">
      <div className="flex justify-between items-center px-6 h-full relative">
        <Link href="/cart" className="text-[#FFF0E6]/60 hover:text-[#FFF0E6] transition-colors p-2">
          <ShoppingBag size={24} />
        </Link>
        <Link href="#" className="text-[#FFF0E6]/60 hover:text-[#FFF0E6] transition-colors p-2">
          <Map size={24} />
        </Link>
        
        <div className="relative -top-6">
          <Link href="/" className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C44C27] text-white shadow-lg border-4 border-[#FFF0E6]">
            <Home size={28} />
          </Link>
        </div>

        <Link href="#" className="text-[#FFF0E6]/60 hover:text-[#FFF0E6] transition-colors p-2">
          <Heart size={24} />
        </Link>
        <Link href="#" className="text-[#FFF0E6]/60 hover:text-[#FFF0E6] transition-colors p-2">
          <User size={24} />
        </Link>
      </div>
    </div>
  );
}
