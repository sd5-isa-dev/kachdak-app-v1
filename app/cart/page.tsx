"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit2, Minus, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "motion/react";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: string;
    withSubtitle: string;
    image: string;
  };
}

export default function Cart() {
  const router = useRouter();
  const { user, getToken, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setTimeout(() => setLoading(false), 0);
      return;
    }
    
    let active = true;
    getToken().then(token => {
      fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (active) {
          if (Array.isArray(data)) setItems(data);
          setLoading(false);
        }
      });
    });
    return () => { active = false; };
  }, [user, getToken, authLoading]);

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) {
      // Remove item
      const token = await getToken();
      await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(item => item.id !== id));
      return;
    }

    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    const token = await getToken();
    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQty })
    });
  };

  const checkout = async () => {
    setCheckingOut(true);
    const token = await getToken();
    await fetch("/api/checkout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    setItems([]);
    setCheckingOut(false);
    alert("Order placed successfully!");
    router.push("/");
  };

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);
  const shipping = 1.00;
  const taxes = 1.00;
  const total = subtotal + (items.length > 0 ? shipping + taxes : 0);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-[#FFF0E6]">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-12 pb-6">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#C44C27] shadow-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold font-outfit text-[#3A1C20]">Cart</h1>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#C44C27] shadow-sm">
          <Edit2 className="w-4 h-4" />
        </button>
      </header>

      <div className="px-6 flex-1 pb-48 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-outfit text-[#3A1C20] mb-1">My Order</h2>
          <p className="text-sm text-gray-500">You have <span className="font-bold text-[#C44C27]">{items.length} items</span> in your cart.</p>
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={item.id} 
                className="bg-white rounded-[2rem] p-4 flex items-center shadow-sm"
              >
                <div className="relative w-16 h-16 shrink-0 drop-shadow-md">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 ml-4">
                  <h3 className="font-bold text-[#3A1C20]">{item.product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{item.product.withSubtitle}</p>
                  <span className="font-bold text-[#C44C27]">${item.product.price}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-[#3A1C20]/20 flex items-center justify-center text-[#3A1C20] hover:bg-[#3A1C20]/5 transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-[#3A1C20] w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#3A1C20]/20 flex items-center justify-center text-[#3A1C20] hover:bg-[#3A1C20]/5 transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
              Your cart is empty.
            </div>
          )}
        </div>
      </div>

      {/* Checkout Summary */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#C44C27] text-white rounded-t-[3rem] px-8 py-8 shadow-[0_-10px_40px_rgba(196,76,39,0.2)] z-40">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Shipping Cost</span>
            <span className="font-medium">${items.length ? shipping.toFixed(2) : "0.00"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Taxes</span>
            <span className="font-medium">${items.length ? taxes.toFixed(2) : "0.00"}</span>
          </div>
          <div className="h-px w-full bg-white/20 my-2" />
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">Total</span>
            <span className="font-bold text-2xl font-outfit">${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={checkout}
          disabled={checkingOut || items.length === 0}
          className="w-full bg-[#3A1C20] text-white py-4 rounded-full font-bold shadow-lg hover:bg-[#2A1417] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {checkingOut ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </main>
  );
}
