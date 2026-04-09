import { motion } from 'motion/react';
import { Settings as SettingsIcon, User, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { useUser } from '@/store/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { email, donationStatus, theme, toggleTheme } = useUser();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-4xl mx-auto"
    >
      <header className="mb-12 mt-4">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4">Settings</h1>
        <p className="text-text-muted text-lg">Manage your account, preferences, and data.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-bg-card border border-border-main rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><User className="text-accent" /> Account Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Email Address</label>
              <div className="text-text-main font-medium">{email || 'Not provided'}</div>
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Donation Status</label>
              <div className="text-text-main font-medium">
                {donationStatus === 'donated' ? (
                  <span className="text-green-500 flex items-center gap-1">Active Supporter</span>
                ) : (
                  <span className="text-text-muted">Not donated</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><SettingsIcon className="text-accent" /> Preferences</h2>
          <div className="flex items-center justify-between py-4 border-b border-border-main">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-text-muted">Toggle between Dark Blue and Clean Light modes</div>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 bg-bg-input border border-border-main rounded-lg text-sm font-medium hover:bg-bg-card-hover transition-colors"
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Voice Mode</div>
              <div className="text-sm text-text-muted">Enable text-to-speech in Meeting Simulator</div>
            </div>
            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-border-main rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-serif mb-6 flex items-center gap-2"><Shield className="text-accent" /> Data & Privacy</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-bg-input border border-border-main rounded-xl hover:bg-bg-card-hover transition-colors">
              <div className="flex items-center gap-3">
                <Download size={18} className="text-text-muted" />
                <span className="font-medium">Export My Data</span>
              </div>
            </button>
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-red-500"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} />
                <span className="font-medium">Delete Profile & Data</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
