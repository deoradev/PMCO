import { motion } from 'motion/react';

export default function Logo({ 
  className = "w-24 h-24", 
  textSize = "text-3xl", 
  showText = true,
  stacked = false
}: { 
  className?: string, 
  textSize?: string, 
  showText?: boolean,
  stacked?: boolean
}) {
  // Extract width/height from className to apply to the icon container
  const sizeClasses = className.split(' ').filter(c => c.startsWith('w-') || c.startsWith('h-')).join(' ');
  const otherClasses = className.split(' ').filter(c => !c.startsWith('w-') && !c.startsWith('h-')).join(' ');

  return (
    <div className={`flex ${stacked ? 'flex-col' : 'flex-row'} items-center gap-4 ${otherClasses}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses || 'w-12 h-12'}`}>
        <motion.svg 
          viewBox="0 0 100 100" 
          className="w-full h-full overflow-visible"
          style={{ filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.5))' }}
        >
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent-dark)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent-dark)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Ambient Background Glow */}
          <circle cx="50" cy="50" r="45" fill="url(#coreGlow)" />

          {/* Outer Data Ring (The Environment/Schedule) */}
          <motion.circle
            cx="50" cy="50" r="42"
            fill="none" stroke="var(--accent-dark)" strokeWidth="0.5" strokeDasharray="2 6"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Orbiting Rings (Time & Routine) */}
          <motion.ellipse
            cx="50" cy="50" rx="38" ry="14"
            fill="none" stroke="url(#ringGrad1)" strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />
          <motion.ellipse
            cx="50" cy="50" rx="14" ry="38"
            fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Neural Connections (AI analyzing the core) */}
          <motion.g
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M50 50 L28 28 M50 50 L72 72 M50 50 L28 72 M50 50 L72 28" stroke="var(--accent-light)" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="28" cy="28" r="2.5" fill="var(--accent)" />
            <circle cx="72" cy="72" r="2.5" fill="var(--accent)" />
            <circle cx="28" cy="72" r="2.5" fill="var(--accent)" />
            <circle cx="72" cy="28" r="2.5" fill="var(--accent)" />
          </motion.g>

          {/* The Core (The User's Personality) */}
          <motion.circle
            cx="50" cy="50" r="5"
            fill="#ffffff"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 6px #ffffff)" }}
          />
          <motion.circle
            cx="50" cy="50" r="10"
            fill="none" stroke="var(--accent-light)" strokeWidth="1"
            animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
      
      {showText && (
        <div className={`flex flex-col ${stacked ? 'items-center' : 'items-start'}`}>
          <span className={`font-serif font-light tracking-[0.25em] text-text-main ${textSize}`}>
            PMC
          </span>
          {stacked && (
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest mt-2 opacity-80">
              Neural Sync Active
            </span>
          )}
        </div>
      )}
    </div>
  );
}
