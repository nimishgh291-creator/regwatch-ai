import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, AlertTriangle, CheckCircle, Info, Send, Loader2, Bot, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DevImpactGauge from "./DevImpactGauge";
import { toast } from "@/hooks/use-toast";

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

interface UpdateDetailModalProps {
  update: RegulatoryUpdate | null;
  isOpen: boolean;
  onClose: () => void;
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

const UpdateDetailModal = ({ update, isOpen, onClose }: UpdateDetailModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketImpact, setMarketImpact] = useState<MarketImpactResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputValue("");
      setMarketImpact(null);
    }
  }, [isOpen]);

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
          toast({
            title: "Rate limit exceeded",
            description: "Please try again later.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Credits required",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to analyze market impact");
      }

      const data = await response.json();
      setMarketImpact(data);
    } catch (error) {
      console.error("Market impact analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unable to analyze market impact.",
        variant: "destructive",
      });
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
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Please add credits to continue using AI features.");
        }
        throw new Error("Failed to get response");
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
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
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
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!update) return null;

  const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
  const risk = riskConfig[riskLevel] || riskConfig.low;
  const RiskIcon = risk.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl overflow-hidden"
          >
            {/* Glassmorphism container */}
            <div className="h-full flex flex-col bg-card/90 backdrop-blur-2xl border-l border-white/10 relative">
              {/* Purple glow effects */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />

              {/* Header */}
              <div className="relative z-10 p-6 border-b border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${risk.className}`}
                      >
                        <RiskIcon className="h-3 w-3" />
                        {risk.label}
                      </span>
                      {update.category && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                          {update.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{update.title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
                {/* Summary */}
                {update.summary && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Summary
                    </h3>
                    <p className="text-foreground leading-relaxed">{update.summary}</p>
                  </div>
                )}

                {/* Detailed Analysis */}
                {update.detailed_analysis && update.detailed_analysis.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Detailed Analysis
                    </h3>
                    <ul className="space-y-2">
                      {update.detailed_analysis.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                          <span className="text-foreground/90 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dev Action */}
                {update.dev_action && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                      Dev Action Required
                    </h3>
                    <p className="text-foreground">{update.dev_action}</p>
                  </div>
                )}

                {/* Dev Impact Gauge */}
                {update.dev_impact_score && (
                  <div className="p-4 rounded-2xl bg-muted/50 border border-white/10">
                    <DevImpactGauge score={update.dev_impact_score} />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {update.source_url && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => window.open(update.source_url!, "_blank")}
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View Original PDF
                    </Button>
                  )}
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={handleAnalyzeMarketImpact}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <TrendingUp className="h-5 w-5 mr-2" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Analyze Market Impact"}
                  </Button>
                </div>

                {/* Market Impact Results */}
                {marketImpact && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/30"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-primary">
                        <TrendingUp className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Market Impact Analysis</h3>
                    </div>
                    
                    <div className="prose prose-invert prose-sm max-w-none mb-4">
                      <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {marketImpact.analysis}
                      </p>
                    </div>

                    {marketImpact.sources.length > 0 && (
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          News Sources
                        </h4>
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
                <div className="border-t border-white/10 pt-6">
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
                  <div className="h-64 overflow-y-auto rounded-2xl bg-muted/30 border border-white/10 p-4 mb-4 space-y-4">
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
                              : "bg-white/10 border border-secondary/30 text-foreground shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 border border-secondary/30 rounded-2xl px-4 py-2.5">
                          <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                        </div>
                      </motion.div>
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
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateDetailModal;