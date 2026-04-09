import { motion } from 'motion/react';
import { useUser } from '@/store/UserContext';
import { Calendar, Zap, Brain, ArrowRight, Plus, Clock, Users, Trash2, Edit2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const { profile, routine, setRoutine, meetings, addMeeting, removeMeeting, updateMeeting, energyAlert, refreshEnergyAlert } = useUser();
  const navigate = useNavigate();

  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [tempRoutine, setTempRoutine] = useState(routine);

  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState({ title: '', time: '', attendees: '', type: 'Standard' });
  const [isRefreshingEnergy, setIsRefreshingEnergy] = useState(false);

  useEffect(() => {
    if (!energyAlert && profile && meetings.length > 0) {
      refreshEnergyAlert();
    }
  }, [energyAlert, profile, meetings, refreshEnergyAlert]);

  const handleRefreshEnergy = async () => {
    setIsRefreshingEnergy(true);
    await refreshEnergyAlert();
    setIsRefreshingEnergy(false);
  };

  const handleSaveRoutine = () => {
    setRoutine(tempRoutine);
    setIsEditingRoutine(false);
  };

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeeting.title && newMeeting.time) {
      if (editingMeetingId) {
        updateMeeting(editingMeetingId, newMeeting);
      } else {
        addMeeting({ ...newMeeting, status: 'upcoming' });
      }
      setNewMeeting({ title: '', time: '', attendees: '', type: 'Standard' });
      setShowAddMeeting(false);
      setEditingMeetingId(null);
    }
  };

  const handleEditClick = (meeting: any) => {
    setNewMeeting({ title: meeting.title, time: meeting.time, attendees: meeting.attendees, type: meeting.type });
    setEditingMeetingId(meeting.id);
    setShowAddMeeting(true);
  };

  const handleCancelEdit = () => {
    setShowAddMeeting(false);
    setEditingMeetingId(null);
    setNewMeeting({ title: '', time: '', attendees: '', type: 'Standard' });
  };

  const upcomingMeetings = meetings.filter(m => m.status !== 'completed');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 max-w-4xl mx-auto"
    >
      <header className="mb-10 mt-4">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-2">
          Welcome back, <span className="font-serif italic text-accent">Executive</span>
        </h1>
        <p className="text-text-muted">Your AI-optimized daily briefing is ready.</p>
      </header>

      {/* Dynamic Energy Sync Widget */}
      {profile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-bg-card to-bg-card/50 border border-accent/30 rounded-3xl p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  Biometric Energy Sync
                </h3>
                <p className="text-text-main leading-relaxed">
                  {energyAlert || "Analyzing your schedule against your energy patterns..."}
                </p>
              </div>
            </div>
            <button 
              onClick={handleRefreshEnergy}
              disabled={isRefreshingEnergy}
              className="p-2 text-text-muted hover:text-accent transition-colors shrink-0"
            >
              <RefreshCw size={16} className={isRefreshingEnergy ? "animate-spin" : ""} />
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Energy Forecast */}
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-accent" size={24} />
            <h2 className="text-lg font-medium tracking-wide uppercase">Energy Pattern</h2>
          </div>
          <div className="text-lg font-serif font-light mb-2 text-accent-light">{profile?.energyPattern || "Analyzing..."}</div>
          <p className="text-sm text-text-muted">
            Your baseline cognitive energy curve.
          </p>
        </div>

        {/* Personality Pulse */}
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-light/5 rounded-full blur-3xl group-hover:bg-accent-light/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="text-accent-light" size={24} />
            <h2 className="text-lg font-medium tracking-wide uppercase">Profile Status</h2>
          </div>
          <p className="text-sm text-text-muted mb-4 line-clamp-2">
            {profile?.summary || "Profile synchronized and active."}
          </p>
          <button onClick={() => navigate('/profile')} className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1 hover:text-text-main transition-colors">
            View Deep Dive <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Daily Routine Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-light flex items-center gap-2">
            <Clock size={20} className="text-text-muted" /> Your Daily Routine
          </h3>
          <button 
            onClick={() => {
              if (isEditingRoutine) handleSaveRoutine();
              else setIsEditingRoutine(true);
            }}
            className="text-xs font-bold text-accent uppercase tracking-widest hover:text-text-main transition-colors"
          >
            {isEditingRoutine ? 'Save Routine' : 'Edit Routine'}
          </button>
        </div>
        <div className="bg-bg-card border border-border-main rounded-3xl p-6">
          {isEditingRoutine ? (
            <textarea 
              value={tempRoutine}
              onChange={(e) => setTempRoutine(e.target.value)}
              className="w-full h-40 bg-bg-input border border-border-main rounded-xl p-4 text-sm focus:border-accent outline-none transition-colors resize-none"
              placeholder="e.g., 6:00 AM - Wake up..."
            />
          ) : (
            <div className="text-sm text-text-muted whitespace-pre-wrap font-mono leading-relaxed">
              {routine || "No routine set. Click 'Edit Routine' to add your schedule."}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-serif font-light flex items-center gap-2">
          <Calendar size={20} className="text-text-muted" /> Today's Meetings
        </h3>
        <button 
          onClick={() => {
            setEditingMeetingId(null);
            setNewMeeting({ title: '', time: '', attendees: '', type: 'Standard' });
            setShowAddMeeting(!showAddMeeting);
          }}
          className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1 hover:text-text-main transition-colors"
        >
          <Plus size={14} /> Add Meeting
        </button>
      </div>

      {showAddMeeting && (
        <form onSubmit={handleSaveMeeting} className="bg-bg-card border border-accent/50 rounded-3xl p-6 mb-6 shadow-lg">
          <h4 className="text-lg font-serif mb-4">{editingMeetingId ? 'Edit Meeting' : 'Add New Meeting'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Meeting Title</label>
              <input required type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., Q3 Strategy" />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Time</label>
              <input required type="text" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., 10:00 AM - 11:00 AM" />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Attendees</label>
              <input type="text" value={newMeeting.attendees} onChange={e => setNewMeeting({...newMeeting, attendees: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., John, Sarah" />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Type</label>
              <select value={newMeeting.type} onChange={e => setNewMeeting({...newMeeting, type: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none">
                <option>Standard</option>
                <option>High Stakes</option>
                <option>Brainstorm</option>
                <option>Pitch</option>
                <option>1-on-1</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-sm text-text-muted hover:text-text-main">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-light transition-colors">
              {editingMeetingId ? 'Save Changes' : 'Save Meeting'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {upcomingMeetings.length === 0 ? (
          <div className="bg-bg-card border border-border-main rounded-2xl p-8 text-center text-text-muted">
            <Calendar size={32} className="mx-auto mb-3 opacity-20" />
            <p>No upcoming meetings scheduled for today.</p>
          </div>
        ) : (
          upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-bg-card border border-border-main rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bg-card-hover transition-colors group">
              <div>
                <div className="text-xs text-accent font-mono mb-1">{meeting.time} • {meeting.type}</div>
                <h4 className="text-lg font-medium mb-1">{meeting.title}</h4>
                {meeting.attendees && (
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <Users size={12} /> {meeting.attendees}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/meetings')} className="text-xs font-bold text-accent-light uppercase tracking-widest hover:underline">
                  Enter War Room
                </button>
                <div className="flex items-center gap-2 transition-opacity">
                  <button onClick={() => handleEditClick(meeting)} className="p-2 text-text-muted hover:text-accent transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeMeeting(meeting.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
