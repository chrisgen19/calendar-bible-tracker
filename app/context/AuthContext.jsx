'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!loading && !hasRedirected.current) {
      if (!user && !isPublicPath) {
        // User not logged in and trying to access protected route
        hasRedirected.current = true;
        router.replace('/login');
      } else if (user && isPublicPath) {
        // User logged in and trying to access login/register
        hasRedirected.current = true;
        router.replace('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    hasRedirected.current = false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    hasRedirected.current = false;
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
