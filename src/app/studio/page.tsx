import Link from "next/link";
import { BookOpen, Users, MessageSquare, Plus } from "lucide-react";

export default function StudioDashboard() {
  return (
    <div className="p-8 md:p-12 w-full max-w-7xl mx-auto">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome back, Admin.</h1>
          <p className="text-slate-500 font-medium">Here's what's happening in your sanctuary today.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/studio/new-blog" className="px-5 py-2.5 bg-white border border-crimson/20 text-crimson font-bold rounded-full text-sm hover:bg-crimson/5 transition-colors shadow-sm tracking-wide hidden sm:block">
            + New Blog
          </Link>
          <Link href="/studio/new" className="px-6 py-2.5 bg-crimson text-white font-bold rounded-full text-sm hover:bg-crimson-light transition-colors shadow-[0_4px_14px_rgba(153,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(153,0,0,0.4)] flex items-center space-x-2 tracking-wide">
            <Plus size={16} />
            <span>New Story</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard 
          title="Total Stories" 
          value="24" 
          trend="+3 this month" 
          icon={<BookOpen size={24} className="text-crimson" />} 
        />
        <MetricCard 
          title="Active Readers" 
          value="4,892" 
          trend="+12% vs last month" 
          icon={<Users size={24} className="text-crimson" />} 
        />
        <MetricCard 
          title="Monthly Comments" 
          value="843" 
          trend="Highly engaged" 
          icon={<MessageSquare size={24} className="text-crimson" />} 
        />
      </div>

      {/* Recent Drafts Placeholder */}
      <div className="bg-white rounded-3xl p-8 border border-crimson/10 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Recent Drafts</h2>
        
        <div className="space-y-4">
           {/* Dummy Draft Item */}
           <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-crimson/10 rounded-xl flex items-center justify-center text-crimson font-serif font-bold">
                 S
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 group-hover:text-crimson transition-colors">Shadows of the Citadel</h3>
                 <p className="text-xs font-medium text-slate-400">Edited 2 hours ago • 4,200 words</p>
               </div>
             </div>
             <Link href="/studio/new" className="text-sm font-bold text-crimson opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">
               Continue Editing &rarr;
             </Link>
           </div>
           
           <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-serif font-bold">
                 T
               </div>
               <div>
                 <h3 className="font-bold text-slate-800 group-hover:text-crimson transition-colors">The Last Alchemist</h3>
                 <p className="text-xs font-medium text-slate-400">Edited 3 days ago • 1,150 words</p>
               </div>
             </div>
             <Link href="/studio/new" className="text-sm font-bold text-crimson opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm">
               Continue Editing &rarr;
             </Link>
           </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, trend, icon }: { title: string; value: string; trend: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-crimson/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-crimson/5 rounded-2xl">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-500 font-bold tracking-wide text-xs uppercase mb-1">{title}</h3>
        <p className="text-4xl font-serif font-bold text-slate-900 mb-2">{value}</p>
        <p className="text-xs font-bold text-crimson/70">{trend}</p>
      </div>
    </div>
  );
}
