"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthGateModal({ isOpen, onClose }: AuthGateModalProps) {
  // Scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with anti-flicker transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-900 border border-crimson/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10 font-sans"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-crimson/10 rounded-full flex items-center justify-center mb-8 border border-crimson/20">
                <Lock className="w-8 h-8 text-crimson" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-3xl font-bold text-white mb-4 tracking-tight">
                The Archives are Sealed
              </h3>
              <p className="text-white/60 text-lg leading-relaxed mb-10 font-medium italic">
                You must be a registered reader to open these ancient texts. Join the inner circle to continue reading.
              </p>

              {/* Actions */}
              <div className="w-full space-y-4">
                <Link
                  href="/auth"
                  className="block w-full py-4 bg-crimson text-white rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-crimson/90 hover:shadow-[0_8px_25px_rgba(153,0,0,0.4)] active:scale-95 text-center"
                >
                  Sign In / Register
                </Link>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 text-white/40 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            
            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-crimson to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
