"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        style: {
          background: '#FFFFFF',
          color: '#990000',
          border: '1px solid rgba(153,0,0,0.1)',
          borderRadius: '9999px',
          fontWeight: '600',
          padding: '16px 24px',
          fontFamily: 'var(--font-outfit)',
        },
        success: {
          iconTheme: {
            primary: '#990000',
            secondary: '#FFFFFF',
          },
        },
      }} 
    />
  );
}
