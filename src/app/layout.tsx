import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import MouseButterfly from "@/components/MouseButterfly";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crimson Red",
  description: "A sanctuary for long-form fiction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-crimson selection:bg-crimson/20">
        <AuthProvider>
          <Toaster position="bottom-right" expand={false} richColors />
          <MouseButterfly />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
