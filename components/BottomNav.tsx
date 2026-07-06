'use client';
import { Home, ShoppingBag, BookOpen, Heart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: ShoppingBag, href: '/cart' },
    { icon: BookOpen, href: '/menu' },
    { icon: Heart, href: '/favorites' },
    { icon: User, href: '/profile' },
  ];

  return (
    <div className="absolute bottom-0 w-full h-[90px] z-50">
      {/* Floating Home Button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
        <Link href="/">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_8px_24px_rgba(210,96,31,0.3)] border-[6px] border-bg-light cursor-pointer"
          >
            <Home className="text-white w-7 h-7" />
          </motion.div>
        </Link>
      </div>

      {/* Curved Nav Bar */}
      <div className="w-full h-full bg-surface-dark curve-top px-6 flex items-center justify-between pt-4">
        <div className="flex gap-8">
          {navItems.slice(0, 2).map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={idx} href={item.href}>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-white/60'}`} />
                </motion.div>
              </Link>
            );
          })}
        </div>
        <div className="flex gap-8">
          {navItems.slice(2, 4).map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={idx} href={item.href}>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-white/60'}`} />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
