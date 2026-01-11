import { motion } from "framer-motion";
import { Brain, Bell, Plug, Zap, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Compliance",
    description: "Leverage advanced AI to automatically analyze and interpret complex regulatory documents, extracting actionable insights for your team.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Instant notifications when new regulations are published or existing ones are updated, ensuring you never miss critical compliance deadlines.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description: "Connect with your existing workflow tools including Slack, Jira, and GitHub to streamline compliance tracking across your organization.",
    gradient: "from-primary to-glow-secondary",
  },
  {
    icon: Zap,
    title: "Developer Actions",
    description: "Get specific, actionable developer tasks automatically generated from regulatory changes, with priority scoring and deadline tracking.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Automated risk scoring for each regulatory update helps you prioritize what matters most for your fintech compliance strategy.",
    gradient: "from-accent to-primary",
  },
  {
    icon: BarChart3,
    title: "Compliance Analytics",
    description: "Track your compliance progress over time with detailed analytics, audit trails, and executive-ready reporting dashboards.",
    gradient: "from-primary to-accent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Regulatory Compliance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay ahead of RBI and SEBI regulations with our comprehensive suite of AI-powered compliance tools.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative glass-card p-8 h-full overflow-hidden">
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-3xl border border-primary/50" />
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Corner accent */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
