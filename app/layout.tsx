import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Outfit, Inter } from 'next/font/google';

import { BottomNav } from '@/components/BottomNav';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kechdak Coffee',
  description: 'A modern, production-ready coffee shop application with a curated menu, shopping cart, and checkout flow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-gray-100 text-[#3A1C20] min-h-screen flex justify-center" suppressHydrationWarning>
        <div className="w-full max-w-md bg-[#FFF0E6] min-h-screen relative shadow-2xl overflow-hidden pb-24">
          <AuthProvider>
            {children}
            <BottomNav />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
