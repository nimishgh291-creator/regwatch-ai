import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bot, Menu, X, AlertTriangle, CheckCircle, Info, ArrowUpRight, Loader2, Send, Timer, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransition from "@/components/PageTransition";
import SubscribeWidget from "@/components/SubscribeWidget";
import MobileAIChatSheet from "@/components/MobileAIChatSheet";
import UpdateDetailModal from "@/components/UpdateDetailModal";

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
  isNew?: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const riskConfig = {
  high: {
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "High",
  },
  medium: {
    icon: Info,
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    label: "Medium",
  },
  low: {
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    label: "Low",
  },
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  
  // AI Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch updates - removed limit to show all updates
  useEffect(() => {
    fetchUpdates();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel("regulatory_updates_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "regulatory_updates",
        },
        (payload) => {
          const newUpdate = payload.new as RegulatoryUpdate;
          setUpdates((prev) => [{ ...newUpdate, isNew: true }, ...prev]);
          // Remove "new" flag after animation
          setTimeout(() => {
            setUpdates((prev) =>
              prev.map((u) => (u.id === newUpdate.id ? { ...u, isNew: false } : u))
            );
          }, 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("regulatory_updates")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(u => u.category).filter(Boolean) as string[])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter updates based on search and filters
  const filteredUpdates = updates.filter((update) => {
    const matchesSearch = !searchQuery || 
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === "all" || update.risk_level === riskFilter;
    const matchesCategory = categoryFilter === "all" || update.category === categoryFilter;
    
    return matchesSearch && matchesRisk && matchesCategory;
  });

  // Timer for AI response
  useEffect(() => {
    if (isLoading) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

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
            context: null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

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
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (update: RegulatoryUpdate) => {
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
          <div className="p-4">
            <div className="glass-card px-4 py-3 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">RegWatch</span>
              </Link>
              <div className="flex items-center gap-2">
                <MobileAIChatSheet>
                  <Button variant="hero" size="sm" className="gap-2">
                    <Bot className="h-4 w-4" />
                    Chat
                  </Button>
                </MobileAIChatSheet>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-80 z-50 lg:hidden bg-sidebar-background border-r border-white/10 p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">RegWatch</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <SubscribeWidget />
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    ← Back to Home
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 border-r border-white/10 bg-sidebar-background p-6 flex-col z-40">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">RegWatch</span>
          </Link>

          {/* AI Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">AI Assistant</h3>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-muted/30 border border-white/10 p-3 mb-4 space-y-3 chat-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs text-center px-2">
                  Ask about RBI/SEBI regulations...
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
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-xs ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                        : "bg-white/10 border border-secondary/30 text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/10 border border-secondary/30 rounded-xl px-3 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" />
                      <span>{elapsedTime.toFixed(1)}s</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask..."
                className="flex-1 h-9 text-sm bg-muted/50 border-white/10"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                variant="hero"
                size="icon"
                className="h-9 w-9"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Subscribe Widget */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
            <SubscribeWidget />
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              ← Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 pt-24 lg:pt-8 pb-20 px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Regulatory <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Real-time RBI & SEBI compliance tracking for fintech teams.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                className="pl-10 h-10 bg-muted/50 border-white/10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[140px] h-10 bg-muted/50 border-white/10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] h-10 bg-muted/50 border-white/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredUpdates.length} of {updates.length} updates
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredUpdates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                {updates.length === 0 
                  ? "No regulatory updates available yet." 
                  : "No updates match your search criteria."}
              </p>
            </div>
          )}

          {/* Updates Grid */}
          {!loading && filteredUpdates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredUpdates.map((update, index) => {
                const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
                const risk = riskConfig[riskLevel] || riskConfig.low;
                const RiskIcon = risk.icon;

                return (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    onClick={() => handleCardClick(update)}
                    className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${
                      update.isNew ? "ring-2 ring-green-500/50 animate-pulse" : ""
                    }`}
                  >
                    {/* NEW badge */}
                    {update.isNew && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full"
                      >
                        NEW
                      </motion.span>
                    )}
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${risk.className}`}>
                          <RiskIcon className="h-3 w-3" />
                          {risk.label}
                        </span>
                        {update.category && (
                          <span className="text-xs text-muted-foreground">{update.category}</span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {update.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {update.summary || "No summary available"}
                      </p>

                      {update.dev_action && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-2 mb-3">
                          <span className="text-xs text-primary font-medium uppercase tracking-wider">Action Required</span>
                          <p className="text-xs text-foreground mt-0.5 line-clamp-2">{update.dev_action}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>View details</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        {/* Detail Modal */}
        <UpdateDetailModal
          update={selectedUpdate}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedUpdate(null), 300);
          }}
        />

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 lg:left-80 py-3 px-4 lg:px-8 bg-background/80 backdrop-blur-lg border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© 2025 RegWatch AI. Built by Nimish Kalsi.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
