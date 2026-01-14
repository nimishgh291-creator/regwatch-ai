import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const Terms = () => {
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
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using RegWatch AI, you accept and agree to be bound by the terms 
                  and provisions of this agreement. If you do not agree to these terms, please do not 
                  use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RegWatch AI provides AI-powered regulatory intelligence and compliance tracking 
                  for fintech companies. Our service aggregates, analyzes, and summarizes regulatory 
                  updates from RBI, SEBI, and other financial regulatory bodies in India.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> The information provided by RegWatch AI is for 
                  informational purposes only and does not constitute legal or financial advice. 
                  While we strive for accuracy, you should verify all regulatory information 
                  with official sources before making compliance decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. AI-Generated Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI analysis and chat features use machine learning models to interpret 
                  regulatory information. These AI-generated insights may contain errors or 
                  inaccuracies. Users should exercise their own judgment and consult with 
                  qualified professionals for critical compliance decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. User Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  As a user of RegWatch AI, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide accurate email information if subscribing to updates</li>
                  <li>Not use the service for any unlawful purpose</li>
                  <li>Not attempt to reverse engineer or exploit the service</li>
                  <li>Verify critical regulatory information with official sources</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The RegWatch AI platform, including its design, functionality, and AI models, 
                  is the intellectual property of its creators. Regulatory content sourced from 
                  official bodies remains the property of those respective organizations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RegWatch AI and its creators shall not be liable for any direct, indirect, 
                  incidental, special, or consequential damages resulting from the use or 
                  inability to use the service, including but not limited to damages for loss 
                  of profits, data, or business opportunities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Modifications to Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue the service at any 
                  time without prior notice. We may also update these terms from time to time, 
                  and continued use of the service constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms shall be governed by and construed in accordance with the laws 
                  of India. Any disputes arising from these terms shall be subject to the 
                  exclusive jurisdiction of the courts in India.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For any questions regarding these terms, please contact us through the 
                  founder's LinkedIn profile or raise an issue on our platform.
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

export default Terms;
