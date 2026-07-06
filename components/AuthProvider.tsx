"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleAuthProvider } from "@/src/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  getToken: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Sync user with backend
        try {
          const token = await user.getIdToken();
          await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (e) {
          console.error("Failed to sync user", e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  };

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
