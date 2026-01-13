import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import founderImage from "@/assets/founder-nimish.jpg";

const FounderSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-white/5"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 glow-primary">
          <img
            src={founderImage}
            alt="Nimish Kalsi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">Nimish Kalsi</p>
        <p className="text-xs text-muted-foreground">Fintech Developer</p>
      </div>
      <a
        href="https://www.linkedin.com/in/nimishkalsi/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl hover:bg-primary/20 transition-colors group"
        aria-label="LinkedIn Profile"
      >
        <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors glow-primary" />
      </a>
    </motion.div>
  );
};

export default FounderSection;
