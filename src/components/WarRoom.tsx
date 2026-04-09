import { useState } from 'react';
import { motion } from 'motion/react';
import { useUser, Meeting } from '@/store/UserContext';
import { analyzePersonalityMatch, generateMeetingResponse, generateDebrief, generateGodModeResponse } from '@/services/geminiService';
import { ChevronLeft, Brain, Swords, History, Send, Loader2, UserCheck, Crosshair } from 'lucide-react';

export default function WarRoom({ meeting, onBack }: { meeting: Meeting, onBack: () => void }) {
  const { profile, updateMeeting } = useUser();
  const [activeTab, setActiveTab] = useState<'intel' | 'sparring' | 'debrief' | 'godmode'>('intel');
  
  // Intel State
  const [attendeeBio, setAttendeeBio] = useState('');
  const [isGeneratingIntel, setIsGeneratingIntel] = useState(false);

  // Sparring State
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'attendee', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Debrief State
  const [debriefNotes, setDebriefNotes] = useState('');
  const [isGeneratingDebrief, setIsGeneratingDebrief] = useState(false);

  // God Mode State
  const [godModeInput, setGodModeInput] = useState('');
  const [godModeResponse, setGodModeResponse] = useState('');
  const [isGeneratingGodMode, setIsGeneratingGodMode] = useState(false);

  const handleGenerateIntel = async () => {
    if (!attendeeBio.trim()) return;
    setIsGeneratingIntel(true);
    try {
      const result = await analyzePersonalityMatch(attendeeBio, profile);
      updateMeeting(meeting.id, { ...meeting, opponentProfile: result });
    } catch (error) {
      console.error(error);
      alert("Failed to generate intel.");
    } finally {
      setIsGeneratingIntel(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user' as const, text: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsChatting(true);

    try {
      const context = meeting.opponentProfile || meeting.attendees || "A generic business meeting attendee.";
      const response = await generateMeetingResponse(newHistory, profile, context);
      setChatHistory([...newHistory, { role: 'attendee', text: response }]);
    } catch (error) {
      console.error(error);
      setChatHistory([...newHistory, { role: 'attendee', text: "Error: Simulation interrupted." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerateDebrief = async () => {
    if (!debriefNotes.trim()) return;
    setIsGeneratingDebrief(true);
    try {
      const result = await generateDebrief(debriefNotes, profile);
      updateMeeting(meeting.id, { ...meeting, debrief: result, status: 'completed' });
    } catch (error) {
      console.error(error);
      alert("Failed to generate debrief.");
    } finally {
      setIsGeneratingDebrief(false);
    }
  };

  const handleGodMode = async () => {
    if (!godModeInput.trim()) return;
    setIsGeneratingGodMode(true);
    try {
      const response = await generateGodModeResponse(godModeInput, profile, meeting.opponentProfile || '');
      setGodModeResponse(response);
      setGodModeInput('');
    } catch (error) {
      console.error(error);
      setGodModeResponse("Signal lost. Re-establishing connection...");
    } finally {
      setIsGeneratingGodMode(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-bg-card border border-accent/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-main bg-bg-main/50 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-bg-card-hover rounded-full transition-colors text-text-muted hover:text-text-main">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-serif font-bold text-text-main">{meeting.title}</h2>
            <p className="text-sm font-mono text-accent">{meeting.time} • {meeting.type}</p>
          </div>
        </div>
        <div className="hidden sm:flex bg-bg-input rounded-full p-1 shrink-0 ml-4">
          <button 
            onClick={() => setActiveTab('intel')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'intel' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
          >
            <Brain size={16} /> Intel
          </button>
          <button 
            onClick={() => setActiveTab('sparring')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'sparring' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
          >
            <Swords size={16} /> Sparring
          </button>
          <button 
            onClick={() => setActiveTab('godmode')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'godmode' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-text-muted hover:text-text-main'}`}
          >
            <Crosshair size={16} /> God Mode
          </button>
          <button 
            onClick={() => setActiveTab('debrief')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'debrief' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
          >
            <History size={16} /> Debrief
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="sm:hidden flex border-b border-border-main bg-bg-input overflow-x-auto">
        <button onClick={() => setActiveTab('intel')} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'intel' ? 'text-accent border-b-2 border-accent' : 'text-text-muted'}`}>Intel</button>
        <button onClick={() => setActiveTab('sparring')} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'sparring' ? 'text-accent border-b-2 border-accent' : 'text-text-muted'}`}>Sparring</button>
        <button onClick={() => setActiveTab('godmode')} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'godmode' ? 'text-red-500 border-b-2 border-red-500' : 'text-text-muted'}`}>God Mode</button>
        <button onClick={() => setActiveTab('debrief')} className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${activeTab === 'debrief' ? 'text-accent border-b-2 border-accent' : 'text-text-muted'}`}>Debrief</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-bg-main/20">
        
        {/* INTEL TAB */}
        {activeTab === 'intel' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!meeting.opponentProfile ? (
              <div className="bg-bg-card border border-border-main rounded-2xl p-6">
                <h3 className="text-lg font-serif mb-2 flex items-center gap-2"><UserCheck className="text-accent" /> Opponent Profiling</h3>
                <p className="text-sm text-text-muted mb-4">Paste LinkedIn bios, email threads, or descriptions of the attendees to generate a psychological combat strategy.</p>
                <textarea
                  value={attendeeBio}
                  onChange={(e) => setAttendeeBio(e.target.value)}
                  placeholder="e.g., John is the CTO. He's highly analytical, hates buzzwords, and cares deeply about security..."
                  className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none resize-none mb-4"
                />
                <button 
                  onClick={handleGenerateIntel}
                  disabled={isGeneratingIntel || !attendeeBio.trim()}
                  className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isGeneratingIntel ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : 'Generate Strategy'}
                </button>
              </div>
            ) : (
              <div className="bg-bg-card border border-accent/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                <h3 className="text-xl font-serif mb-4 text-accent-light">Psychological Strategy</h3>
                <div className="prose prose-invert max-w-none text-text-main text-sm leading-relaxed whitespace-pre-wrap">
                  {meeting.opponentProfile}
                </div>
                <button 
                  onClick={() => updateMeeting(meeting.id, { ...meeting, opponentProfile: undefined })}
                  className="mt-6 text-xs text-text-muted hover:text-red-400 uppercase tracking-widest font-mono"
                >
                  Reset Intel
                </button>
              </div>
            )}
          </div>
        )}

        {/* SPARRING TAB */}
        {activeTab === 'sparring' && (
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Swords size={20} /></div>
              <div>
                <h3 className="font-bold text-sm">Live Simulation</h3>
                <p className="text-xs text-text-muted">The AI is playing the role of the attendees. Practice your pitch.</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-bg-input border border-border-main rounded-2xl p-4 mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                  <Swords size={48} className="mb-4" />
                  <p>Type your opening statement to begin the simulation.</p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-bg-card border border-border-main text-text-main rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-bg-card border border-border-main rounded-bl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-accent" />
                    <span className="text-xs text-text-muted">Attendee is typing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response..."
                className="flex-1 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none"
                disabled={isChatting}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isChatting || !chatInput.trim()}
                className="w-14 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* GOD MODE TAB */}
        {activeTab === 'godmode' && (
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="bg-bg-card border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0"><Crosshair size={20} /></div>
              <div className="relative z-10">
                <h3 className="font-bold text-sm text-red-400">Live Assist (God Mode)</h3>
                <p className="text-xs text-text-muted">Keep this open during your meeting. Type what they say, get the perfect response instantly.</p>
              </div>
            </div>

            {godModeResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
              >
                <h4 className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2">Suggested Play</h4>
                <p className="text-xl font-serif text-white leading-relaxed">"{godModeResponse}"</p>
              </motion.div>
            )}

            <div className="mt-auto">
              <textarea
                value={godModeInput}
                onChange={(e) => setGodModeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGodMode();
                  }
                }}
                placeholder="What did they just say? (e.g., 'Your price is too high')"
                className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-red-500 outline-none resize-none mb-4"
                disabled={isGeneratingGodMode}
              />
              <button 
                onClick={handleGodMode}
                disabled={isGeneratingGodMode || !godModeInput.trim()}
                className="w-full py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-red-500/20"
              >
                {isGeneratingGodMode ? <><Loader2 size={18} className="animate-spin" /> Calculating Response...</> : 'Get Response (Enter)'}
              </button>
            </div>
          </div>
        )}

        {/* DEBRIEF TAB */}
        {activeTab === 'debrief' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!meeting.debrief ? (
              <div className="bg-bg-card border border-border-main rounded-2xl p-6">
                <h3 className="text-lg font-serif mb-2 flex items-center gap-2"><History className="text-accent" /> Post-Game Debrief</h3>
                <p className="text-sm text-text-muted mb-4">Dump your thoughts. How did it go? What did they object to? We'll extract the ROI and update your growth areas.</p>
                <textarea
                  value={debriefNotes}
                  onChange={(e) => setDebriefNotes(e.target.value)}
                  placeholder="e.g., It went okay, but they pushed back hard on the timeline. I got a little defensive..."
                  className="w-full h-32 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none resize-none mb-4"
                />
                <button 
                  onClick={handleGenerateDebrief}
                  disabled={isGeneratingDebrief || !debriefNotes.trim()}
                  className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isGeneratingDebrief ? <><Loader2 size={18} className="animate-spin" /> Analyzing ROI...</> : 'Analyze & Complete Meeting'}
                </button>
              </div>
            ) : (
              <div className="bg-bg-card border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded-md">Completed</span>
                  <h3 className="text-xl font-serif text-text-main">Meeting ROI & Insights</h3>
                </div>
                <div className="prose prose-invert max-w-none text-text-main text-sm leading-relaxed whitespace-pre-wrap">
                  {meeting.debrief}
                </div>
                <button 
                  onClick={() => updateMeeting(meeting.id, { ...meeting, debrief: undefined, status: 'upcoming' })}
                  className="mt-6 text-xs text-text-muted hover:text-red-400 uppercase tracking-widest font-mono"
                >
                  Reset Debrief
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
