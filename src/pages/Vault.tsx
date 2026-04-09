import { motion } from 'motion/react';
import { Lock, FileText, Shield, Key } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/store/UserContext';
import { unlockVault } from '@/services/geminiService';

export default function Vault() {
  const { profile } = useUser();
  const [output, setOutput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const result = await unlockVault(profile);
      setOutput(result);
    } catch (e) {
      setOutput("Error unlocking vault.");
    }
    setIsUnlocking(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 pb-24 max-w-4xl mx-auto"
    >
      <header className="mb-12 mt-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-card border border-border-main mb-6 shadow-lg">
          <Shield className="text-accent" size={32} />
        </div>
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4">Data Vault</h1>
        <p className="text-text-muted text-lg max-w-xl mx-auto">
          Secure, encrypted storage for your behavioral data. AI continuously learns from every interaction to surface hidden strengths.
        </p>
      </header>

      <div className="bg-bg-card border border-border-main rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {!output ? (
          <div className="py-12">
            <Lock size={48} className="mx-auto text-text-muted mb-8 opacity-50" />
            <button 
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-full uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {isUnlocking ? 'Decrypting Data...' : <><Key size={16} /> Unlock Vault Insights</>}
            </button>
            <p className="mt-6 text-xs font-mono text-text-muted uppercase tracking-widest">Requires Biometric / Key Authentication</p>
          </div>
        ) : (
          <div className="text-left">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-main">
              <h2 className="text-2xl font-serif flex items-center gap-2"><FileText className="text-accent" /> Vault Decrypted</h2>
              <button onClick={() => setOutput('')} className="text-xs font-mono text-text-muted hover:text-accent uppercase tracking-widest">Close Vault</button>
            </div>
            <div className="text-text-main leading-relaxed whitespace-pre-wrap font-serif">
              {output}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
