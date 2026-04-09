import { motion } from 'motion/react';

export default function PlaceholderPage({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center"
    >
      <h1 className="text-4xl font-light tracking-tight mb-4">
        {title}
      </h1>
      <p className="text-text-muted max-w-md mx-auto mb-8">
        {desc}
      </p>
      <div className="w-full max-w-lg h-64 bg-bg-card border border-border-main rounded-3xl flex items-center justify-center">
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Module Initializing...</span>
      </div>
    </motion.div>
  );
}
