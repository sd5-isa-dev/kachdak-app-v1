'use client';

import { ArrowLeft, Edit2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { supabase, Product } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Cart() {
  const router = useRouter();
  const { cart, updateQuantity, clearCart } = useStore();
  const { user } = useAuth();
  
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const ids = [...new Set(cart.map(c => c.productId))];
      if (ids.length === 0) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('products').select('*').in('id', ids);
      if (data) {
        const productMap: Record<string, Product> = {};
        data.forEach(p => productMap[p.id] = p);
        setProducts(productMap);
      }
      setLoading(false);
    }
    loadProducts();
  }, [cart]);

  const cartItems = cart.map(item => {
    return { ...item, product: products[item.productId] };
  }).filter(item => item.product); // remove invalid

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 2.50 : 0;
  const taxes = subtotal * 0.12; // roughly 12% for the example
  const total = subtotal + shipping + taxes;

  const handleCheckout = async () => {
    if (cartItems.length === 0 || !user) return;
    setIsCheckingOut(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total
        })
        .select('id')
        .single();

      if (orderError || !orderData) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.product!.price
      }));

      await supabase.from('order_items').insert(orderItems);

      const cartIds = cartItems.map(item => item.id);
      await supabase.from('cart_items').delete().in('id', cartIds);
      clearCart();
      
      router.push(`/order-confirmed/${orderData.id}`);
    } catch (error: any) {
      console.error(error);
      setCheckoutError(`Checkout failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-light relative">
      {/* Top Bar */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-text-dark" />
        </button>
        <h1 className="text-xl font-bold text-text-dark">Cart</h1>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <Edit2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="px-6 mb-6 mt-2">
        <h2 className="text-2xl font-bold text-text-dark mb-1">My Order</h2>
        <p className="text-sm text-gray-500">You have <span className="text-primary font-bold">{cartItems.length}</span> items in your cart</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[250px] hide-scrollbar">
        {loading ? (
          <div className="text-center text-gray-400 mt-10">Loading cart...</div>
        ) : (
        <AnimatePresence mode="popLayout">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              className="bg-white rounded-[20px] p-3 mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-inner">
                <Image 
                  src={item.product!.image_url}
                  alt={item.product!.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-dark text-sm">{item.product!.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{item.size}</p>
                <p className="text-primary font-bold text-sm">${item.product!.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-white"
                >
                  <Minus className="w-3 h-3" />
                </motion.button>
                <span className="text-sm font-bold text-text-dark w-4 text-center">{item.quantity}</span>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center text-primary bg-white"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center text-gray-400 mt-10">Your cart is empty.</div>
          )}
        </AnimatePresence>
        )}
      </div>

      {/* Order Summary Panel */}
      <div className="absolute bottom-0 w-full bg-surface-dark curve-top px-8 pt-10 pb-8 flex flex-col z-20">
        
        <div className="flex justify-between items-center mb-3 text-white/70 text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-3 text-white/70 text-sm">
          <span>Shipping Cost</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4 text-white/70 text-sm pb-4 border-b border-white/10">
          <span>Taxes</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6 text-white text-xl font-bold">
          <span>Total</span>
          <AnimatePresence mode="popLayout">
            <motion.span 
              key={total}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="tracking-wide"
            >
              ${total.toFixed(2)}
            </motion.span>
          </AnimatePresence>
        </div>

        {checkoutError && (
          <div className="mb-4 bg-red-500/20 text-red-100 p-3 rounded-xl text-sm text-center">
            {checkoutError}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckout}
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-lg flex justify-center items-center"
          disabled={cartItems.length === 0 || isCheckingOut}
        >
          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
        </motion.button>

      </div>
    </div>
  );
}
