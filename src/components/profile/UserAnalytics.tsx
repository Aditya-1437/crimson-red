"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { format, subDays } from "date-fns";
import { Flame, PieChart as PieIcon, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DailyLog {
  read_date: string;
  active_seconds: number;
}

interface GenreData {
  name: string;
  value: number;
}

export default function UserAnalytics({ userId }: { userId: string }) {
  const [mounted, setMounted] = useState(false);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [genreData, setGenreData] = useState<GenreData[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // 1. Fetch Daily Activity (Last 7 Days)
      const sevenDaysAgo = subDays(new Date(), 7).toISOString().split('T')[0];
      const { data: logs, error: logsError } = await supabase
        .from('daily_reading_logs')
        .select('read_date, active_seconds')
        .eq('user_id', userId)
        .gte('read_date', sevenDaysAgo)
        .order('read_date', { ascending: true });

      if (logsError) throw logsError;

      // Fill in missing days with 0
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dateStr = format(d, 'yyyy-MM-dd');
        const dayName = format(d, 'EEE');
        const log = (logs as DailyLog[] || []).find(l => l.read_date === dateStr);
        return {
          name: dayName,
          minutes: Math.round((log?.active_seconds || 0) / 60),
          fullDate: dateStr
        };
      });
      setDailyData(last7Days);

      // 2. Fetch Genre Distribution from reading_progress join stories
      const { data: progress, error: progressError } = await supabase
        .from('reading_progress')
        .select(`
          stories (
            genre
          )
        `)
        .eq('user_id', userId);

      if (progressError) throw progressError;

      const counts: Record<string, number> = {};
      progress?.forEach((p: any) => {
        if (!p.stories) return;
        const stories = Array.isArray(p.stories) ? p.stories[0] : p.stories;
        if (!stories) return;
        const genre = stories.genre || 'Explorer';
        counts[genre] = (counts[genre] || 0) + 1;
      });

      const genreChartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
      setGenreData(genreChartData);

      // 3. Calculate Streak
      const { data: allLogs, error: streakError } = await supabase
        .from('daily_reading_logs')
        .select('read_date, active_seconds')
        .eq('user_id', userId)
        .order('read_date', { ascending: false });

      if (streakError) throw streakError;

      let currentStreak = 0;
      let checkDate = new Date();
      
      const logsList = (allLogs as DailyLog[] || []);
      
      // If today has no data, check yesterday to see if streak is still alive
      const todayStr = format(checkDate, 'yyyy-MM-dd');
      const hasToday = logsList.some(l => l.read_date === todayStr && l.active_seconds > 0);
      
      if (!hasToday) {
        checkDate = subDays(checkDate, 1);
      }

      for (let i = 0; i < 365; i++) { 
        const targetStr = format(checkDate, 'yyyy-MM-dd');
        const dayLog = logsList.find(l => l.read_date === targetStr);
        
        if (dayLog && dayLog.active_seconds > 0) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
      setStreak(currentStreak);

    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-64 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  const COLORS = ['#991b1b', '#dc2626', '#ef4444', '#f87171', '#fca5a5'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 scroll-mt-32" id="analytics">
      {/* Streak & Stats Summary */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-1 flex flex-col gap-6"
      >
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-crimson"></div>
           <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative">
              <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-ping opacity-20"></div>
              <Flame size={40} className="text-orange-500 fill-orange-500" />
           </div>
           <h3 className="text-4xl font-serif font-black text-slate-900 mb-2">{streak} Day Streak</h3>
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Consecutive Chronicles</p>
           <div className="mt-8 pt-8 border-t border-slate-50 w-full">
              <p className="text-slate-500 italic text-sm">"Consistency is the forge where legends are hammered into existence."</p>
           </div>
        </div>

        <div className="bg-crimson text-white rounded-[2.5rem] p-8 shadow-2xl shadow-crimson/20 relative overflow-hidden group">
           <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={160} />
           </div>
           <div className="relative z-10">
              <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] mb-2 font-sans">Active Reading</p>
              <h3 className="text-3xl font-serif font-bold mb-4 italic">Library Ascendant</h3>
              <p className="text-white/80 text-sm leading-relaxed font-medium">Your dedication explores new realms daily. Keep the Flame burning to evolve your Rank.</p>
           </div>
        </div>
      </motion.div>

      {/* Daily Activity Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 bg-crimson/5 rounded-2xl flex items-center justify-center">
              <BarChart3 size={20} className="text-crimson" />
           </div>
           <div>
              <h4 className="text-lg font-serif font-bold text-slate-900 italic">Daily Odyssey</h4>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Minutes spent in sanctuary</p>
           </div>
        </div>
        
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(153,0,0,0.03)' }}
                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                itemStyle={{ color: '#991b1b' }}
              />
              <Bar 
                dataKey="minutes" 
                fill="#991b1b" 
                radius={[8, 8, 8, 8]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Genre Distribution Chart */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 bg-crimson/5 rounded-2xl flex items-center justify-center">
              <PieIcon size={20} className="text-crimson" />
           </div>
           <div>
              <h4 className="text-lg font-serif font-bold text-slate-900 italic">Preferred Havens</h4>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Genre distribution profile</p>
           </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
