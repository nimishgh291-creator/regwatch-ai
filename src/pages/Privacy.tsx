import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const Privacy = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="glass-card px-6 py-3 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">RegWatch</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RegWatch AI collects minimal information to provide our regulatory intelligence service. 
                  We collect email addresses only when you voluntarily subscribe to our updates. 
                  We do not require account creation to browse the dashboard or use the AI chat feature.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The information we collect is used to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Send regulatory update alerts to subscribed email addresses</li>
                  <li>Improve our AI analysis and service quality</li>
                  <li>Communicate important service updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is stored securely using Supabase, a secure cloud database platform. 
                  We implement industry-standard security measures including encryption in transit 
                  and at rest to protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use the following third-party services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
                  <li><strong>Supabase:</strong> Database and authentication infrastructure</li>
                  <li><strong>Resend:</strong> Email delivery service for notifications</li>
                  <li><strong>Google Gemini:</strong> AI-powered regulatory analysis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
                  <li>Unsubscribe from email notifications at any time</li>
                  <li>Request deletion of your email address from our database</li>
                  <li>Access information about what data we hold about you</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use minimal essential cookies for basic functionality. 
                  We do not use tracking cookies or third-party advertising cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any privacy-related questions or concerns, please contact us through 
                  the founder's LinkedIn profile or raise an issue on our platform.
                </p>
              </section>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 RegWatch AI. Built by Nimish Kalsi.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Privacy;
