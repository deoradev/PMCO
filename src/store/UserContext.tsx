import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateProfile, analyzeEnergySync } from '@/services/geminiService';

interface UserProfile {
  traits: string[];
  meetingStyle: string;
  energyPattern: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

type Theme = 'dark' | 'light';

export interface Meeting {
  id: string;
  title: string;
  time: string;
  attendees: string;
  type: string;
  status?: 'upcoming' | 'completed';
  opponentProfile?: string;
  debrief?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  isOnboarded: boolean;
  completeOnboarding: (profile: UserProfile) => void;
  clearData: () => void;
  theme: Theme;
  toggleTheme: () => void;
  email: string | null;
  setEmail: (email: string) => void;
  donationStatus: 'pending' | 'skipped' | 'donated';
  setDonationStatus: (status: 'pending' | 'skipped' | 'donated') => void;
  certificateViewed: boolean;
  setCertificateViewed: (viewed: boolean) => void;
  routine: string;
  setRoutine: (routine: string) => void;
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  removeMeeting: (id: string) => void;
  updateMeeting: (id: string, meeting: Omit<Meeting, 'id'>) => void;
  refreshAiAnalysis: (additionalContext?: string) => Promise<void>;
  energyAlert: string | null;
  refreshEnergyAlert: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pmc_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [email, setEmailState] = useState<string | null>(() => {
    return localStorage.getItem('pmc_email') || null;
  });

  const [donationStatus, setDonationStatusState] = useState<'pending' | 'skipped' | 'donated'>(() => {
    return (localStorage.getItem('pmc_donation_status') as any) || 'pending';
  });

  const [certificateViewed, setCertificateViewedState] = useState<boolean>(() => {
    return localStorage.getItem('pmc_certificate_viewed') === 'true';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('pmc_theme');
    return (saved as Theme) || 'dark';
  });

  const [routine, setRoutineState] = useState<string>(() => {
    return localStorage.getItem('pmc_routine') || '6:00 AM - Wake up, Coffee\n7:00 AM - Gym\n9:00 AM - Back-to-back meetings\n1:00 PM - Quick lunch\n2:00 PM - Deep work\n5:00 PM - Wrap up';
  });

  const [meetings, setMeetingsState] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('pmc_meetings');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: "Q3 Strategy Alignment", time: "10:00 AM - 11:30 AM", attendees: "Sarah (VP Sales), John (CTO)", type: "High Stakes", status: 'upcoming' },
      { id: '2', title: "Product Roadmap Sync", time: "2:00 PM - 3:00 PM", attendees: "Design Team, Engineering Leads", type: "Brainstorm", status: 'upcoming' },
      { id: '3', title: "Client Pitch: Acme Corp", time: "4:30 PM - 5:15 PM", attendees: "Acme CEO, Acme Procurement", type: "Pitch", status: 'upcoming' }
    ];
  });

  const [energyAlert, setEnergyAlertState] = useState<string | null>(() => {
    return localStorage.getItem('pmc_energy_alert') || null;
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('pmc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setProfile = (newProfile: UserProfile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      localStorage.setItem('pmc_profile', JSON.stringify(newProfile));
    } else {
      localStorage.removeItem('pmc_profile');
    }
  };

  const setEmail = (newEmail: string) => {
    setEmailState(newEmail);
    localStorage.setItem('pmc_email', newEmail);
    
    // Store in global array as requested
    const allEmails = JSON.parse(localStorage.getItem('pmc_all_emails') || '[]');
    if (!allEmails.includes(newEmail)) {
      allEmails.push(newEmail);
      localStorage.setItem('pmc_all_emails', JSON.stringify(allEmails));
    }
  };

  const setDonationStatus = (status: 'pending' | 'skipped' | 'donated') => {
    setDonationStatusState(status);
    localStorage.setItem('pmc_donation_status', status);
  };

  const setCertificateViewed = (viewed: boolean) => {
    setCertificateViewedState(viewed);
    localStorage.setItem('pmc_certificate_viewed', viewed ? 'true' : 'false');
  };

  const setRoutine = (newRoutine: string) => {
    setRoutineState(newRoutine);
    localStorage.setItem('pmc_routine', newRoutine);
  };

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting = { ...meeting, id: Date.now().toString() };
    const newMeetings = [...meetings, newMeeting];
    setMeetingsState(newMeetings);
    localStorage.setItem('pmc_meetings', JSON.stringify(newMeetings));
  };

  const removeMeeting = (id: string) => {
    const newMeetings = meetings.filter(m => m.id !== id);
    setMeetingsState(newMeetings);
    localStorage.setItem('pmc_meetings', JSON.stringify(newMeetings));
  };

  const updateMeeting = (id: string, updatedMeeting: Omit<Meeting, 'id'>) => {
    const newMeetings = meetings.map(m => m.id === id ? { ...updatedMeeting, id } : m);
    setMeetingsState(newMeetings);
    localStorage.setItem('pmc_meetings', JSON.stringify(newMeetings));
  };

  const refreshAiAnalysis = async (additionalContext?: string) => {
    if (profile) {
      try {
        const updatedProfile = await updateProfile(profile, routine, meetings, additionalContext);
        setProfile(updatedProfile);
      } catch (error) {
        console.error('Failed to refresh AI analysis:', error);
        throw error;
      }
    }
  };

  const setEnergyAlert = (alert: string | null) => {
    setEnergyAlertState(alert);
    if (alert) localStorage.setItem('pmc_energy_alert', alert);
    else localStorage.removeItem('pmc_energy_alert');
  };

  const refreshEnergyAlert = async () => {
    if (profile && meetings.length > 0) {
      try {
        const upcomingMeetings = meetings.filter(m => m.status !== 'completed');
        const alert = await analyzeEnergySync(routine, upcomingMeetings, profile);
        setEnergyAlert(alert);
      } catch (error) {
        console.error('Failed to refresh energy alert:', error);
      }
    }
  };

  const completeOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const clearData = () => {
    setProfile(null);
    setEmailState(null);
    setDonationStatusState('pending');
    setCertificateViewedState(false);
    setRoutineState('');
    setMeetingsState([]);
    setEnergyAlert(null);
    localStorage.removeItem('pmc_profile');
    localStorage.removeItem('pmc_email');
    localStorage.removeItem('pmc_donation_status');
    localStorage.removeItem('pmc_certificate_viewed');
    localStorage.removeItem('pmc_routine');
    localStorage.removeItem('pmc_meetings');
    localStorage.removeItem('pmc_energy_alert');
  };

  return (
    <UserContext.Provider value={{ 
      profile, setProfile, isOnboarded: !!profile, completeOnboarding, clearData, 
      theme, toggleTheme,
      email, setEmail,
      donationStatus, setDonationStatus,
      certificateViewed, setCertificateViewed,
      routine, setRoutine,
      meetings, addMeeting, removeMeeting, updateMeeting,
      refreshAiAnalysis,
      energyAlert, refreshEnergyAlert
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
