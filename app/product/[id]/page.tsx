"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Heart, Minus, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const { user, getToken } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState("Medium");
  const [milk, setMilk] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProduct(data);
      });
  }, [params.id]);

  const addToCart = async () => {
    if (!user) {
      alert("Please sign in to add to cart");
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product?.id,
          size,
          milk,
          quantity
        })
      });
      router.push("/cart");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-[#FFF0E6]">
      {/* Header & Image */}
      <div className="relative h-72 rounded-b-[3rem] overflow-hidden drop-shadow-xl z-10 bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold font-outfit text-xl drop-shadow-md">{product.name}</h1>
          <button className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-32">
        {/* Ingredients */}
        <div className="mb-8">
          <h3 className="text-center font-bold text-[#3A1C20] mb-6">Ingredients</h3>
          <div className="relative h-1 bg-[#E8D1C5] rounded-full mx-8">
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
              <div className="w-3 h-3 rounded-full bg-[#C44C27] border-2 border-[#FFF0E6] shadow-sm -ml-1.5"></div>
              <div className="flex flex-col items-center -mt-6">
                <div className="w-8 h-8 rounded-full bg-[#C44C27] flex items-center justify-center text-white mb-2 shadow-md">
                  <span className="text-[10px] font-bold">🥛</span>
                </div>
                <span className="text-xs font-medium text-[#C44C27]">Milk</span>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#C44C27] border-2 border-[#FFF0E6] shadow-sm -mr-1.5"></div>
            </div>
            {/* Range input overlay */}
            <input 
              type="range" 
              min="0" max="100" 
              value={milk}
              onChange={(e) => setMilk(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Size */}
        <div className="mb-10 mt-12">
          <h3 className="text-center font-bold text-[#3A1C20] mb-4">Coffee Size</h3>
          <div className="flex justify-center gap-4">
            {["Small", "Medium", "Large"].map((s, idx) => {
              const isActive = size === s;
              const scale = 0.8 + idx * 0.2; // 0.8, 1.0, 1.2
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all ${
                    isActive ? "bg-[#C44C27] shadow-lg shadow-[#C44C27]/30" : "bg-white shadow-sm"
                  }`}
                >
                  <div className={`mb-1 ${isActive ? "text-white" : "text-[#C44C27]"}`} style={{ transform: `scale(${scale})` }}>
                    ☕
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-white" : "text-[#3A1C20]"}`}>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-xl border-2 border-[#3A1C20] flex items-center justify-center text-[#3A1C20]"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-2xl font-bold font-outfit text-[#3A1C20] w-8 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-xl border-2 border-[#3A1C20] flex items-center justify-center text-[#3A1C20]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#3A1C20] text-white rounded-t-3xl p-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(58,28,32,0.1)] z-50">
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-outfit">${product.price}</span>
        </div>
        <button 
          onClick={addToCart}
          disabled={loading}
          className="bg-transparent text-white font-medium text-sm"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </main>
  );
}
