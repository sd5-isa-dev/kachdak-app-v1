import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import './globals.css'; // Global styles

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Kechdak',
  description: 'A complete, production-ready mobile app for coffee ordering',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-gray-100 min-h-screen flex items-center justify-center font-sans antialiased" suppressHydrationWarning>
        <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[40px] sm:overflow-hidden sm:shadow-2xl bg-[#FDF1E8] relative flex flex-col">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
