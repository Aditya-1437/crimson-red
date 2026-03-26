"use client";

import { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, 
  PieChart, Pie,
  CartesianGrid
} from 'recharts';
import { motion } from "framer-motion";
import { Clock, TrendingDown, Heart, MessageCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

// PART 1: Data Infrastructure
const mockAnalytics = {
  monthlyTraffic: [
    { day: '01', views: 1200, uniqueReaders: 800 },
    { day: '05', views: 2100, uniqueReaders: 1200 },
    { day: '10', views: 1800, uniqueReaders: 900 },
    { day: '15', views: 3200, uniqueReaders: 2100 },
    { day: '20', views: 2800, uniqueReaders: 1600 },
    { day: '25', views: 4100, uniqueReaders: 2800 },
    { day: '30', views: 3900, uniqueReaders: 2400 },
  ],
  storyPerformance: [
    { title: 'Shadows of the Citadel', views: 14500, completionRate: 78, comments: 342, rank: 1 },
    { title: 'The Last Alchemist', views: 12200, completionRate: 65, comments: 215, rank: 2 },
    { title: 'Whispers in the Code', views: 9800, completionRate: 82, comments: 410, rank: 3 },
    { title: 'Beyond the Veil', views: 7500, completionRate: 54, comments: 128, rank: 4 },
    { title: 'Crimson Dawn', views: 5400, completionRate: 91, comments: 505, rank: 5 },
  ],
  loyaltyData: [
    { name: 'Returning', value: 72 },
    { name: 'New', value: 28 },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-crimson/20 p-4 rounded-2xl shadow-[0_8px_30px_rgb(153,0,0,0.12)]">
        <p className="font-bold text-slate-800 mb-2">Day {label}</p>
        <p className="text-sm text-crimson font-bold">
          Views: <span className="text-slate-700">{payload[0].value.toLocaleString()}</span>
        </p>
        <p className="text-sm text-slate-500 font-bold mt-1">
          Unique: <span className="text-slate-700">{payload[1]?.value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom layout for bar labels to show completion rate
const renderCustomBarLabel = (props: any) => {
  const { x, y, width, height, index } = props;
  const data = mockAnalytics.storyPerformance[index];
  
  return (
    <g>
      {/* Views Text */}
      <text x={x + width + 12} y={y + height / 2 + 4} fill="#1e293b" fontSize={14} fontWeight="bold">
        {data.views.toLocaleString()}
      </text>
      {/* Completion Badge */}
      <rect x={x + width + 75} y={y + height / 2 - 12} width="52" height="24" rx="12" fill="#990000" fillOpacity="0.1" />
      <text x={x + width + 101} y={y + height / 2 + 4} fill="#990000" fontSize={11} fontWeight="bold" textAnchor="middle">
        {data.completionRate}% Comp.
      </text>
    </g>
  );
};

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("30");

  const isEmpty = mockAnalytics.monthlyTraffic.length === 0;

  if (isEmpty) {
    return (
      <div className={`flex flex-col h-screen overflow-hidden bg-[#F9F9F9] ${playfair.variable} ${inter.variable} font-sans`}>
         <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200">
              <BarChart3 size={40} className="text-slate-300" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">No data yet—start writing!</h2>
            <p className="text-slate-500 font-medium text-center max-w-sm mb-8">
              Publish your first story and share it with the world to unlock powerful audience insights.
            </p>
            <Link 
              href="/studio/new" 
              className="px-8 py-4 bg-crimson text-white font-bold tracking-widest uppercase text-sm rounded-full hover:bg-crimson-light transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Start Writing
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[#F9F9F9] ${playfair.variable} ${inter.variable} font-sans selection:bg-crimson/20`}>
      {/* Header & Controls */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-crimson/10 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">Audience Analytics</h1>
          <p className="text-sm font-medium text-slate-500">Measure the pulse of your readership.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date Range:</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl border-none focus:ring-2 focus:ring-crimson/20 cursor-pointer appearance-none outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* PART 2.1: The "Pulse" Chart */}
          <motion.section 
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white p-6 rounded-3xl border border-crimson/10 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-xl font-serif font-bold text-slate-900">The Pulse</h2>
              <p className="text-sm text-slate-500 font-medium mb-1">Total views and unique readers over time.</p>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockAnalytics.monthlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#990000" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#990000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="#990000" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0, fill: '#990000' }} />
                  <Area type="monotone" dataKey="uniqueReaders" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* Grid Layout for Middle Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PART 2.2: Leaderboard */}
            <motion.section 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="lg:col-span-2 bg-white p-6 rounded-3xl border border-crimson/10 shadow-sm"
            >
              <div className="mb-6">
                <h2 className="text-xl font-serif font-bold text-slate-900">Leaderboard</h2>
                <p className="text-sm text-slate-500 font-medium">Top 5 stories driven by views.</p>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={mockAnalytics.storyPerformance} 
                    layout="vertical" 
                    margin={{ top: 0, right: 150, left: 0, bottom: 0 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="title" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#334155', fontSize: 13, fontWeight: 'bold' }} 
                      width={180}
                    />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(153,0,0,0.1)', fontWeight: 'bold' }} />
                    <Bar dataKey="views" fill="#slate-800" radius={[0, 4, 4, 0]} label={renderCustomBarLabel}>
                      {mockAnalytics.storyPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#990000' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.section>

            {/* PART 2.3: Reader Loyalty Donut */}
            <motion.section 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="lg:col-span-1 bg-white p-6 rounded-3xl border border-crimson/10 shadow-sm flex flex-col"
            >
              <div className="mb-2">
                <h2 className="text-xl font-serif font-bold text-slate-900">Reader Loyalty</h2>
                <p className="text-sm text-slate-500 font-medium">Returning vs New traffic.</p>
              </div>
              <div className="flex-1 flex justify-center items-center relative h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockAnalytics.loyaltyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {mockAnalytics.loyaltyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Returning' ? '#990000' : '#E5E7EB'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(153,0,0,0.1)', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold font-serif text-slate-900">72%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Returning</span>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-crimson mr-2"></div>
                  <span className="text-xs font-bold text-slate-600">Returning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#E5E7EB] mr-2"></div>
                  <span className="text-xs font-bold text-slate-600">New Reader</span>
                </div>
              </div>
            </motion.section>

          </div>

          {/* PART 2.4: Metric Grid (Bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            <MetricCard title="Avg. Reading Time" value="12m 45s" trend="+2m vs prev." icon={<Clock size={20} className="text-crimson" />} />
            <MetricCard title="Bounce Rate" value="34.2%" trend="-5% vs prev." icon={<TrendingDown size={20} className="text-crimson" />} positive />
            <MetricCard title="Total Favorites" value="2,840" trend="+124 this week" icon={<Heart size={20} className="text-crimson" />} />
            <MetricCard title="Comment Growth" value="+42%" trend="Highly engaged" icon={<MessageCircle size={20} className="text-crimson" />} />
          </div>

        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, positive = true }: { title: string; value: string; trend: string; icon: React.ReactNode; positive?: boolean }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white p-6 rounded-3xl border border-crimson/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-crimson/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-[2]"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-crimson/10 rounded-2xl">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-500 font-bold tracking-wide text-[10px] uppercase mb-1 line-clamp-1">{title}</h3>
        <p className="text-3xl font-serif font-bold text-slate-900 mb-2 tracking-tight">{value}</p>
        <p className={`text-xs font-bold ${positive ? "text-emerald-500" : "text-amber-500"}`}>{trend}</p>
      </div>
    </motion.div>
  );
}
