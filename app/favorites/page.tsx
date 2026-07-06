'use client';

import { useStore } from '@/lib/store';
import { supabase, Product } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Favorites() {
  const { favorites, toggleFavorite, loading: storeLoading } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadFavorites() {
      if (storeLoading) return;
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase.from('products').select('*').in('id', favorites);
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    loadFavorites();
  }, [favorites, storeLoading]);

  return (
    <div className="flex flex-col h-full bg-bg-light relative">
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-text-dark" strokeWidth={2.5} />
        </button>
        <h1 className="text-[22px] font-bold text-text-dark tracking-wide">Favorites</h1>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[120px] pt-4 hide-scrollbar">
        {loading || storeLoading ? (
          <div className="text-center text-gray-500 font-medium mt-10">Loading favorites...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 font-medium mt-10 flex flex-col items-center">
            <Heart className="w-12 h-12 text-gray-300 mb-4" />
            <p>You have no favorite items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[24px] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative flex flex-col"
              >
                <Link href={`/product/${product.id}`} className="block relative w-full aspect-square rounded-[20px] overflow-hidden mb-3 shadow-inner">
                  <Image 
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
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
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute -bottom-4 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10 text-primary fill-primary"
                >
                  <Heart className="w-5 h-5 text-primary fill-primary" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
