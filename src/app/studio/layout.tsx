"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Library, Feather, BarChart3, Settings, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center justify-between px-8 border-b border-crimson/5">
        <Link href="/studio" className="font-serif text-2xl font-bold text-crimson tracking-wider hover:scale-105 transition-transform">
          The Forge.
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-crimson/50 hover:text-crimson focus:outline-none">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto hide-scrollbar">
        <SidebarLink href="/studio" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/studio"} />
        <SidebarLink href="/studio/drafts" icon={<PenTool size={18} />} label="Drafts" active={pathname.startsWith("/studio/drafts")} />
        <SidebarLink href="/studio/library" icon={<Library size={18} />} label="Library" active={pathname.startsWith("/studio/library")} />
        <SidebarLink href="/studio/inkwell" icon={<Feather size={18} />} label="Inkwell" active={pathname.startsWith("/studio/inkwell")} />
        <SidebarLink href="/studio/analytics" icon={<BarChart3 size={18} />} label="Analytics" active={pathname.startsWith("/studio/analytics")} />
        
        <div className="pt-8 mb-4 px-4">
          <p className="text-[10px] font-bold text-crimson/40 uppercase tracking-widest">System</p>
        </div>
        <SidebarLink href="/studio/settings" icon={<Settings size={18} />} label="Settings" active={pathname.startsWith("/studio/settings")} />
      </nav>

      <div className="p-4 border-t border-crimson/5 mt-auto">
        <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-crimson hover:bg-crimson/5 rounded-xl transition-all group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit Sanctuary</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex font-sans selection:bg-crimson/20">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-crimson/10 z-40 flex items-center px-4 justify-between shadow-sm">
        <Link href="/studio" className="font-serif text-xl font-bold text-crimson tracking-wider">
          The Forge.
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="text-crimson hover:text-crimson-light focus:outline-none">
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-crimson/10 fixed inset-y-0 left-0 z-50 shadow-[4px_0_24px_rgba(153,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper */}
      <main className="flex-grow w-full min-w-0 md:pl-64 flex flex-col min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide group ${
        active 
          ? "bg-crimson text-white shadow-[0_4px_12px_rgba(153,0,0,0.2)]" 
          : "text-slate-500 hover:bg-crimson/5 hover:text-crimson"
      }`}
    >
      <span className={active ? "" : "opacity-70 group-hover:opacity-100"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
