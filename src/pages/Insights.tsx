import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';
import { useUser } from '@/store/UserContext';

const mockGrowthData = [
  { name: 'Week 1', confidence: 65, clarity: 70 },
  { name: 'Week 2', confidence: 72, clarity: 75 },
  { name: 'Week 3', confidence: 80, clarity: 82 },
  { name: 'Week 4', confidence: 85, clarity: 88 },
];

const mockMeetingOutcomes = [
  { name: 'Pitch', success: 85, neutral: 10, fail: 5 },
  { name: 'Strategy', success: 90, neutral: 5, fail: 5 },
  { name: '1-on-1', success: 95, neutral: 5, fail: 0 },
  { name: 'Review', success: 75, neutral: 20, fail: 5 },
];

export default function Insights() {
  const { profile } = useUser();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-6xl mx-auto"
    >
      <header className="mb-12 mt-4">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4">Insights</h1>
        <p className="text-text-muted text-lg">Weekly AI reports, personality growth charts, and meeting success analytics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-accent">
            <TrendingUp size={24} />
            <h3 className="font-serif font-bold">Confidence Score</h3>
          </div>
          <div className="text-4xl font-light mb-2">85<span className="text-lg text-text-muted">/100</span></div>
          <p className="text-sm text-green-500 flex items-center gap-1">+12% from last month</p>
        </div>
        
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-accent-light">
            <Target size={24} />
            <h3 className="font-serif font-bold">Meeting Success</h3>
          </div>
          <div className="text-4xl font-light mb-2">92<span className="text-lg text-text-muted">%</span></div>
          <p className="text-sm text-green-500 flex items-center gap-1">+5% from last month</p>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-accent-dark">
            <Zap size={24} />
            <h3 className="font-serif font-bold">Energy Alignment</h3>
          </div>
          <div className="text-4xl font-light mb-2">Optimal</div>
          <p className="text-sm text-text-muted flex items-center gap-1">Based on routine sync</p>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <Award size={24} />
            <h3 className="font-serif font-bold">Top Trait</h3>
          </div>
          <div className="text-xl font-medium mb-2 capitalize">{profile?.traits?.[0] || 'Strategic'}</div>
          <p className="text-sm text-text-muted flex items-center gap-1">Highly effective in pitches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-serif mb-8">Personality Growth (30 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="clarity" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-serif mb-8">Meeting Outcomes by Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMeetingOutcomes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neutral" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
