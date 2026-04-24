import { motion } from "framer-motion";
import { Check, Users } from "lucide-react";

interface WhoIsThisForProps {
  title?: string;
  subtitle?: string;
  description?: string;
  candidates: string[];
  image?: string;
}

export function WhoIsThisFor({ 
  title = "Is This Treatment Right for You?",
  subtitle = "Ideal Candidates",
  description = "This treatment is perfect for patients who meet the following criteria:",
  candidates,
  image
}: WhoIsThisForProps) {
  return (
    <section className="py-20 md:py-28 bg-muted relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary font-medium">
                <Users className="h-4 w-4" />
                {subtitle}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {title}
              </h2>
              
              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            </div>

            {/* Candidates List */}
            <div className="grid gap-4 sm:grid-cols-2">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate}
                  className="flex items-start gap-3 bg-card rounded-xl p-4 shadow-sm border border-border hover:border-secondary/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-foreground font-medium">{candidate}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {image ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-3xl blur-sm" />
                <img 
                  src={image} 
                  alt="Ideal candidate"
                  className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/10 via-card to-primary/10 flex items-center justify-center">
                <Users className="h-24 w-24 text-secondary/30" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
