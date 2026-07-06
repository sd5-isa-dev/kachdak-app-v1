'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';

type CartItem = {
  id: string; // cart item id
  productId: string;
  size: string;
  quantity: number;
};

type StoreContextType = {
  cart: CartItem[];
  addToCart: (productId: string, size: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, delta: number) => Promise<void>;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  loading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartAndFavorites = useCallback(async () => {
    if (!user) {
      setCart([]);
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: cartData, error: cartErr } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartData) {
        setCart(cartData.map(c => ({
          id: c.id,
          productId: c.product_id,
          size: c.size,
          quantity: c.quantity
        })));
      }

      const { data: favData, error: favErr } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favData) {
        setFavorites(favData.map(f => f.product_id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      await fetchCartAndFavorites();
    };
    load();
    return () => { mounted = false; };
  }, [fetchCartAndFavorites]);

  const addToCart = async (productId: string, size: string, quantity: number) => {
    if (!user) return; // Wait for user

    // Check if exists
    const existing = cart.find(item => item.productId === productId && item.size === size);
    
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      
      // Update local optimistically
      setCart(prev => prev.map(item => item.id === existing.id ? { ...item, quantity: newQuantity } : item));
      
      await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existing.id);
    } else {
      // Optimistic insert with temporary ID
      const tempId = Math.random().toString();
      setCart(prev => [...prev, { id: tempId, productId, size, quantity }]);
      
      const { data } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, size, quantity })
        .select('id')
        .single();
        
      if (data) {
        setCart(prev => prev.map(item => item.id === tempId ? { ...item, id: data.id } : item));
      }
    }
  };

  const updateQuantity = async (cartItemId: string, delta: number) => {
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    const newQ = Math.max(0, item.quantity + delta);

    if (newQ === 0) {
      // Optimistic delete
      setCart(prev => prev.filter(i => i.id !== cartItemId));
      await supabase.from('cart_items').delete().eq('id', cartItemId);
    } else {
      // Optimistic update
      setCart(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity: newQ } : i));
      await supabase.from('cart_items').update({ quantity: newQ }).eq('id', cartItemId);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    const isFav = favorites.includes(productId);

    if (isFav) {
      // Optimistic remove
      setFavorites(prev => prev.filter(id => id !== productId));
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
    } else {
      // Optimistic add
      setFavorites(prev => [...prev, productId]);
      await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, favorites, toggleFavorite, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
