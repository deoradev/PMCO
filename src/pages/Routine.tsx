import { motion } from 'motion/react';
import { Battery, Sun, Moon, Coffee, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/store/UserContext';
import { optimizeRoutine } from '@/services/geminiService';

export default function Routine() {
  const { profile, routine, setRoutine } = useUser();
  const [output, setOutput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!routine) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeRoutine(routine, profile);
      setOutput(result);
    } catch (e) {
      setOutput("Error optimizing routine.");
    }
    setIsOptimizing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-6xl mx-auto"
    >
      <header className="mb-12 mt-4">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4">Routine Optimizer</h1>
        <p className="text-text-muted text-lg">Align your daily schedule with your natural energy peaks.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-lg flex flex-col">
          <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Coffee className="text-accent" /> Current Routine</h2>
          <textarea 
            value={routine}
            onChange={e => setRoutine(e.target.value)}
            className="w-full flex-1 min-h-[250px] bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors resize-none mb-6"
            placeholder="e.g., 6:00 AM - Wake up..."
          />
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing || !routine}
            className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
          >
            {isOptimizing ? 'Analyzing Energy Patterns...' : <><Sparkles size={16} /> Optimize with AI</>}
          </button>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-lg h-full min-h-[400px]">
          <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Battery className="text-accent-light" /> AI Suggested Schedule</h2>
          {output ? (
            <div className="text-text-main leading-relaxed whitespace-pre-wrap font-serif">
              {output}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-sm italic text-center">
              Enter your current routine and click optimize to see AI suggestions tailored to your personality profile.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
