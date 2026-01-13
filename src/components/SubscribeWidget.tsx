import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SubscribeWidget = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already on our list!",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: "Subscribed!",
          description: "You'll receive regulatory alerts directly to your inbox.",
        });
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Subscribed!</p>
            <p className="text-xs text-muted-foreground">You'll get alerts directly to your inbox.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl glass-card"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Bell className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="text-sm font-semibold">Subscribe to Updates</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Get real-time regulatory alerts directly to your inbox. No account needed.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/50 border-white/10"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          variant="hero"
          disabled={isLoading || !email.trim()}
          className="h-9 px-4"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    </motion.div>
  );
};

export default SubscribeWidget;
