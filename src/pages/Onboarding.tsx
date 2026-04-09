import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/store/UserContext';
import { generateProfile } from '@/services/geminiService';
import { ArrowRight, BrainCircuit, Sun, Moon } from 'lucide-react';
import Logo from '@/components/Logo';

const questions = [
  "What's your go-to morning ritual?",
  "How do you recharge after back-to-back meetings?",
  "Describe your ideal meeting outcome in one sentence.",
  "Rate your comfort speaking in large vs small groups.",
  "What is your biggest pet peeve during a presentation?",
  "How do you prepare for a high-stakes negotiation?",
  "Do you prefer structured agendas or free-flowing brainstorms?",
  "How do you handle conflict or disagreement in a meeting?",
  "What time of day do you feel most sharp and focused?",
  "If you could change one thing about your communication style, what would it be?"
];

const loadingMessages = [
  "Analyzing cognitive patterns...",
  "Mapping behavioral traits...",
  "Evaluating communication style...",
  "Synthesizing energy rhythms...",
  "Generating personality matrix...",
  "Finalizing your unique PMC profile..."
];

export default function Onboarding() {
  const [step, setStep] = useState(-1); // -1 is splash
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const { completeOnboarding, theme, toggleTheme } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleNext = async () => {
    if (step >= 0) {
      setAnswers(prev => ({ ...prev, [questions[step]]: currentAnswer }));
      setCurrentAnswer('');
    }

    if (step === questions.length - 1) {
      // Process with AI
      setIsProcessing(true);
      try {
        const finalAnswers = { ...answers, [questions[step]]: currentAnswer };
        const profile = await generateProfile(finalAnswers);
        completeOnboarding(profile);
        navigate('/');
      } catch (error) {
        console.error("Failed to generate profile", error);
        alert("Error generating profile. Please try again.");
        setIsProcessing(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

    if (isProcessing) {
      return (
        <div className="h-screen bg-bg-main text-text-main flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
            <BrainCircuit size={80} className="text-accent relative z-10" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-2xl font-serif tracking-widest text-accent-light"
          >
            ANALYZING PERSONALITY
          </motion.h2>
          
          <div className="h-8 mt-6 overflow-hidden relative w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-text-muted absolute w-full text-center font-mono text-sm uppercase tracking-wider"
              >
                {loadingMessages[loadingMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="w-64 h-1 bg-bg-card-hover rounded-full mt-8 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent-light to-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>
        </div>
      );
    }

  return (
    <div className="h-screen bg-bg-main text-text-main flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Comfort Promise */}
      <div className="absolute top-0 w-full bg-bg-card backdrop-blur-md border-b border-border-main p-2 flex items-center justify-center z-50">
        <p className="text-[10px] sm:text-xs text-text-muted font-mono uppercase tracking-widest max-w-4xl mx-auto text-center px-12">
          PMC exists to understand your unique personality and routine so you feel completely comfortable, confident, and unstoppable in every meeting. Your data stays private and is used only to serve you.
        </p>
        <button onClick={toggleTheme} className="absolute right-4 p-2 rounded-full hover:bg-bg-card-hover transition-colors">
          {theme === 'dark' ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-accent-dark" />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
        <AnimatePresence mode="wait">
          {step === -1 ? (
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-lg flex flex-col items-center"
            >
              <Logo className="w-32 h-32 mb-8" textSize="text-5xl" stacked={true} />
              <p className="text-xl font-serif italic text-text-muted mb-6">
                Personality Management Co.
              </p>
              <div className="text-sm text-text-muted mb-10 leading-relaxed space-y-4 text-left max-w-2xl mx-auto bg-bg-card p-6 sm:p-8 rounded-3xl border border-border-main shadow-lg">
                <p className="font-bold text-text-main text-center text-lg mb-4">What exactly are we here for?</p>
                <p><strong>1. Deep Personality Analysis:</strong> We don't just schedule meetings. We analyze your unique psychological profile, energy patterns, and communication style.</p>
                <p><strong>2. Hyper-Personalized Preparation:</strong> Before every meeting, our AI simulates the exact attendees you'll face, allowing you to practice your pitch against their specific personalities.</p>
                <p><strong>3. Unstoppable Confidence:</strong> By aligning your daily routine with your natural energy peaks and providing real-time tone analysis, we ensure you walk into every room completely comfortable and ready to succeed.</p>
                <p className="text-xs text-center mt-6 text-accent font-mono uppercase tracking-widest">Your data is strictly encrypted and 100% private.</p>
              </div>
              <button
                onClick={handleNext}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-text-main transition-all duration-500 bg-bg-card border border-border-main rounded-full hover:bg-bg-card-hover overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase text-sm">
                  Initialize Sync <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-accent to-accent-dark opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl"
            >
              <div className="mb-8 flex justify-between items-center text-xs font-mono text-accent-light">
                <span>DATA POINT {step + 1} / {questions.length}</span>
                <div className="h-1 w-32 bg-bg-card-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-light to-accent" 
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light leading-tight mb-8">
                {questions[step]}
              </h2>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response..."
                className="w-full h-40 bg-bg-card border border-border-main rounded-2xl p-6 text-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none placeholder:text-text-muted"
                autoFocus
              />
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer.trim()}
                  className="flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-light transition-all uppercase tracking-widest text-sm"
                >
                  {step === questions.length - 1 ? 'Process Profile' : 'Next'} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
