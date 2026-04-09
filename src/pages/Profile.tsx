import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/store/UserContext';
import { User, Activity, RefreshCw, X, BrainCircuit, TrendingUp, Target, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { profile, refreshAiAnalysis, meetings } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!profile) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAiAnalysis(additionalContext);
      setIsModalOpen(false);
      setAdditionalContext('');
    } catch (error) {
      alert("Failed to refresh profile. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const completedMeetings = meetings.filter(m => m.status === 'completed').length;
  const totalMeetings = meetings.length;
  const winRate = totalMeetings > 0 ? Math.round((completedMeetings / totalMeetings) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 max-w-4xl mx-auto relative"
    >
      <header className="mb-10 mt-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-light tracking-tight mb-2">
            Personality <span className="font-serif italic text-accent">Deep-Dive</span>
          </h1>
          <p className="text-text-muted">Your AI-updated traits and data vault.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 rounded-full bg-bg-card border border-border-main flex items-center justify-center gap-2 hover:bg-bg-card-hover transition-colors text-sm font-bold uppercase tracking-widest text-accent"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Refresh Analysis</span>
        </button>
      </header>

      {/* Executive Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 text-text-muted">
            <Target size={18} />
            <span className="text-xs font-mono uppercase tracking-widest">Meetings Conquered</span>
          </div>
          <div className="text-4xl font-serif text-text-main">{completedMeetings} <span className="text-lg text-text-muted">/ {totalMeetings}</span></div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-center gap-3 mb-2 text-text-muted">
            <TrendingUp size={18} className="text-accent" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent">Communication ROI</span>
          </div>
          <div className="text-4xl font-serif text-accent-light">+{winRate}%</div>
        </div>
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 text-text-muted">
            <ShieldCheck size={18} />
            <span className="text-xs font-mono uppercase tracking-widest">Profile Integrity</span>
          </div>
          <div className="text-4xl font-serif text-text-main">100%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-bg-card border border-border-main rounded-3xl p-8">
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
            <User size={16} /> Core Summary
          </h2>
          <p className="text-lg leading-relaxed text-text-main">
            {profile.summary}
          </p>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-8">
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity size={16} /> Energy Pattern
          </h2>
          <p className="text-lg text-accent-light font-medium">
            {profile.energyPattern}
          </p>
          <div className="mt-6 h-24 w-full flex items-end gap-1 opacity-70">
            {/* Fake heatmap bars */}
            {[40, 60, 80, 100, 90, 70, 50, 30, 20, 10, 20, 40].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-accent/20 to-accent rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border-main rounded-3xl p-8">
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Strengths</h2>
          <ul className="space-y-4">
            {profile.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent"></div>
                <span className="text-text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-8">
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-6">Areas for Growth</h2>
          <ul className="space-y-4">
            {profile.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent-dark"></div>
                <span className="text-text-muted">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Refresh Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border-main rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => !isRefreshing && setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main transition-colors"
                disabled={isRefreshing}
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-serif mb-2 flex items-center gap-2">
                  <BrainCircuit className="text-accent" />
                  Update AI Analysis
                </h2>
                <p className="text-sm text-text-muted">
                  Has anything changed? Tell us about new challenges, shifts in your routine, or areas you want to focus on. We'll recalibrate your profile.
                </p>
              </div>

              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g., I've been feeling more burnt out in the afternoons lately, and I'm leading a new project..."
                className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none mb-6"
                disabled={isRefreshing}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-full text-sm font-bold text-text-muted hover:text-text-main transition-colors"
                  disabled={isRefreshing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-6 py-2 bg-accent text-white rounded-full text-sm font-bold hover:bg-accent-light transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Recalibrating...
                    </>
                  ) : (
                    'Sync & Update'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
