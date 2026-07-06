'use client';

import { ArrowLeft, Heart, Droplets, Coffee, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { use, useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { addToCart, favorites, toggleFavorite } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [milkPercentage, setMilkPercentage] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium h-full flex items-center justify-center">Loading product...</div>;
  if (!product) return <div className="p-8 text-center text-gray-500 font-medium h-full flex items-center justify-center">Product not found</div>;

  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    const fullSize = `${size} - Milk: ${milkPercentage}%`;
    addToCart(product.id, fullSize, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bg-light relative">
      {/* Top Image Section */}
      <div className="relative h-[320px] w-full curve-bottom shadow-sm">
        <motion.div layoutId={`product-image-${product.id}`} className="absolute inset-0">
          <Image 
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        <div className="absolute top-12 w-full px-6 flex items-center justify-between z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-text-dark" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide">{product.name}</h1>
          <button 
            onClick={() => toggleFavorite(product.id)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-primary fill-primary' : 'text-primary'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[120px] pt-8 hide-scrollbar">
        
        {/* Ingredients Slider Placeholder */}
        <div className="mb-10 text-center">
          <h3 className="font-bold text-text-dark text-lg mb-6">Milk Percentage: {milkPercentage}%</h3>
          <div className="relative flex items-center justify-center px-4 max-w-xs mx-auto">
            <input 
              type="range"
              min="0"
              max="100"
              step="10"
              value={milkPercentage}
              onChange={(e) => setMilkPercentage(Number(e.target.value))}
              className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Coffee Size */}
        <div className="mb-10 text-center">
          <h3 className="font-bold text-text-dark text-lg mb-4">Coffee Size</h3>
          <div className="flex justify-center gap-4">
            {(['Small', 'Medium', 'Large'] as const).map((s) => {
              const isSelected = size === s;
              const scale = s === 'Small' ? 0.8 : s === 'Medium' ? 1 : 1.2;
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-20 pb-4 rounded-[20px] flex flex-col items-center justify-center gap-3 transition-colors ${
                    isSelected ? 'bg-primary shadow-lg' : 'bg-white shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 flex items-center justify-center`}>
                    <Coffee className={`${isSelected ? 'text-white' : 'text-primary'}`} style={{ transform: `scale(${scale})` }} strokeWidth={isSelected ? 2.5 : 2} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-text-dark'}`}>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-center gap-6">
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-white"
          >
            <Minus className="w-5 h-5" />
          </motion.button>
          <span className="text-2xl font-bold text-text-dark w-6 text-center">{quantity}</span>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-white"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

      </div>

      {/* Bottom Fixed Bar */}
      <div className="absolute bottom-0 w-full h-[110px] bg-surface-dark curve-top px-8 py-5 flex items-center justify-between z-20">
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            <motion.span 
              key={quantity * product.price}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-white tracking-wide"
            >
              ${(product.price * quantity).toFixed(2)}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="bg-primary text-white font-bold text-lg px-8 py-3.5 rounded-full shadow-lg"
        >
          Add to Cart
        </motion.button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="absolute bottom-32 left-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium z-50 whitespace-nowrap"
          >
            Added to cart!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
