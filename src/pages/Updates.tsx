import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, ArrowUpRight, Loader2, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UpdateDetailModal from "@/components/UpdateDetailModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const Updates = () => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("regulatory_updates")
        .select("*")
        .order("id", { ascending: false });

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

  const filteredUpdates = updates.filter((update) => {
    const matchesSearch = 
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = !selectedRisk || update.risk_level === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Regulatory <span className="text-gradient">Updates</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse all RBI and SEBI regulatory updates affecting fintech operations in India.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-white/10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedRisk === null ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRisk(null)}
                >
                  All
                </Button>
                <Button
                  variant={selectedRisk === "high" ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRisk(selectedRisk === "high" ? null : "high")}
                  className={selectedRisk !== "high" ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : ""}
                >
                  High Risk
                </Button>
                <Button
                  variant={selectedRisk === "medium" ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRisk(selectedRisk === "medium" ? null : "medium")}
                  className={selectedRisk !== "medium" ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10" : ""}
                >
                  Medium
                </Button>
                <Button
                  variant={selectedRisk === "low" ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRisk(selectedRisk === "low" ? null : "low")}
                  className={selectedRisk !== "low" ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : ""}
                >
                  Low
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredUpdates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No regulatory updates found.</p>
            </div>
          )}

          {/* Updates Grid */}
          {!loading && filteredUpdates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpdates.map((update, index) => {
                const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
                const risk = riskConfig[riskLevel] || riskConfig.low;
                const RiskIcon = risk.icon;

                return (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => handleCardClick(update)}
                    className="glass-card p-6 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${risk.className}`}>
                          <RiskIcon className="h-3 w-3" />
                          {risk.label}
                        </span>
                        {update.category && (
                          <span className="text-xs text-muted-foreground">{update.category}</span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {update.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {update.summary || "No summary available"}
                      </p>

                      {update.dev_action && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
                          <span className="text-xs text-primary font-medium uppercase tracking-wider">Dev Action Required</span>
                          <p className="text-sm text-foreground mt-1 line-clamp-2">{update.dev_action}</p>
                        </div>
                      )}

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
      </main>

      <Footer />

      <UpdateDetailModal
        update={selectedUpdate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Updates;