import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "CTO",
    company: "PayFast India",
    avatar: "PS",
    content: "RegWatch has transformed how we handle compliance. What used to take our team days now happens automatically. The AI-powered insights are incredibly accurate.",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    role: "Head of Engineering",
    company: "LendTech",
    avatar: "RM",
    content: "The dev action suggestions are game-changing. Our engineering team can now proactively address regulatory changes before they become blockers.",
  },
  {
    id: "3",
    name: "Anjali Patel",
    role: "Compliance Officer",
    company: "CryptoSecure",
    avatar: "AP",
    content: "Finally, a tool that bridges the gap between compliance and engineering. The real-time alerts have saved us from multiple potential violations.",
  },
  {
    id: "4",
    name: "Vikram Singh",
    role: "Founder",
    company: "NeoBank Pro",
    avatar: "VS",
    content: "We integrated RegWatch in just 2 hours. The ROI was immediate - our compliance team productivity increased by 300% in the first month.",
  },
  {
    id: "5",
    name: "Meera Krishnan",
    role: "VP Engineering",
    company: "InvestEdge",
    avatar: "MK",
    content: "The SEBI tracking is exceptionally thorough. We've caught regulatory updates that our manual process would have missed entirely.",
  },
  {
    id: "6",
    name: "Arjun Reddy",
    role: "CEO",
    company: "QuickLoan",
    avatar: "AR",
    content: "Best investment we've made this year. RegWatch doesn't just track regulations - it translates them into actionable engineering tasks.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-secondary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">engineering teams</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what fintech leaders are saying about RegWatch AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="gradient-border rounded-3xl p-6 bg-card hover:bg-card/80 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
