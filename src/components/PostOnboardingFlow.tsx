import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/store/UserContext';
import { Mail, Heart, Upload, CheckCircle2, Award, ArrowRight, Copy, Download } from 'lucide-react';
import Logo from './Logo';
import html2canvas from 'html2canvas';

export default function PostOnboardingFlow() {
  const { 
    isOnboarded, email, setEmail, 
    donationStatus, setDonationStatus, 
    certificateViewed, setCertificateViewed 
  } = useUser();

  const [emailInput, setEmailInput] = useState('');
  const [refInput, setRefInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [screenshotName, setScreenshotName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // If not onboarded, or if everything is done, render nothing
  if (!isOnboarded) return null;
  if (email && donationStatus !== 'pending' && (donationStatus === 'skipped' || certificateViewed)) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && emailInput.includes('@')) {
      setEmail(emailInput.trim());
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('8800685335@pthdfc');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refInput.trim().length > 3) {
      setDonationStatus('donated');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotName(e.target.files[0].name);
    }
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0f172a', // Dark slate background
        logging: false,
        useCORS: true
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `PMC_Certificate_${email?.split('@')[0] || 'Supporter'}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Error downloading certificate:", err);
    }
    setIsDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: EMAIL COLLECTION (COMPULSORY) */}
        {!email && (
          <motion.div
            key="email-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-md bg-bg-card border border-border-main rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="text-accent" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-light text-center mb-2">Secure Your Profile</h2>
            <p className="text-text-muted text-center text-sm mb-8">
              Please enter your email address to activate your dashboard and securely store your personality profile.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!emailInput.includes('@')}
                className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue to Dashboard <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: DONATION PROMPT (OPTIONAL) */}
        {email && donationStatus === 'pending' && (
          <motion.div
            key="donation-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-lg bg-bg-card border border-border-main rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Heart className="text-pink-500" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-light text-center mb-2">Support PMC</h2>
            <p className="text-text-muted text-center text-sm mb-6">
              Running this AI application costs money. If you'd like to help keep PMC alive and ad-free, consider a small contribution of just ₹69 or more. It is completely optional!
            </p>

            <div className="bg-bg-input border border-border-main rounded-2xl p-5 mb-6">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Paytm UPI ID</div>
              <div className="flex items-center justify-between bg-bg-card border border-border-main rounded-lg p-3 mb-4">
                <span className="font-mono text-lg text-accent">8800685335@pthdfc</span>
                <button onClick={handleCopyUpi} className="text-text-muted hover:text-accent transition-colors p-2">
                  {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              <div className="text-sm text-center">
                Name: <strong className="text-text-main">Devanshu Deora</strong>
              </div>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">UPI Reference Number</label>
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="e.g. 312345678901"
                  className="w-full bg-bg-input border border-border-main rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Upload Screenshot (Optional)</label>
                <label className="w-full border-2 border-dashed border-border-main rounded-xl p-4 flex flex-col items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer bg-bg-input relative overflow-hidden">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                  {screenshotName ? (
                    <>
                      <CheckCircle2 size={24} className="mb-2 text-green-500" />
                      <span className="text-sm text-green-500 truncate max-w-[200px]">{screenshotName}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm">Click to upload screenshot</span>
                    </>
                  )}
                </label>
              </div>
              
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={refInput.length < 4}
                  className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I Have Donated
                </button>
                <button
                  type="button"
                  onClick={() => setDonationStatus('skipped')}
                  className="w-full bg-transparent border border-border-main text-text-main font-bold py-3 rounded-xl hover:bg-bg-card-hover transition-all"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: CERTIFICATE (IF DONATED) */}
        {email && donationStatus === 'donated' && !certificateViewed && (
          <motion.div
            key="certificate-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            {/* The Certificate Itself (Ref for downloading) */}
            <div 
              ref={certificateRef}
              className="w-full bg-[#0f172a] border-8 border-double border-[#cbd5e1] p-2 shadow-2xl relative overflow-hidden"
              style={{ padding: '8px' }}
            >
              <div className="border border-[#cbd5e1]/30 p-8 sm:p-12 text-center relative z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-[#020617]">
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-accent/50"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-accent/50"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-accent/50"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-accent/50"></div>

                <Logo className="w-24 h-24 mx-auto mb-8 text-white" textSize="text-3xl" />
                
                <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent-light text-sm font-mono uppercase tracking-widest mb-10 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  <Award size={16} /> Official Founding Supporter
                </div>

                <h2 className="text-4xl sm:text-5xl font-serif font-light text-white mb-4 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Certificate of Appreciation</h2>
                <p className="text-[#94a3b8] text-lg italic mb-10" style={{ fontFamily: 'Georgia, serif' }}>This certificate is proudly presented to</p>
                
                <div className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-light via-white to-accent-light mb-10 pb-4 border-b border-[#334155] inline-block px-12">
                  {email}
                </div>

                <p className="text-base sm:text-lg text-[#cbd5e1] max-w-xl mx-auto leading-relaxed mb-16" style={{ fontFamily: 'Georgia, serif' }}>
                  For your generous contribution and belief in the vision of the Personality Management Co. Your support empowers the future of hyper-personalized AI preparation.
                </p>

                <div className="flex justify-between items-end px-8 mt-8">
                  <div className="text-left">
                    <div className="w-32 border-b border-[#cbd5e1] mb-2"></div>
                    <p className="text-xs text-[#94a3b8] font-mono uppercase tracking-widest">Date</p>
                    <p className="text-sm text-white font-serif">{new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="w-40 border-b border-[#cbd5e1] mb-2 text-center">
                      <span className="font-serif italic text-xl text-white">Devanshu Deora</span>
                    </div>
                    <p className="text-xs text-[#94a3b8] font-mono uppercase tracking-widest">Founder, Deora&Co.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions (Not part of the downloaded image) */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
              <button
                onClick={downloadCertificate}
                disabled={isDownloading}
                className="bg-bg-card border border-border-main text-text-main font-bold py-3 px-8 rounded-full hover:bg-bg-card-hover transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isDownloading ? 'Generating...' : <><Download size={18} /> Download Certificate</>}
              </button>
              <button
                onClick={() => setCertificateViewed(true)}
                className="bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent-light transition-all shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
              >
                Enter Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
