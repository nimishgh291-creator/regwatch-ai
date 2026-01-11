import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ArrowUpRight } from "lucide-react";

interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  riskLevel: "high" | "medium" | "low";
  devAction: string;
  date: string;
  source: string;
}

const mockUpdates: RegulatoryUpdate[] = [
  {
    id: "1",
    title: "RBI Digital Lending Guidelines Update",
    summary: "New requirements for digital lending platforms regarding customer data handling and transparency in loan disbursement processes.",
    riskLevel: "high",
    devAction: "Update consent flows and data retention policies",
    date: "2024-01-15",
    source: "RBI",
  },
  {
    id: "2",
    title: "SEBI AI Trading Algorithm Disclosure",
    summary: "Mandatory disclosure requirements for AI-based trading algorithms used by registered market participants.",
    riskLevel: "medium",
    devAction: "Implement algorithm audit trails",
    date: "2024-01-12",
    source: "SEBI",
  },
  {
    id: "3",
    title: "KYC Verification Process Amendment",
    summary: "Updated guidelines for video KYC verification with enhanced security measures for remote onboarding.",
    riskLevel: "low",
    devAction: "Update video KYC SDK integration",
    date: "2024-01-10",
    source: "RBI",
  },
  {
    id: "4",
    title: "Payment Aggregator Compliance Framework",
    summary: "New escrow requirements and settlement timelines for payment aggregators operating in India.",
    riskLevel: "high",
    devAction: "Modify payment settlement logic",
    date: "2024-01-08",
    source: "RBI",
  },
  {
    id: "5",
    title: "Cybersecurity Incident Reporting",
    summary: "Mandatory 6-hour reporting window for cybersecurity incidents affecting customer data.",
    riskLevel: "medium",
    devAction: "Implement incident detection webhooks",
    date: "2024-01-05",
    source: "SEBI",
  },
  {
    id: "6",
    title: "Cross-border Payment Guidelines",
    summary: "Revised limits and documentation requirements for cross-border remittances through digital channels.",
    riskLevel: "low",
    devAction: "Update transaction limit validation",
    date: "2024-01-03",
    source: "RBI",
  },
];

const riskConfig = {
  high: {
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "High Risk",
  },
  medium: {
    icon: Info,
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    label: "Medium Risk",
  },
  low: {
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    label: "Low Risk",
  },
};

const RegulatoryUpdates = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="text-gradient">Regulatory Updates</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay compliant with real-time tracking of RBI and SEBI regulations affecting your fintech operations.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUpdates.map((update, index) => {
            const risk = riskConfig[update.riskLevel];
            const RiskIcon = risk.icon;

            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${risk.className}`}>
                    <RiskIcon className="h-3 w-3" />
                    {risk.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{update.source}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {update.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {update.summary}
                </p>

                {/* Dev Action Box */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">Dev Action Required</span>
                  <p className="text-sm text-foreground mt-1">{update.devAction}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RegulatoryUpdates;
