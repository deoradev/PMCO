import { motion, AnimatePresence } from 'motion/react';
import { Mic, Users, Target, Battery, FileAudio, BookOpen, Activity, Lock, Sparkles, Cpu, Play, Square, Send, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { 
  generateSpeech, 
  generateMeetingResponse,
  analyzePersonalityMatch,
  optimizeRoutine,
  analyzeTone,
  predictConflict,
  generateDebrief,
  unlockVault
} from '@/services/geminiService';
import { useUser } from '@/store/UserContext';

const featuresList = [
  { id: 'sim', title: "Meeting Simulator", desc: "Real-time voice companion for role-playing. Practice your pitch against AI-simulated attendees tailored to your exact scenario.", icon: Users, color: "text-accent" },
  { id: 'match', title: "Personality Profiler", desc: "Deep psychological analysis of attendees. Upload a list and let AI predict dynamics and suggest exact communication strategies.", icon: Target, color: "text-accent-light" },
  { id: 'routine', title: "Energy Optimizer", desc: "Schedule alignment based on your circadian rhythm. AI scans your routine and auto-suggests optimal meeting slots and breaks.", icon: Battery, color: "text-accent-dark" },
  { id: 'pulse', title: "Tone Analyzer", desc: "Real-time feedback on your speaking tone and pacing. Ensure you project confidence and clarity in every high-stakes room.", icon: Activity, color: "text-accent" },
  { id: 'story', title: "Conflict Predictor", desc: "Anticipate and prepare for disagreements. AI models potential friction points based on attendee profiles and your agenda.", icon: BookOpen, color: "text-accent-light" },
  { id: 'speech', title: "Pitch Perfector", desc: "AI-driven refinement of your core message. Instantly write or rewrite speeches matching your personality and goals.", icon: Mic, color: "text-accent-dark" },
  { id: 'debrief', title: "Post-Meeting Insights", desc: "Automated debriefs and action item extraction. Upload notes or voice memos for AI to analyze and update your behavioral profile.", icon: FileAudio, color: "text-accent" },
  { id: 'vault', title: "Executive Vault", desc: "Secure, encrypted storage for your behavioral data. AI continuously learns from every interaction to surface hidden strengths.", icon: Lock, color: "text-accent-light" }
];

export default function AIFeatures() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const { profile } = useUser();
  
  // Speech Writer State
  const [speechInput, setSpeechInput] = useState({ scenario: '', bullets: '' });
  const [speechOutput, setSpeechOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Meeting Simulator State
  const [simContext, setSimContext] = useState('');
  const [simStarted, setSimStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Match State
  const [matchInput, setMatchInput] = useState('');
  const [matchOutput, setMatchOutput] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  // Routine State
  const [routineInput, setRoutineInput] = useState('');
  const [routineOutput, setRoutineOutput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Pulse State
  const [pulseInput, setPulseInput] = useState('');
  const [pulseOutput, setPulseOutput] = useState('');
  const [isAnalyzingTone, setIsAnalyzingTone] = useState(false);

  // Story (Conflict) State
  const [conflictInput, setConflictInput] = useState('');
  const [conflictOutput, setConflictOutput] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);

  // Debrief State
  const [debriefInput, setDebriefInput] = useState('');
  const [debriefOutput, setDebriefOutput] = useState('');
  const [isDebriefing, setIsDebriefing] = useState(false);

  // Vault State
  const [vaultOutput, setVaultOutput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleGenerateSpeech = async () => {
    if (!speechInput.scenario || !speechInput.bullets) return;
    setIsGenerating(true);
    try {
      const result = await generateSpeech(speechInput.scenario, speechInput.bullets, profile);
      setSpeechOutput(result);
    } catch (e) {
      console.error(e);
      setSpeechOutput("Error generating speech. Ensure API key is set.");
    }
    setIsGenerating(false);
  };

  const startSimulator = async () => {
    if (!simContext) return;
    setSimStarted(true);
    setChatHistory([]);
    setIsSimulating(true);
    try {
      const initialResponse = await generateMeetingResponse([], profile, simContext);
      setChatHistory([{ role: 'ai', text: initialResponse }]);
      speak(initialResponse);
    } catch (e) {
      console.error(e);
      setChatHistory([{ role: 'ai', text: "Error connecting to AI. Please try again." }]);
    }
    setIsSimulating(false);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', text: currentInput }];
    setChatHistory(newHistory);
    setCurrentInput('');
    setIsSimulating(true);
    
    try {
      const response = await generateMeetingResponse(newHistory, profile, simContext);
      setChatHistory([...newHistory, { role: 'ai', text: response }]);
      speak(response);
    } catch (e) {
      console.error(e);
      setChatHistory([...newHistory, { role: 'ai', text: "Error connecting to AI." }]);
    }
    setIsSimulating(false);
  };

  const handleMatch = async () => {
    if (!matchInput) return;
    setIsMatching(true);
    try {
      const result = await analyzePersonalityMatch(matchInput, profile);
      setMatchOutput(result);
    } catch (e) {
      setMatchOutput("Error analyzing match.");
    }
    setIsMatching(false);
  };

  const handleRoutine = async () => {
    if (!routineInput) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeRoutine(routineInput, profile);
      setRoutineOutput(result);
    } catch (e) {
      setRoutineOutput("Error optimizing routine.");
    }
    setIsOptimizing(false);
  };

  const handlePulse = async () => {
    if (!pulseInput) return;
    setIsAnalyzingTone(true);
    try {
      const result = await analyzeTone(pulseInput, profile);
      setPulseOutput(result);
    } catch (e) {
      setPulseOutput("Error analyzing tone.");
    }
    setIsAnalyzingTone(false);
  };

  const handleConflict = async () => {
    if (!conflictInput) return;
    setIsPredicting(true);
    try {
      const result = await predictConflict(conflictInput, profile);
      setConflictOutput(result);
    } catch (e) {
      setConflictOutput("Error predicting conflict.");
    }
    setIsPredicting(false);
  };

  const handleDebrief = async () => {
    if (!debriefInput) return;
    setIsDebriefing(true);
    try {
      const result = await generateDebrief(debriefInput, profile);
      setDebriefOutput(result);
    } catch (e) {
      setDebriefOutput("Error generating debrief.");
    }
    setIsDebriefing(false);
  };

  const handleVault = async () => {
    setIsUnlocking(true);
    try {
      const result = await unlockVault(profile);
      setVaultOutput(result);
    } catch (e) {
      setVaultOutput("Error unlocking vault.");
    }
    setIsUnlocking(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const renderDemoBlock = (
    id: string, 
    icon: any, 
    title: string, 
    inputLabel: string, 
    inputPlaceholder: string, 
    inputValue: string, 
    setInputValue: (v: string) => void, 
    buttonText: string, 
    loadingText: string, 
    isLoading: boolean, 
    outputValue: string, 
    onAction: () => void,
    isTextarea: boolean = true
  ) => {
    const Icon = icon;
    return (
      <motion.div 
        key={id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg-card border border-accent/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-2xl font-serif font-light mb-6 flex items-center gap-3">
          <Icon className="text-accent" /> Live Demo: {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-2 uppercase">{inputLabel}</label>
              {isTextarea ? (
                <textarea 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full h-40 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors resize-none"
                />
              ) : (
                <input 
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors"
                />
              )}
            </div>
            <button 
              onClick={onAction}
              disabled={isLoading || !inputValue}
              className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
            >
              {isLoading ? loadingText : buttonText}
            </button>
          </div>
          
          <div className="bg-bg-input border border-border-main rounded-xl p-6 h-full min-h-[300px] overflow-y-auto">
            <div className="text-xs font-mono text-text-muted mb-4 uppercase">AI Output</div>
            {outputValue ? (
              <div className="text-sm text-text-main leading-relaxed whitespace-pre-wrap font-serif">
                {outputValue}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-sm italic text-center">
                Output will appear here, perfectly tailored to your personality profile.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-6xl mx-auto"
    >
      <header className="mb-12 mt-4 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-widest mb-6">
          <Sparkles size={14} /> High-Thinking AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-tight mb-4">
          Showcase Hub
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          Explore the 8 core pillars of the Personality Management Co. Select a feature to activate its live interactive demo.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {featuresList.map((f, i) => {
          const Icon = f.icon;
          const isActive = activeDemo === f.id;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={f.id}
              onClick={() => {
                setActiveDemo(f.id === activeDemo ? null : f.id);
                if (f.id !== 'sim') {
                  setSimStarted(false);
                  window.speechSynthesis?.cancel();
                }
              }}
              className={`bg-bg-card border ${isActive ? 'border-accent shadow-[0_0_30px_rgba(0,0,0,0)] shadow-accent/20 scale-[1.02]' : 'border-border-main hover:border-accent/50'} rounded-3xl p-6 cursor-pointer hover:bg-bg-card-hover transition-all duration-300 group flex flex-col h-full`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-bg-input border border-border-main flex items-center justify-center ${f.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon size={24} />
                </div>
                <ChevronRight size={20} className={`text-text-muted transition-transform duration-300 ${isActive ? 'rotate-90 text-accent' : 'group-hover:translate-x-1'}`} />
              </div>
              <h3 className="text-lg font-bold mb-3 font-serif text-text-main">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">{f.desc}</p>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Speech Writer Demo */}
        {activeDemo === 'speech' && (
          <motion.div 
            key="speech"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card border border-accent/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-2xl font-serif font-light mb-6 flex items-center gap-3">
              <Mic className="text-accent" /> Live Demo: Pitch Perfector
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Scenario</label>
                  <input 
                    type="text"
                    value={speechInput.scenario}
                    onChange={e => setSpeechInput({...speechInput, scenario: e.target.value})}
                    placeholder="e.g., Pitching a new AI product to the board"
                    className="w-full bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Key Bullet Points</label>
                  <textarea 
                    value={speechInput.bullets}
                    onChange={e => setSpeechInput({...speechInput, bullets: e.target.value})}
                    placeholder="- Saves 40% time&#10;- Highly secure&#10;- Needs $50k budget"
                    className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors resize-none"
                  />
                </div>
                <button 
                  onClick={handleGenerateSpeech}
                  disabled={isGenerating || !speechInput.scenario || !speechInput.bullets}
                  className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Refining Pitch...' : 'Generate Pitch'}
                </button>
              </div>
              
              <div className="bg-bg-input border border-border-main rounded-xl p-6 h-full min-h-[300px] overflow-y-auto">
                <div className="text-xs font-mono text-text-muted mb-4 uppercase">AI Output</div>
                {speechOutput ? (
                  <div className="text-sm text-text-main leading-relaxed whitespace-pre-wrap font-serif">
                    {speechOutput}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-sm italic text-center">
                    Output will appear here, perfectly tailored to your personality profile.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Meeting Simulator Demo */}
        {activeDemo === 'sim' && (
          <motion.div 
            key="sim"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card border border-accent-light/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-light/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-2xl font-serif font-light mb-6 flex items-center gap-3">
              <Users className="text-accent-light" /> Live Demo: Meeting Simulator
            </h2>

            {!simStarted ? (
              <div className="max-w-xl mx-auto text-center py-8">
                <p className="text-text-muted mb-8">
                  Configure your AI roleplay partner. They will adapt to your personality profile and challenge you in real-time.
                </p>
                <div className="text-left mb-6">
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Who are you meeting with?</label>
                  <textarea 
                    value={simContext}
                    onChange={e => setSimContext(e.target.value)}
                    placeholder="e.g., A skeptical CTO who cares deeply about security and budget, and hates buzzwords."
                    className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent-light outline-none transition-colors resize-none"
                  />
                </div>
                <button 
                  onClick={startSimulator}
                  disabled={!simContext.trim() || isSimulating}
                  className="px-8 py-4 bg-gradient-to-r from-accent-light to-accent text-white font-bold rounded-full uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent-light/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                  {isSimulating ? 'Initializing...' : <><Play size={18} /> Start Simulation</>}
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border-main">
                  <div className="text-sm text-accent-light font-mono flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-light animate-pulse"></div>
                    SIMULATION ACTIVE
                  </div>
                  <button 
                    onClick={() => {
                      setSimStarted(false);
                      window.speechSynthesis?.cancel();
                    }}
                    className="text-xs text-text-muted hover:text-text-main flex items-center gap-1"
                  >
                    <Square size={12} /> End Session
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-bg-card-hover border border-border-main text-text-main rounded-br-none' 
                          : 'bg-bg-input border border-accent-light/30 text-text-main rounded-bl-none font-serif'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isSimulating && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-bg-input border border-accent-light/30 text-text-muted rounded-bl-none flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent-light rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-accent-light rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleListening}
                    className={`p-4 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-bg-card border border-border-main text-text-muted hover:text-text-main hover:bg-bg-card-hover'}`}
                  >
                    <Mic size={20} />
                  </button>
                  <input 
                    type="text"
                    value={currentInput}
                    onChange={e => setCurrentInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your response or use voice..."
                    className="flex-1 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent-light outline-none transition-colors"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isSimulating}
                    className="p-4 bg-accent-light text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Match Demo */}
        {activeDemo === 'match' && renderDemoBlock(
          'match', Target, 'Personality Profiler', 
          'Attendees List & Context', 'e.g., John (CEO, highly analytical, impatient), Sarah (VP Sales, relationship-focused)', 
          matchInput, setMatchInput, 'Analyze Dynamics', 'Analyzing...', isMatching, matchOutput, handleMatch
        )}

        {/* Routine Demo */}
        {activeDemo === 'routine' && renderDemoBlock(
          'routine', Battery, 'Energy Optimizer', 
          'Current Daily Routine', 'e.g., Wake up at 6am, workout, heavy meetings from 9am-2pm, crash at 3pm.', 
          routineInput, setRoutineInput, 'Optimize Schedule', 'Optimizing...', isOptimizing, routineOutput, handleRoutine
        )}

        {/* Pulse Demo */}
        {activeDemo === 'pulse' && renderDemoBlock(
          'pulse', Activity, 'Tone Analyzer', 
          'Paste a recent speech or pitch text', 'e.g., "I think we should probably try to maybe increase the budget if possible..."', 
          pulseInput, setPulseInput, 'Analyze Tone', 'Analyzing...', isAnalyzingTone, pulseOutput, handlePulse
        )}

        {/* Story Demo */}
        {activeDemo === 'story' && renderDemoBlock(
          'story', BookOpen, 'Conflict Predictor', 
          'Meeting Agenda & Goals', 'e.g., Proposing a 20% budget cut to the marketing team to fund new engineering hires.', 
          conflictInput, setConflictInput, 'Predict Friction', 'Predicting...', isPredicting, conflictOutput, handleConflict
        )}

        {/* Debrief Demo */}
        {activeDemo === 'debrief' && renderDemoBlock(
          'debrief', FileAudio, 'Post-Meeting Insights', 
          'Raw Meeting Notes', 'e.g., Client seemed hesitant about pricing. Asked for more case studies. Promised to follow up by Friday.', 
          debriefInput, setDebriefInput, 'Extract Insights', 'Extracting...', isDebriefing, debriefOutput, handleDebrief
        )}

        {/* Vault Demo */}
        {activeDemo === 'vault' && (
          <motion.div 
            key="vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-card border border-accent/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-2xl font-serif font-light mb-6 flex items-center gap-3">
              <Lock className="text-accent" /> Live Demo: Executive Vault
            </h2>
            
            <div className="max-w-2xl mx-auto text-center py-8">
              <p className="text-text-muted mb-8">
                Your Executive Vault securely stores your behavioral data. Click below to let AI analyze your existing profile and surface hidden strengths and blind spots.
              </p>
              
              {!vaultOutput ? (
                <button 
                  onClick={handleVault}
                  disabled={isUnlocking}
                  className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-full uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 mx-auto"
                >
                  {isUnlocking ? 'Unlocking Vault...' : 'Unlock Vault Insights'}
                </button>
              ) : (
                <div className="bg-bg-input border border-border-main rounded-xl p-6 text-left">
                  <div className="text-xs font-mono text-text-muted mb-4 uppercase">Vault Analysis</div>
                  <div className="text-sm text-text-main leading-relaxed whitespace-pre-wrap font-serif">
                    {vaultOutput}
                  </div>
                  <button 
                    onClick={() => setVaultOutput('')}
                    className="mt-6 text-xs text-accent uppercase tracking-widest hover:underline"
                  >
                    Close Vault
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
