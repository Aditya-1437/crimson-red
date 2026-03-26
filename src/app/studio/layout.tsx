"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Library, Feather, BarChart3, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex font-sans selection:bg-crimson/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-crimson/10 flex flex-col fixed inset-y-0 left-0 z-50 shadow-[4px_0_24px_rgba(153,0,0,0.02)]">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-crimson/5">
          <Link href="/studio" className="font-serif text-2xl font-bold text-crimson tracking-wider hover:scale-105 transition-transform">
            The Forge.
          </Link>
        </div>

        {/* Links */}
        <nav className="flex-grow py-8 px-4 space-y-2">
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

        {/* Footer actions */}
        <div className="p-4 border-t border-crimson/5">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-crimson hover:bg-crimson/5 rounded-xl transition-all group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Exit Sanctuary</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-grow pl-64 flex flex-col min-h-screen">
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
