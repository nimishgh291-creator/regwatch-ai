import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ArrowUpRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UpdateDetailModal from "./UpdateDetailModal";

interface RegulatoryUpdate {
  id: number;
  title: string;
  summary: string | null;
  risk_level: string | null;
  dev_action: string | null;
  source_url: string | null;
  detailed_analysis: string[] | null;
  dev_impact_score: number | null;
  category: string | null;
}

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
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("regulatory_updates")
        .select("*")
        .order("id", { ascending: false })
        .limit(6);

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (update: RegulatoryUpdate) => {
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUpdate(null), 300);
  };

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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && updates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No regulatory updates available yet.</p>
          </div>
        )}

        {/* Bento Grid */}
        {!loading && updates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update, index) => {
              const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
              const risk = riskConfig[riskLevel] || riskConfig.low;
              const RiskIcon = risk.icon;

              return (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => handleCardClick(update)}
                  className="glass-card p-6 cursor-pointer group relative overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${risk.className}`}>
                        <RiskIcon className="h-3 w-3" />
                        {risk.label}
                      </span>
                      {update.category && (
                        <span className="text-xs text-muted-foreground">{update.category}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {update.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {update.summary || "No summary available"}
                    </p>

                    {/* Dev Action Box */}
                    {update.dev_action && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
                        <span className="text-xs text-primary font-medium uppercase tracking-wider">Dev Action Required</span>
                        <p className="text-sm text-foreground mt-1">{update.dev_action}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Click to view details</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <UpdateDetailModal
        update={selectedUpdate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default RegulatoryUpdates;
