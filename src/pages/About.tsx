import { motion } from "framer-motion";
import { Shield, Users, Target, Award, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { value: "500+", label: "Fintech Companies" },
    { value: "10K+", label: "Regulations Tracked" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "AI Support" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the security of your compliance data with enterprise-grade encryption and SOC 2 compliance.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our platform is built around the needs of fintech developers and compliance teams.",
    },
    {
      icon: Target,
      title: "Precision",
      description: "We deliver accurate, actionable regulatory insights powered by advanced AI analysis.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our product to our customer support.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">RegWatch</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              We're on a mission to simplify regulatory compliance for fintech companies in India. 
              Our AI-powered platform helps development teams stay ahead of RBI and SEBI regulations, 
              turning complex legal requirements into actionable technical guidance.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-8 mb-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="glass-card p-8 md:p-12">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  RegWatch was founded by a team of fintech veterans and compliance experts who experienced firsthand 
                  the challenges of keeping up with India's rapidly evolving regulatory landscape. We saw development 
                  teams struggling to interpret RBI circulars and SEBI guidelines, often learning about critical 
                  compliance requirements too late.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Our solution combines advanced AI with deep domain expertise to monitor, analyze, and translate 
                  regulatory updates into developer-friendly insights. We don't just tell you what changed – we tell 
                  you exactly what you need to do about it.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, RegWatch serves hundreds of fintech companies across India, from early-stage startups to 
                  established financial institutions, helping them build compliant products faster and with confidence.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <div className="glass-card p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to simplify compliance?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join hundreds of fintech companies using RegWatch to stay ahead of regulations.
              </p>
              <Link to="/updates">
                <Button variant="hero" size="lg">
                  View Updates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;