import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, User, Calendar, Cpu, Clock, BarChart2, Database, Settings, Sun, Moon, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/store/UserContext';
import Logo from './Logo';
import PostOnboardingFlow from './PostOnboardingFlow';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/meetings', icon: Calendar, label: 'Meetings' },
  { path: '/ai-features', icon: Cpu, label: 'AI' },
  { path: '/routine', icon: Clock, label: 'Routine' },
  { path: '/insights', icon: BarChart2, label: 'Insights' },
  { path: '/vault', icon: Database, label: 'Vault' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/policies', icon: Shield, label: 'Policies' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useUser();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-bg-main text-text-main transition-colors duration-300">
      <PostOnboardingFlow />
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 bg-bg-card border-r border-border-main p-4 z-40">
        <div className="mb-8 px-4 mt-4">
          <Logo className="w-12 h-12 mb-4" textSize="text-xl" />
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest leading-relaxed">
            PMC exists to understand your unique personality and routine so you feel completely comfortable, confident, and unstoppable.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-accent/10 text-accent font-bold" 
                    : "text-text-muted hover:bg-bg-card-hover hover:text-text-main"
                )}
              >
                <Icon size={20} className={cn("transition-all duration-300", isActive && "scale-110")} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto pt-4 border-t border-border-main">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg-card-hover hover:text-text-main transition-all">
            {theme === 'dark' ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-accent-dark" />}
            <span className="text-sm font-medium tracking-wider">Toggle Theme</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden w-full bg-bg-card backdrop-blur-md border-b border-border-main p-3 flex items-center justify-between z-50">
          <Logo className="w-8 h-8" textSize="text-sm" />
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-bg-card-hover transition-colors">
            {theme === 'dark' ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-accent-dark" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto relative flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="w-full py-6 text-center border-t border-border-main mt-auto bg-bg-main flex flex-col items-center gap-2">
            <div className="flex gap-4 text-xs font-mono tracking-widest uppercase text-text-muted">
              <Link to="/policies" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/policies" className="hover:text-accent transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-text-muted font-mono tracking-widest uppercase">
              &copy; {new Date().getFullYear()} All rights reserved by Deora&Co.
            </p>
          </footer>
        </div>

        {/* Bottom Navigation (Mobile First) */}
        <div className="md:hidden w-full bg-bg-main/90 backdrop-blur-xl border-t border-border-main pb-safe transition-colors duration-300">
          <div className="flex overflow-x-auto hide-scrollbar px-2 py-3 gap-2 sm:justify-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[64px] p-2 rounded-xl transition-all duration-500",
                    isActive ? "bg-bg-card text-accent" : "text-text-muted hover:text-text-main"
                  )}
                >
                  <Icon size={20} className={cn("mb-1 transition-all duration-500", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
