import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MobileAIChatSheetProps {
  children: React.ReactNode;
}

const MobileAIChatSheet = ({ children }: MobileAIChatSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      if (!response.ok) {
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
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] bg-card/95 backdrop-blur-2xl border-t border-white/10">
        <DrawerHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <DrawerTitle className="text-lg">RegWatch AI</DrawerTitle>
                <p className="text-xs text-muted-foreground">Ask about RBI/SEBI regulations</p>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col flex-1 overflow-hidden p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 chat-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4">
                Ask me anything about RBI/SEBI regulations, compliance requirements, or fintech guidelines.
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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 border border-secondary/30 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about regulations..."
              className="flex-1 bg-muted/50 border-white/10"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              variant="hero"
              size="icon"
              className="h-10 w-10"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileAIChatSheet;
