"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, Star, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "motion/react";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  rating: string;
  image: string;
  withSubtitle: string;
}

const CATEGORIES = ["Bakery", "Drinks", "Hot Coffees", "Ice Teas", "Hot Teas"];

export default function Home() {
  const { user, signIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Hot Coffees");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  return (
    <main className="flex flex-col h-full pt-8">
      {/* Header */}
      <header className="flex justify-between items-center px-6 mb-8">
        <Menu className="text-[#3A1C20] w-6 h-6 cursor-pointer" />
        <h1 className="text-xl font-bold font-outfit text-[#3A1C20] tracking-tight">Kechdak</h1>
        <Search className="text-[#C44C27] w-6 h-6 cursor-pointer" />
      </header>

      {/* Welcome */}
      <div className="px-6 mb-8">
        <p className="text-[#C44C27] text-sm font-medium mb-1">Welcome,</p>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-outfit text-[#3A1C20]">
            {user ? user.displayName || "Coffee Lover" : "Guest"}
          </h2>
          {!user && (
            <button onClick={signIn} className="text-xs bg-[#C44C27] text-white px-3 py-1.5 rounded-full font-medium shadow-sm">
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Categories Sidebar */}
        <div className="w-16 flex-shrink-0 flex flex-col relative z-10">
          <div className="absolute inset-y-0 left-0 w-12 bg-[#C44C27] rounded-r-3xl -z-10" />
          <div className="flex-1 overflow-y-auto no-scrollbar py-6">
            <div className="flex flex-col items-center gap-12 pt-8">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative group flex items-center justify-center w-full"
                  >
                    <span 
                      className={`whitespace-nowrap -rotate-90 transform transition-colors text-sm font-medium tracking-wide ${
                        isActive ? "text-white" : "text-[#FFF0E6]/60 group-hover:text-[#FFF0E6]"
                      }`}
                    >
                      {cat}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeCategory"
                        className="absolute right-1 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 pl-4 pr-6 pb-24 overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={product.id}
                className="bg-white rounded-[2rem] p-3 flex flex-col relative shadow-sm"
              >
                <Link href={`/product/${product.id}`} className="block relative aspect-square mb-3 -mt-6 mx-2 drop-shadow-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                
                <div className="px-1 flex-1 flex flex-col">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-[#3A1C20] text-sm mb-0.5">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{product.withSubtitle}</p>
                  </Link>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#3A1C20] text-sm">${product.price}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-bold text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    
                    <button className="w-8 h-8 rounded-xl bg-[#C44C27] flex items-center justify-center text-white shrink-0 shadow-md hover:bg-[#A33D1E] transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
