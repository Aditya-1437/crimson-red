"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const { isLoggedIn, user, userProfile, loading, logout } = useAuth();
  
  const isAdmin = user?.user_metadata?.role === 'admin' || userProfile?.role === 'admin';
  console.log("Current User Role:", userProfile?.role);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-full ${
        isScrolled ? "bg-white shadow-[0_8px_30px_rgb(153,0,0,0.08)] py-3 border border-crimson/5" : "bg-white/90 backdrop-blur-md py-4 shadow-[0_4px_20px_rgb(153,0,0,0.05)] border border-crimson/5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex space-x-12">
          {["Stories", "Blogs", "Updates"].map((item) => (
            <NavItem key={item} href={`/${item.toLowerCase()}`}>
              {item}
            </NavItem>
          ))}
          {isAdmin && (
            <NavItem href="/studio">
              Studio
            </NavItem>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {loading ? (
             <div className="hidden md:block w-24 h-10 bg-slate-100 rounded-full animate-pulse border border-crimson/5"></div>
          ) : isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hidden md:flex items-center justify-center w-12 h-12 bg-white text-crimson border border-crimson/30 hover:bg-crimson hover:text-white transition-all duration-300 rounded-full shadow-sm hover:shadow-[0_4px_15px_rgb(153,0,0,0.2)]"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-crimson/10 rounded-2xl shadow-[0_10px_30px_rgba(153,0,0,0.1)] py-2 z-50">
                  <div className="px-4 py-2 border-b border-crimson/5 mb-1">
                    <p className="text-sm font-semibold text-crimson">My Account</p>
                  </div>
                  <Link 
                    href="/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-crimson/80 hover:text-crimson hover:bg-crimson/5 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-crimson/80 hover:text-crimson hover:bg-crimson/5 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/auth"
              className="hidden md:block px-8 py-3 bg-white text-crimson border border-crimson/30 font-semibold tracking-widest uppercase text-sm hover:bg-crimson hover:text-white transition-all duration-300 rounded-full shadow-sm hover:shadow-[0_4px_15px_rgb(153,0,0,0.2)] text-center"
            >
              Sign In
            </Link>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-crimson hover:text-crimson-light focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(153,0,0,0.15)] border border-crimson/10 overflow-hidden md:hidden z-50"
          >
            <div className="flex flex-col py-4 px-6 space-y-4">
              {["Stories", "Blogs", "Updates"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-crimson/80 hover:text-crimson font-medium text-lg tracking-wide border-b border-crimson/5 pb-2 inline-block pt-2"
                >
                  {item}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/studio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-crimson/80 hover:text-crimson font-medium text-lg tracking-wide border-b border-crimson/5 pb-2 inline-block pt-2"
                >
                  Studio
                </Link>
              )}
              
              <div className="pt-4 flex flex-col space-y-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-3 bg-crimson/5 text-crimson rounded-xl font-semibold text-center hover:bg-crimson/10 transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-white text-crimson border-2 border-crimson/20 rounded-xl font-semibold hover:bg-crimson/5 hover:border-crimson transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 bg-crimson text-white rounded-xl font-semibold text-center shadow-lg shadow-crimson/20 tracking-widest uppercase text-sm"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        className="text-crimson/80 hover:text-crimson font-medium text-sm tracking-widest uppercase transition-colors relative z-10 block"
      >
        {children}
      </Link>
      
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 0, y: 10, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: [-5, -15, -25], 
                y: [5, -10, -20],
                rotate: [0, -20, -40]
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute left-[-10px] top-[-10px] pointer-events-none text-crimson"
            >
              <ButterflyIcon size={12} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 10, y: 5, scale: 0.3 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: [10, 25, 35], 
                y: [0, -15, -25],
                rotate: [0, 20, 40]
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut", repeat: Infinity, repeatDelay: 0.8 }}
              className="absolute right-[-10px] top-[-5px] pointer-events-none text-crimson/80"
            >
              <ButterflyIcon size={10} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 5, y: 15, scale: 0.4 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: [5, 10, 15], 
                y: [10, -5, -30],
                rotate: [0, 10, -10]
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeOut", repeat: Infinity, repeatDelay: 0.6 }}
              className="absolute left-1/2 top-0 pointer-events-none text-crimson/60"
            >
              <ButterflyIcon size={8} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10, y: 0, scale: 0.35 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: [-10, -20, -30], 
                y: [0, -15, -20],
                rotate: [0, -30, -50]
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 1.3, delay: 0.1, ease: "easeOut", repeat: Infinity, repeatDelay: 0.7 }}
              className="absolute left-[5px] top-[5px] pointer-events-none text-crimson/90"
            >
              <ButterflyIcon size={9} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15, y: 10, scale: 0.45 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: [15, 30, 40], 
                y: [10, -5, -25],
                rotate: [0, 30, 50]
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 1.6, delay: 0.5, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
              className="absolute right-[5px] top-[10px] pointer-events-none text-crimson/70"
            >
              <ButterflyIcon size={11} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const ButterflyIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className="animate-pulse"
  >
    <path d="M12 12C12 12 8 4 4 8C2 10 4 14 8 12C10 11 12 12 12 12ZM12 12C12 12 16 4 20 8C22 10 20 14 16 12C14 11 12 12 12 12Z" />
    <path d="M12 12C12 12 9 20 5 18C3 17 5 14 8 14C10 14 12 12 12 12ZM12 12C12 12 15 20 19 18C21 17 19 14 16 14C14 14 12 12 12 12Z" opacity="0.8" />
  </svg>
);
