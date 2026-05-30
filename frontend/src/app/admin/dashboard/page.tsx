'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Eye, 
  MousePointer2, 
  BookOpen, 
  Users,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={32} /></div>;

  const quickStats = [
    { name: 'Total Page Views', value: stats.totalViews, icon: Eye, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { name: 'Last 30 Days', value: stats.viewsLast30Days, icon: Users, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { name: 'Top Blog', value: stats.topBlogs[0]?.views || 0, icon: BookOpen, color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
    { name: 'Project Clicks', value: stats.topProjects.reduce((acc: number, p: any) => acc + p.clicks, 0), icon: MousePointer2, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's how your portfolio is performing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-mono text-green-500 flex items-center">
                <ArrowUpRight size={14} className="mr-1" />
                +12%
              </span>
            </div>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Traffic Overview (Last 30 Days)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="_id" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2535', borderColor: '#ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Projects */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Top Projects</h2>
          <div className="space-y-6">
            {stats.topProjects.map((project: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{project.title}</div>
                  <div className="text-xs text-gray-500">{project.views} views</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-brand-400">{project.clicks} clicks</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

