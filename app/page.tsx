'use client';

import { Menu, Search, Plus, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, Category, Product } from '@/lib/supabase';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { addToCart } = useStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: cats, error: catErr } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
        const { data: prods, error: prodErr } = await supabase.from('products').select('*');
        
        if (!catErr && cats) {
          setCategories(cats);
          if (cats.length > 0) setActiveCategory(cats[0].id);
        }
        if (!prodErr && prods) {
          setProducts(prods);
        }
      } catch (err) {
        console.error('Error loading data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center h-full bg-bg-light"><span className="text-gray-500 font-medium">Loading...</span></div>;
  }

  const filteredProducts = products.filter(p => {
    if (activeCategory && p.category_id !== activeCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-bg-light overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button><Menu className="w-6 h-6 text-text-dark" /></button>
        {!isSearchOpen ? (
          <h1 className="text-xl font-bold text-text-dark">Kechdak</h1>
        ) : (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 mx-4 bg-white px-4 py-2 rounded-full shadow-inner outline-none text-sm text-text-dark"
            autoFocus
          />
        )}
        <button 
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (isSearchOpen) setSearchQuery('');
          }}
          className="w-10 h-10 rounded-full bg-primary flex flex-shrink-0 items-center justify-center shadow-sm"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Greeting */}
      <div className="px-6 mb-6">
        <p className="text-primary text-sm font-medium">Welcome,</p>
        <h2 className="text-2xl font-bold text-text-dark mt-1">
          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'}
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Categories */}
        <div className="w-[60px] bg-primary rounded-r-[30px] flex flex-col py-8 items-center gap-12 overflow-y-auto pb-32 shadow-lg">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className="relative flex items-center justify-center h-24 w-full group"
              >
                <span 
                  className={`whitespace-nowrap -rotate-90 transform transition-colors duration-300 ${
                    isActive ? 'text-white font-bold' : 'text-white/60 font-medium'
                  }`}
                  style={{ textOrientation: 'mixed' }}
                >
                  {cat.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute right-0 w-1.5 h-12 bg-white rounded-l-full"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 px-5 overflow-y-auto pb-[100px] pt-2 hide-scrollbar">
          {products.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">No Products Found</h3>
              <p className="text-sm text-gray-500 font-medium">
                Please run the <code className="bg-gray-100 px-1 py-0.5 rounded text-primary">schema.sql</code> script in your Supabase SQL Editor to populate the database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[24px] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative flex flex-col"
                >
                  <Link href={`/product/${product.id}`} className="block relative w-full aspect-square rounded-[20px] overflow-hidden mb-3 shadow-inner">
                    <motion.div layoutId={`product-image-${product.id}`} className="w-full h-full relative">
                      <Image 
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-text-dark text-sm leading-tight">{product.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-primary font-bold text-sm">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-star fill-star" />
                        <span className="text-xs font-medium text-text-dark">4.8</span>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product.id, 'Medium', 1);
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-md z-10"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
