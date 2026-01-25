import { motion } from "framer-motion";
import { Shield, ArrowLeft, Linkedin, Code, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";
import founderImage from "@/assets/founder-nimish.jpg";

const Founder = () => {
  const skills = ["React", "TypeScript", "Node.js", "Supabase", "AI/ML", "Python", "PostgreSQL", "Tailwind CSS"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">RegWatch</span>
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img
                      src={founderImage}
                      alt="Nimish Kalsi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </motion.div>

              {/* Name & Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-3"
              >
                Nimish{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 px-3 py-1 bg-primary text-primary-foreground rounded-lg">
                    Kalsi
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl text-muted-foreground mb-6"
              >
                Fintech Developer & Founder
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <a
                  href="https://www.linkedin.com/in/nimishkalsi/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Connect on LinkedIn
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-12">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">About</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm passionate about building technology solutions that solve real problems 
                  in the financial services industry. RegWatch AI was born from the frustration 
                  of manually tracking regulatory changes across multiple bodies like RBI and SEBI.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With a background in fintech development, I understand the challenges engineering 
                  teams face when keeping up with ever-changing compliance requirements. 
                  RegWatch AI aims to automate this process, giving developers more time to 
                  build great products.
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Tech Stack</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Mission</h2>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-foreground italic leading-relaxed">
                    "To democratize regulatory intelligence for fintech startups, making 
                    compliance accessible and actionable through the power of AI."
                  </p>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground mb-4">Ready to streamline your compliance workflow?</p>
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Explore the Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 RegWatch AI. Built with ❤️ by Nimish Kalsi.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Founder;
