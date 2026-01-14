import { motion } from "framer-motion";
import { Shield, ArrowLeft, Linkedin, Mail, Code, Briefcase, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import founderImage from "@/assets/founder-nimish.jpg";

const Founder = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px]" />
        </div>

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
        <main className="container relative z-10 mx-auto px-4 pt-28 pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-12"
            >
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary/30 glow-primary">
                    <img
                      src={founderImage}
                      alt="Nimish Kalsi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                  >
                    Nimish <span className="text-gradient">Kalsi</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground mb-4"
                  >
                    Fintech Developer & Founder
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3 justify-center md:justify-start"
                  >
                    <a
                      href="https://www.linkedin.com/in/nimishkalsi/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="hero" size="sm" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        Connect on LinkedIn
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </div>

              {/* About Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  I'm passionate about building technology solutions that solve real problems 
                  in the financial services industry. RegWatch AI was born from the frustration 
                  of manually tracking regulatory changes across multiple bodies like RBI and SEBI.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                  With a background in fintech development, I understand the challenges engineering 
                  teams face when keeping up with ever-changing compliance requirements. 
                  RegWatch AI aims to automate this process, giving developers more time to 
                  build great products.
                </p>
              </motion.section>

              {/* Skills Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Code className="h-6 w-6 text-primary" />
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Supabase", "AI/ML", "Python", "PostgreSQL", "Tailwind CSS"].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* Mission Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Mission
                </h2>
                <div className="glass-card p-6 bg-primary/5 border-primary/20">
                  <p className="text-lg text-foreground/90 italic">
                    "To democratize regulatory intelligence for fintech startups, making 
                    compliance accessible and actionable through the power of AI."
                  </p>
                </div>
              </motion.section>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">Ready to streamline your compliance workflow?</p>
              <Link to="/dashboard">
                <Button variant="hero" size="lg">
                  Explore the Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 RegWatch AI. Built with ❤️ by Nimish Kalsi.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Founder;
