import { motion } from 'motion/react';
import { Shield, FileText, Lock, AlertTriangle, Mail } from 'lucide-react';

export default function Policies() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-24 max-w-4xl mx-auto"
    >
      <header className="mb-12 mt-4">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4 flex items-center gap-3">
          <Shield className="text-accent" size={36} />
          Legal & Policies
        </h1>
        <p className="text-text-muted text-lg">
          Transparency, privacy, and security are at the core of Personality Management Co. (PMC).
        </p>
      </header>

      <div className="space-y-8">
        {/* Privacy Policy */}
        <section id="privacy" className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
            <Lock className="text-accent" size={24} />
            <h2 className="text-2xl font-serif">Privacy Policy</h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p><strong>1. Data Collection:</strong> We collect information you provide directly to us, such as your email address, daily routines, meeting schedules, and personality traits entered during onboarding.</p>
            <p><strong>2. Use of Data:</strong> Your data is used exclusively to provide and improve the PMC service. We use AI models (like Gemini) to analyze your routine and meetings to generate personalized insights.</p>
            <p><strong>3. Data Storage:</strong> Currently, your profile data, routines, and meetings are stored locally on your device (localStorage). We do not sell or rent your personal information to third parties.</p>
            <p><strong>4. Security:</strong> We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms" className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
            <FileText className="text-accent-light" size={24} />
            <h2 className="text-2xl font-serif">Terms of Service</h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p><strong>1. Acceptance of Terms:</strong> By accessing or using PMC, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
            <p><strong>2. User Responsibilities:</strong> You are responsible for safeguarding the password or credentials that you use to access the service and for any activities or actions under your password.</p>
            <p><strong>3. Intellectual Property:</strong> The service and its original content, features, and functionality are and will remain the exclusive property of Deora&Co. and its licensors.</p>
            <p><strong>4. Termination:</strong> We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </div>
        </section>

        {/* Disclaimer */}
        <section id="disclaimer" className="bg-bg-card border border-border-main rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
            <AlertTriangle className="text-orange-500" size={24} />
            <h2 className="text-2xl font-serif">AI & Usage Disclaimer</h2>
          </div>
          <div className="space-y-4 text-text-muted leading-relaxed text-sm">
            <p><strong>1. AI-Generated Content:</strong> PMC utilizes artificial intelligence to generate insights, prep cards, and routine optimizations. While we strive for accuracy, AI-generated content may occasionally be inaccurate or incomplete. You should verify critical information independently.</p>
            <p><strong>2. Not Professional Advice:</strong> The insights provided by PMC are for informational and self-improvement purposes only. They do not constitute professional psychological, medical, or legal advice.</p>
            <p><strong>3. "As Is" Service:</strong> The service is provided on an "AS IS" and "AS AVAILABLE" basis. Deora&Co. makes no representations or warranties of any kind, express or implied, regarding the use or the results of this web application.</p>
          </div>
        </section>

        {/* Contact Info */}
        <section id="contact" className="bg-gradient-to-br from-bg-card to-bg-main border border-accent/30 rounded-3xl p-8 shadow-lg text-center">
          <Mail className="text-accent mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-serif mb-4">Need Help or Have Questions?</h2>
          <p className="text-text-muted mb-6">
            If you have any questions about these policies, your data, or need support with the application, please don't hesitate to reach out.
          </p>
          <a 
            href="mailto:devanshudeora0226@gmail.com" 
            className="inline-flex items-center gap-2 bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-accent-light transition-all shadow-lg hover:shadow-accent/25"
          >
            devanshudeora0226@gmail.com
          </a>
        </section>
      </div>
    </motion.div>
  );
}
