import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Plus, Trash2, Edit2, Swords, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useUser, Meeting } from '@/store/UserContext';
import WarRoom from '@/components/WarRoom';

export default function Meetings() {
  const { meetings, addMeeting, removeMeeting, updateMeeting } = useUser();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [newMeeting, setNewMeeting] = useState({ title: '', time: '', attendees: '', type: 'Standard' });

  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);

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

  const handleEditClick = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    setNewMeeting({ title: meeting.title, time: meeting.time, attendees: meeting.attendees, type: meeting.type });
    setEditingMeetingId(meeting.id);
    setShowAddMeeting(true);
  };

  const handleCancelEdit = () => {
    setShowAddMeeting(false);
    setEditingMeetingId(null);
    setNewMeeting({ title: '', time: '', attendees: '', type: 'Standard' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-6xl mx-auto"
    >
      <header className="mb-12 mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-light tracking-tight mb-4">Meetings</h1>
          <p className="text-text-muted text-lg">Your upcoming schedule and executive war room.</p>
        </div>
        {!selectedMeetingId && (
          <button 
            onClick={() => {
              setEditingMeetingId(null);
              setNewMeeting({ title: '', time: '', attendees: '', type: 'Standard' });
              setShowAddMeeting(!showAddMeeting);
            }}
            className="px-6 py-3 bg-accent text-white font-bold rounded-full uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add Meeting
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {selectedMeeting ? (
          <motion.div
            key="war-room"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <WarRoom meeting={selectedMeeting} onBack={() => setSelectedMeetingId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="meeting-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {showAddMeeting && (
              <form onSubmit={handleSaveMeeting} className="bg-bg-card border border-accent/50 rounded-3xl p-6 mb-8 shadow-lg max-w-3xl">
                <h3 className="text-xl font-serif mb-4">{editingMeetingId ? 'Edit Meeting' : 'Schedule New Meeting'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Meeting Title</label>
                    <input required type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., Q3 Strategy" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Time</label>
                    <input required type="text" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., 10:00 AM - 11:00 AM" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Attendees (Comma separated)</label>
                    <input type="text" value={newMeeting.attendees} onChange={e => setNewMeeting({...newMeeting, attendees: e.target.value})} className="w-full bg-bg-input border border-border-main rounded-xl p-3 text-sm focus:border-accent outline-none" placeholder="e.g., John (CTO), Sarah (VP Sales)" />
                  </div>
                  <div className="sm:col-span-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.length === 0 ? (
                <div className="col-span-full bg-bg-card border border-border-main rounded-2xl p-12 text-center text-text-muted">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No meetings scheduled.</p>
                  <p className="text-sm mt-2">Add a meeting to access the War Room.</p>
                </div>
              ) : (
                meetings.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setSelectedMeetingId(m.id)}
                    className="p-6 rounded-3xl border bg-bg-card border-border-main hover:border-accent/50 cursor-pointer transition-all group hover:shadow-xl hover:-translate-y-1 flex flex-col h-full relative overflow-hidden"
                  >
                    {m.status === 'completed' && (
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest py-1 px-8 rotate-45 translate-x-4 translate-y-2">
                          Done
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold font-serif text-xl pr-8">{m.title}</h3>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6 bg-bg-card/80 backdrop-blur-sm p-1 rounded-lg">
                        <button 
                          onClick={(e) => handleEditClick(m, e)}
                          className="p-1.5 text-text-muted hover:text-accent hover:bg-bg-input rounded-md transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeMeeting(m.id); }}
                          className="p-1.5 text-text-muted hover:text-red-500 hover:bg-bg-input rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm text-text-muted mb-6 flex-1">
                      <div className="flex items-center gap-3"><Clock size={16} className="text-accent" /> {m.time}</div>
                      {m.attendees && <div className="flex items-center gap-3"><Users size={16} className="text-accent" /> <span className="line-clamp-2">{m.attendees}</span></div>}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border-main mt-auto">
                      <span className="text-xs font-mono px-3 py-1.5 bg-bg-input rounded-lg text-text-main border border-border-main">{m.type}</span>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:translate-x-1 transition-transform">
                        <Swords size={14} /> Enter War Room
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
