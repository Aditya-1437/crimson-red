"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ValidationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export const ValidationPopup = ({ isOpen, onClose, message, title = "Verification Required" }: ValidationPopupProps) => {
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-crimson/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-crimson/10"
            >
              <div className="relative p-8 flex flex-col items-center text-center">
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-crimson/20 hover:text-crimson hover:bg-crimson/5 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon Circle */}
                <div className="w-16 h-16 bg-crimson/5 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-crimson" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl font-bold text-crimson mb-3 tracking-tight">
                  {title}
                </h3>
                <p className="text-crimson/60 text-lg leading-relaxed mb-8">
                  {message}
                </p>

                {/* Action */}
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-crimson text-white rounded-full font-bold uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
                >
                  Understood
                </button>
              </div>
              
              {/* Bottom Accent */}
              <div className="h-1.5 w-full bg-crimson opacity-20" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
