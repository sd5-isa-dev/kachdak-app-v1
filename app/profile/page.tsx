'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Settings, Heart, ShoppingBag, X, Bell, Moon, CircleUserRound, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (loading) {
    return <div className="flex flex-col h-full bg-bg-light p-6 pt-16 items-center justify-center text-gray-500 font-medium">Loading profile...</div>;
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  const email = user.email || '';
  const initial = email ? email[0].toUpperCase() : 'U';

  return (
    <div className="flex flex-col h-full bg-bg-light relative">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-text-dark tracking-wide">Profile</h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Settings className="w-5 h-5 text-text-dark" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[120px] pt-4 hide-scrollbar">
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-inner flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-text-dark truncate">
              {user.user_metadata?.full_name || email.split('@')[0]}
            </h2>
            <p className="text-gray-400 text-sm font-medium truncate">{email}</p>
          </div>
        </div>

        <h3 className="font-bold text-text-dark text-[17px] mb-4">Account</h3>
        
        <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100 mb-6 flex flex-col gap-1">
          <Link href="/favorites" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-text-dark flex-1">My Favorites</span>
          </Link>
          <div className="h-px bg-gray-50 mx-4" />
          <Link href="/cart" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-text-dark flex-1">My Orders</span>
          </Link>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full bg-red-50 text-red-500 font-bold text-lg py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          Sign Out
        </button>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-bg-light rounded-t-[32px] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-xl font-bold text-text-dark">Settings</h2>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-text-dark" />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-6 pb-safe flex flex-col gap-6">
                
                <div>
                  <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-3">Preferences</h3>
                  <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center justify-between p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-semibold text-text-dark text-[15px]">Push Notifications</span>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative shadow-inner cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="h-px bg-gray-50 mx-4" />
                    <div className="flex items-center justify-between p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                          <Moon className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="font-semibold text-text-dark text-[15px]">Dark Mode</span>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded-full relative shadow-inner cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-3">Support</h3>
                  <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 flex flex-col gap-1">
                    <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors w-full text-left">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <CircleUserRound className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="font-semibold text-text-dark text-[15px]">Help Center</span>
                    </button>
                    <div className="h-px bg-gray-50 mx-4" />
                    <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors w-full text-left">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="font-semibold text-text-dark text-[15px]">Privacy Policy</span>
                    </button>
                  </div>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
