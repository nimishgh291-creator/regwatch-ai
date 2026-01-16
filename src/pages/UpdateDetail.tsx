import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, Info, Send, Loader2, Bot, TrendingUp, Download, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DevImpactGauge from "@/components/DevImpactGauge";
import { toast } from "@/hooks/use-toast";
import { exportToPDF } from "@/utils/pdfExport";
import PageTransition from "@/components/PageTransition";

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

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MarketImpactResult {
  analysis: string;
  sources: { title: string; url: string }[];
  tavilyAnswer: string | null;
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

const UpdateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [update, setUpdate] = useState<RegulatoryUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketImpact, setMarketImpact] = useState<MarketImpactResult | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUpdate = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("regulatory_updates")
          .select("*")
          .eq("id", parseInt(id))
          .single();

        if (error) throw error;
        setUpdate(data);
      } catch (error) {
        console.error("Error fetching update:", error);
        toast({
          title: "Error",
          description: "Failed to load regulatory update.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdate();
  }, [id, navigate]);

  useEffect(() => {
    if (isLoading) {
      setElapsedTime(0);
      setFinalTime(null);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (elapsedTime > 0) {
        setFinalTime(elapsedTime);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExportPDF = () => {
    if (!update) return;
    exportToPDF(update, marketImpact);
    toast({ title: "PDF exported!", description: "Your report has been downloaded." });
  };

  const handleAnalyzeMarketImpact = async () => {
    if (!update || isAnalyzing) return;

    setIsAnalyzing(true);
    setMarketImpact(null);

    try {
      const response = await fetch(
        `https://ybswkkhufynqjfdxkbtm.supabase.co/functions/v1/analyze-market-impact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlic3dra2h1ZnlucWpmZHhrYnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzU0MzYsImV4cCI6MjA4MzcxMTQzNn0.XRUXFUdb_Pi3T3DZPZglF6rENjJYbZvgA7sUpNmnyG8`,
          },
          body: JSON.stringify({
            title: update.title,
            summary: update.summary,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({ title: "Rate limit exceeded", description: "Please try again later.", variant: "destructive" });
          return;
        }
        if (response.status === 402) {
          toast({ title: "Credits required", description: "Please add credits to continue using AI features.", variant: "destructive" });
          return;
        }
        throw new Error("Failed to analyze market impact");
      }

      const data = await response.json();
      setMarketImpact(data);
    } catch (error) {
      console.error("Market impact analysis error:", error);
      toast({ title: "Analysis failed", description: "Unable to analyze market impact.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !update || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://ybswkkhufynqjfdxkbtm.supabase.co/functions/v1/chat-regulatory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlic3dra2h1ZnlucWpmZHhrYnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzU0MzYsImV4cCI6MjA4MzcxMTQzNn0.XRUXFUdb_Pi3T3DZPZglF6rENjJYbZvgA7sUpNmnyG8`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
            context: {
              title: update.title,
              summary: update.summary,
              detailed_analysis: update.detailed_analysis,
              dev_action: update.dev_action,
              risk_level: update.risk_level,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Please add credits to continue using AI features.");
        }
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (!update) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Update not found.</p>
        </div>
      </PageTransition>
    );
  }

  const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
  const risk = riskConfig[riskLevel] || riskConfig.low;
  const RiskIcon = risk.icon;

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
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${risk.className}`}>
                  <RiskIcon className="h-3 w-3" />
                  {risk.label}
                </span>
                {update.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                    {update.category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{update.title}</h1>
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                {update.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Summary</h3>
                    <p className="text-foreground leading-relaxed">{update.summary}</p>
                  </motion.div>
                )}

                {/* Detailed Analysis */}
                {update.detailed_analysis && update.detailed_analysis.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Detailed Analysis</h3>
                    <ul className="space-y-3">
                      {update.detailed_analysis.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span className="text-foreground/90 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Dev Action */}
                {update.dev_action && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
                  >
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Dev Action Required</h3>
                    <p className="text-foreground">{update.dev_action}</p>
                  </motion.div>
                )}

                {/* Market Impact Results */}
                {marketImpact && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/30"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-primary">
                        <TrendingUp className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Market Impact Analysis</h3>
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed mb-4">{marketImpact.analysis}</p>

                    {marketImpact.sources.length > 0 && (
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">News Sources</h4>
                        <div className="space-y-2">
                          {marketImpact.sources.slice(0, 3).map((source, index) => (
                            <a
                              key={index}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-1">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* AI Chat Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Chat with AI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask questions about this regulatory update and get instant AI-powered answers.
                  </p>

                  {/* Chat Messages */}
                  <div className="h-72 overflow-y-auto rounded-2xl bg-muted/30 border border-white/10 p-4 mb-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Ask a question to get started...
                      </div>
                    )}
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                              : "bg-white/10 border border-secondary/30 text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white/10 border border-secondary/30 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            <span>Analyzing in {elapsedTime.toFixed(1)}s...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {finalTime && !isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
                      <div className="text-xs text-muted-foreground text-center">
                        Answered in {finalTime.toFixed(1)}s
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask about this update..."
                      className="flex-1 bg-muted/50 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                    <Button
                      variant="hero"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="h-12 w-12"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Actions & Impact */}
              <div className="space-y-6">
                {/* Dev Impact Gauge */}
                {update.dev_impact_score && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                  >
                    <DevImpactGauge score={update.dev_impact_score} />
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 space-y-3"
                >
                  {update.source_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(update.source_url!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Original
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    variant="hero"
                    className="w-full justify-start"
                    onClick={handleAnalyzeMarketImpact}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                    {isAnalyzing ? "Analyzing..." : "Market Impact"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2026 RegWatch AI. Built by Nimish Kalsi.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default UpdateDetail;
