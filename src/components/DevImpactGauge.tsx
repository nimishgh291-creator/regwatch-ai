import { motion } from "framer-motion";

interface DevImpactGaugeProps {
  score: number; // 1-10
}

const DevImpactGauge = ({ score }: DevImpactGaugeProps) => {
  const normalizedScore = Math.min(Math.max(score, 1), 10);
  const percentage = (normalizedScore / 10) * 100;
  
  const getColor = () => {
    if (normalizedScore <= 3) return "from-green-400 to-green-500";
    if (normalizedScore <= 6) return "from-yellow-400 to-orange-500";
    return "from-orange-500 to-red-500";
  };

  const getLabel = () => {
    if (normalizedScore <= 3) return "Low Impact";
    if (normalizedScore <= 6) return "Medium Impact";
    return "High Impact";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Dev Impact Score</span>
        <span className="text-sm font-bold text-foreground">{normalizedScore}/10</span>
      </div>
      
      {/* Gauge background */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getColor()}`}
        />
        
        {/* Glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getColor()} blur-sm opacity-50`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Label */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColor()}`} />
        <span className="text-xs text-muted-foreground">{getLabel()}</span>
      </div>
    </div>
  );
};

export default DevImpactGauge;
