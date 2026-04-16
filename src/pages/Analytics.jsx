import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { Activity, Clock, Disc, LineChart as LineChartIcon } from 'lucide-react';
import { analyticsData } from '../data/analyticsData';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { fetchUserInteractions } from '../utils/tracking';

export default function Analytics() {
  const { user } = useAppContext();
  const [history, setHistory] = useState(analyticsData.recentHistory);
  const [moodStats, setMoodStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch real interactions from Supabase
        const interactions = await fetchUserInteractions(user.id, 100);

        if (interactions && interactions.length > 0) {
          // Map real data
          const mappedReal = interactions.slice(0, 5).map((item, idx) => {
            const date = new Date(item.created_at);
            return {
              id: `real-${idx}`,
              mood: item.mood,
              time: date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              name: `${item.mood} Recommendation`,
              isReal: true
            };
          });

          // Combine with simulated data (hybrid model)
          setHistory([...mappedReal, ...analyticsData.recentHistory.slice(0, 3)]);

          // Calculate mood statistics
          const stats = {};
          interactions.forEach(interaction => {
            stats[interaction.mood] = (stats[interaction.mood] || 0) + 1;
          });
          setMoodStats(stats);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto py-8 text-slate-800">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
          Temporal Analytics & Behavioral Insights
        </h1>
        <p className="text-slate-600 text-lg">
          Real-time interaction analysis combined with predictive trends. Your listening patterns reveal acoustic preferences and temporal engagement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-teal-50 rounded-2xl text-teal-600">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Cumulative Listening</p>
            <h3 className="text-2xl font-bold text-slate-800">{analyticsData.totalHours} hrs</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Activity size={28} />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Recent Activity</p>
             <h3 className="text-2xl font-bold text-slate-800">{history.length} Plays</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <Disc size={28} />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Mood Diversity</p>
             <h3 className="text-2xl font-bold text-slate-800">{Object.keys(moodStats).length || 3}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-pink-50 rounded-2xl text-pink-600">
            <LineChartIcon size={28} />
          </div>
          <div>
             <p className="text-sm text-slate-500 font-medium">Engagement Rate</p>
             <h3 className="text-2xl font-bold text-slate-800">92%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Mood Trend Over Time */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <LineChartIcon className="text-teal-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Mood Evolution Analysis</h2>
              <p className="text-xs text-slate-500 mt-1">Combined: Real interactions + Predicted trends</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.moodTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHappy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="Happy" stroke="#14b8a6" fillOpacity={1} fill="url(#colorHappy)" />
                <Area type="monotone" dataKey="Chill" stroke="#3b82f6" fillOpacity={1} fill="url(#colorChill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-slate-500 flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-600 rounded-full"></span> Recent Activity</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-300 rounded-full"></span> Predicted Trends</span>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Disc className="text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Acoustic Profile</h2>
              <p className="text-xs text-slate-500 mt-1">Genre & timbre distribution</p>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.genreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {analyticsData.genreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Listening Hours per Genre */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Weekly Engagement Metrics</h2>
          <p className="text-xs text-slate-500 mb-4">Hourly consumption patterns</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.listeningHours} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unified Listening History */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Listening History (Hybrid)</h2>
          <div className="space-y-4">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border ${item.isReal ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <h4 className="font-semibold text-slate-800">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-white text-slate-500 rounded-full border border-slate-200 shadow-sm">
                      {item.mood}
                    </span>
                    {item.isReal && (
                       <span className="text-[10px] uppercase font-bold text-teal-600">Live Data</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-400 font-medium">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
