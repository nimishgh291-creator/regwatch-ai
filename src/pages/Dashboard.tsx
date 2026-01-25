import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bot, Menu, X, AlertTriangle, CheckCircle, Info, ArrowUpRight, Loader2, Send, Timer, Search, Filter, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransition from "@/components/PageTransition";
import SubscribeWidget from "@/components/SubscribeWidget";
import MobileAIChatSheet from "@/components/MobileAIChatSheet";
import ThemeToggle from "@/components/ThemeToggle";

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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch updates
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
      
      const uniqueCategories = [...new Set(data?.map(u => u.category).filter(Boolean) as string[])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter updates
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
      setResponseTime(null);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        if (elapsedTime > 0) {
          setResponseTime(elapsedTime);
        }
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
            context: {
              title: "General Regulatory Query",
              summary: "User is asking a general question about RBI/SEBI regulations",
              detailed_analysis: [],
              dev_action: null,
              risk_level: null,
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

  const handleCardClick = (update: RegulatoryUpdate) => {
    navigate(`/update/${update.id}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-md border-b border-border">
          <div className="px-4 h-14 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">RegWatch</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <MobileAIChatSheet>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bot className="h-4 w-4" />
                  Chat
                </Button>
              </MobileAIChatSheet>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
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
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden bg-background border-r border-border p-4 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg">RegWatch</span>
                </div>
                
                <div className="flex-1 space-y-4">
                  <SubscribeWidget />
                </div>
                
                <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 border-r border-border bg-card p-4 flex-col z-40">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">RegWatch</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* AI Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              {responseTime && !isLoading && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {responseTime.toFixed(1)}s
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto rounded-lg bg-muted/50 border border-border p-3 mb-3 space-y-2 chat-scrollbar">
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
                    className={`max-w-[90%] rounded-lg px-3 py-2 text-xs ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {elapsedTime.toFixed(1)}s
                    </span>
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
                placeholder="Ask a question..."
                className="flex-1 h-9 text-sm bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="h-9 w-9 bg-primary hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Subscribe Widget */}
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            <SubscribeWidget />
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 pb-16">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-2xl lg:text-3xl font-bold mb-1">
                Regulatory Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Real-time RBI & SEBI compliance tracking • {updates.length} updates
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
                  className="pl-10 h-10 bg-background"
                />
              </div>
              <div className="flex gap-3">
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[130px] h-10 bg-background">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px] h-10 bg-background">
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
              <p className="text-xs text-muted-foreground mb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUpdates.map((update, index) => {
                  const riskLevel = (update.risk_level as keyof typeof riskConfig) || "low";
                  const risk = riskConfig[riskLevel] || riskConfig.low;
                  const RiskIcon = risk.icon;

                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                      onClick={() => handleCardClick(update)}
                      className={`p-4 rounded-xl bg-card border border-border hover:border-primary/30 cursor-pointer transition-all hover:shadow-lg relative ${
                        update.isNew ? "ring-2 ring-green-500/50" : ""
                      }`}
                    >
                      {/* NEW badge */}
                      {update.isNew && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">
                          NEW
                        </span>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${risk.className}`}>
                          <RiskIcon className="h-3 w-3" />
                          {risk.label}
                        </span>
                        {update.category && (
                          <span className="text-xs text-muted-foreground">{update.category}</span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {update.title}
                      </h3>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {update.summary || "No summary available"}
                      </p>

                      {update.dev_action && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-2 mb-3">
                          <span className="text-xs text-primary font-medium">Action Required</span>
                          <p className="text-xs text-foreground mt-0.5 line-clamp-2">{update.dev_action}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>View details</span>
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 lg:left-72 py-3 px-4 lg:px-6 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© 2026 RegWatch AI. Built by Nimish Kalsi.</p>
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
