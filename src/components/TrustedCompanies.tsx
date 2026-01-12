import { motion } from "framer-motion";

const companies = [
  { name: "Razorpay", initials: "R" },
  { name: "Paytm", initials: "P" },
  { name: "PhonePe", initials: "Ph" },
  { name: "CRED", initials: "C" },
  { name: "Zerodha", initials: "Z" },
  { name: "Groww", initials: "G" },
];

const TrustedCompanies = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Trusted by leading fintech companies
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-semibold text-sm group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  {company.initials}
                </div>
                <span className="font-medium text-sm">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;