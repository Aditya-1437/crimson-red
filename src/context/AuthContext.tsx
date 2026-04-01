"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "user" | "reader" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  loading: boolean;
  user: any;
  userProfile: any;
  login: (token: string, userRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        setIsLoggedIn(true);
        setRole(profileData?.role || "reader");
        setUser(session.user);
        setUserProfile(profileData);
      } else {
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
        setUserProfile(null);
      }
      setTimeout(() => setLoading(false), 600);
    };
    
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
          
        setIsLoggedIn(true);
        setRole(profileData?.role || "reader");
        setUser(session.user);
        setUserProfile(profileData);
      } else {
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (token: string, userRole: Role) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, loading, user, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
