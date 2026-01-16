import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, Radar, Brain, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubscribeWidget from "@/components/SubscribeWidget";
import dashboardMockup from "@/assets/dashboard-mockup.png";

const Landing = () => {
  const howItWorks = [
    {
      icon: Radar,
      title: "Scan",
      description: "Our AI continuously monitors RBI, SEBI, and other regulatory bodies for new guidelines and circulars.",
      step: "01",
    },
    {
      icon: Brain,
      title: "Analyze",
      description: "Machine learning algorithms extract key impacts, assess risk levels, and identify required developer actions.",
      step: "02",
    },
    {
      icon: Bell,
      title: "Alert",
      description: "Receive instant notifications with actionable insights tailored for your engineering team.",
      step: "03",
    },
  ];

  const features = [
    "Real-time RBI & SEBI monitoring",
    "AI-powered risk assessment",
    "Developer-focused action items",
    "Email alerts for critical updates",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="glass-card px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">RegWatch</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/founder" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                About Founder
              </Link>
              <Link to="/dashboard">
                <Button variant="hero" size="sm" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-glow opacity-60" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-muted-foreground">Now tracking RBI & SEBI regulations</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className="text-gradient">RegWatch AI</span>
                <br />
                <span className="text-foreground/90">Real-time RBI Compliance</span>
                <br />
                <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl">for Fintechs</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0"
              >
                Stop manually tracking regulatory changes. Get AI-powered insights for your engineering team in real-time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </motion.div>

              {/* Features list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {feature}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right content - Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                <div className="relative glass-card p-2 glow-secondary">
                  <img
                    src={dashboardMockup}
                    alt="RegWatch Dashboard"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to stay compliant without the manual overhead.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-300">
                  <div className="relative inline-flex mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform">
                      <item.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay <span className="text-gradient">Updated</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Get regulatory alerts delivered to your inbox. No account needed.
            </p>
            <SubscribeWidget />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">RegWatch AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 RegWatch AI. Built by Nimish Kalsi.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="/founder" className="text-muted-foreground hover:text-foreground transition-colors">
                Founder
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
